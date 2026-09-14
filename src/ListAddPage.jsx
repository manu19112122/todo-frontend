import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './api/todoApi';
import './App.css';

function ListAddPage() {
    const navigate = useNavigate();
    const [listName, setListName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleAddList = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!listName.trim()) {
            setErrorMessage('リスト名を入力してください。');
            return;
        }
        if (listName.length >= 21) {
            setErrorMessage('文字数は20文字以内にしてください。');
            return;
        }

        try {
            setIsSubmitting(true);
            const currentName = listName;

            await apiClient.post('/lists', {
                listName: currentName
            });

            setSuccessMessage(`リスト：${currentName}が追加されました`);
            setListName('');
        } catch (err) {
            console.error('リスト追加エラー:', err);
            if (err.response && err.response.status === 400) {
                setErrorMessage('既に登録されているリスト名は使用できません');
            } else {
                setErrorMessage('リストの登録に失敗しました。サーバーの接続を確認してください。');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="todo-container">
            <div className="todo-header" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button
                    className="back-button"
                    onClick={() => navigate('/todo/lists')}
                    disabled={isSubmitting}
                    style={{ position: 'absolute', left: 0 }}
                >
                    戻る
                </button>
                <h2 style={{ margin: 0, fontSize: '22px', textAlign: 'center', width: '100%' }}>リストの追加</h2>
            </div>

            <form onSubmit={handleAddList} style={{ marginTop: '40px' }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="新しいリスト名を入力"
                    value={listName}
                    onChange={(e) => {
                        setListName(e.target.value);
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

export default ListAddPage;
