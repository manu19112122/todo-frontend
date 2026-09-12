// src/TaskAddPage.jsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './App.css';

function TaskAddPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // メイン画面から渡された選ばれているリストIDを取得
    const listId = searchParams.get('listId') || '';

    const [taskName, setTaskName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

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
            const response = await fetch(`http://localhost:8080/lists/${listId}/tasks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ taskName: taskName })
            });

            if (response.status === 201) {
                setSuccessMessage(`タスク：${taskName}が登録されました`);
                setTaskName('');
            } else {
                setErrorMessage('タスクの登録に失敗しました');
            }
        } catch (error) {
            setErrorMessage('サーバーとの通信に失敗しました');
        }
    };

    // ★「戻る」ボタンを押したとき、選択していたlistIdをメイン画面（/todo/main）に引き継いで戻る
    const handleBack = () => {
        if (listId) {
            navigate(`/todo/main?listId=${listId}`);
        } else {
            navigate('/todo');
        }
    };

    return (
        <div className="todo-container">
            <div className="todo-header" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button className="back-button" onClick={handleBack} style={{ position: 'absolute', left: 0 }}>
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
                />
                {errorMessage && <span className="error-text">{errorMessage}</span>}
                {successMessage && <span className="success-text">{successMessage}</span>}
                <button type="submit" className="submit-btn">
                    追加
                </button>
            </form>
        </div>
    );
}

export default TaskAddPage;
