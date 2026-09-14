import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from './api/todoApi';
import './App.css';

function TaskAddPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();


    const initialListId = searchParams.get('listId') || '';

    const [taskName, setTaskName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleAddTask = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!taskName.trim()) {
            setErrorMessage('タスクを入力してください');
            return;
        }
        if (taskName.length >= 21) {
            setErrorMessage('文字数は20文字以内にして入力してください');
            return;
        }

        try {
            setIsSubmitting(true);

            let targetListId = initialListId;

            if (targetListId === '-1') {
                try {
                    const createListResponse = await apiClient.post('/lists', {
                        listName: '名前未設定'
                    });
                    targetListId = createListResponse.data.listId;
                } catch (listErr) {
                    console.error('名前未設定リストの作成リトライ:', listErr);
                    const listRes = await apiClient.get('/lists');
                    const existingDummy = listRes.data.find(l => l.listName === '名前未設定');
                    if (existingDummy) {
                        targetListId = existingDummy.listId;
                    } else {
                        throw new Error('リストの自動作成に失敗しました', { cause: listErr });
                    }
                }
            }

            const response = await apiClient.post(`/lists/${targetListId}/tasks`, {
                taskName: taskName
            });

            if (response.status === 201) {
                setSuccessMessage(`タスク：${taskName}が登録されました`);
                setTaskName('');
            } else {
                setErrorMessage('タスクの登録に失敗しました');
            }
        } catch (error) {
            console.error('タスク追加エラー:', error);
            setErrorMessage('サーバーとの通信に失敗しました');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (initialListId) {
            navigate(`/todo/main?listId=${initialListId}`);
        } else {
            navigate('/todo');
        }
    };

    return (
        <div className="todo-container">
            <div className="todo-header" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button
                    className="back-button"
                    onClick={handleBack}
                    style={{ position: 'absolute', left: 0 }}
                    disabled={isSubmitting}
                >
                    戻る
                </button>
                <h2 style={{ margin: 0, fontSize: '22px', textAlign: 'center', width: '100%' }}>タスクの追加</h2>
            </div>

            <form onSubmit={handleAddTask} style={{ marginTop: '40px' }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="タスクを入力してください"
                    value={taskName}
                    onChange={(e) => {
                        setTaskName(e.target.value);
                        if (errorMessage) setErrorMessage('');
                        if (successMessage) setSuccessMessage('');
                    }}
                    maxLength={25}
                    disabled={isSubmitting}
                />
                {errorMessage && <span className="error-text">{errorMessage}</span>}
                {successMessage && <span className="success-text">{successMessage}</span>}

                <button
                    type="submit"
                    className="submit-btn"
                    style={{ cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}
                    disabled={isSubmitting}
                >
                    {isSubmitting ? '追加中...' : '追加'}
                </button>
            </form>
        </div>
    );
}

export default TaskAddPage;
