// src/TodoMainPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './App.css';

function TodoMainPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // ★URLの「?listId=〇〇」を読み取る設定を追加
    const urlListId = searchParams.get('listId');

    const [lists, setLists] = useState([]);
    const [activeListId, setActiveListId] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [checkedTaskIds, setCheckedTaskIds] = useState({});
    const [errorMessage, setErrorMessage] = useState('');

    const fetchLists = async () => {
        try {
            const response = await fetch('http://localhost:8080/lists');
            if (response.ok) {
                const data = await response.json();
                setLists(data);
                if (data.length === 0) {
                    navigate('/todo');
                    return;
                }

                // ★修正ポイント：URLにlistIdが含まれている場合はそれを最優先で選択し、無ければ一番左を選択
                if (urlListId && data.some(l => l.listId === Number(urlListId))) {
                    setActiveListId(Number(urlListId));
                } else if (!activeListId || !data.some(l => l.listId === activeListId)) {
                    setActiveListId(data[0].listId);
                }
            }
        } catch (error) {
            console.error('リスト取得エラー:', error);
        }
    };

    const fetchTasks = async () => {
        if (!activeListId) return;
        try {
            const response = await fetch(`http://localhost:8080/lists/${activeListId}/tasks`);
            if (response.ok) {
                const data = await response.json();
                setTasks(data);
                setCheckedTaskIds({});
                setErrorMessage('');
            }
        } catch (error) {
            console.error('タスク取得エラー:', error);
        }
    };

    useEffect(() => {
        fetchLists();
    }, [urlListId]); // ★URLのIDが変わったときも再読み込みできるようにする

    useEffect(() => {
        fetchTasks();
    }, [activeListId]);

    // タブを切り替えたときにURLのパラメータも同期させる
    const handleTabClick = (listId) => {
        setActiveListId(listId);
        setSearchParams({ listId: listId });
    };

    const handleCheckChange = (taskId) => {
        setCheckedTaskIds(prev => ({
            ...prev,
            [taskId]: !prev[taskId]
        }));
        setErrorMessage('');
    };

    const handleDeleteTasks = async () => {
        const targetIds = Object.keys(checkedTaskIds).filter(id => checkedTaskIds[id]);
        if (targetIds.length === 0) {
            setErrorMessage('削除するタスクを選択してください');
            return;
        }
        if (!window.confirm('選択したタスクを削除しますか？')) return;

        try {
            for (const id of targetIds) {
                await fetch(`http://localhost:8080/tasks/${id}`, { method: 'DELETE' });
            }
            fetchTasks();
        } catch (error) {
            console.error('タスク削除エラー:', error);
        }
    };

    const activeList = lists.find(l => l.listId === activeListId);

    return (
        <div className="todo-container">
            <div className="todo-header">
                <h2>{activeList ? activeList.listName : 'リスト'}</h2>
                <button className="nav-button" onClick={() => navigate('/todo/lists')}>
                    リストの管理
                </button>
            </div>

            <div className="tabs">
                {lists.map(list => (
                    <div
                        key={list.listId}
                        className={`tab ${list.listId === activeListId ? 'active' : ''}`}
                        onClick={() => handleTabClick(list.listId)} // ★タブクリック処理に変更
                    >
                        {list.listName}
                    </div>
                ))}
            </div>

            <div className="action-area" style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
                <button className="delete-btn" onClick={handleDeleteTasks}>
                    削除
                </button>
                {errorMessage && <span className="error-text">{errorMessage}</span>}
            </div>

            {tasks.length === 0 ? (
                <div className="empty-message" style={{ fontSize: '18px', margin: '40px 0' }}>
                    タスクがありません
                </div>
            ) : (
                <ul className="item-list">
                    {tasks.map(task => (
                        <li key={task.taskId} className="item-style" style={{ justifyContent: 'flex-start', gap: '15px' }}>
                            <input
                                type="checkbox"
                                checked={!!checkedTaskIds[task.taskId]}
                                onChange={() => handleCheckChange(task.taskId)}
                                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                            />
                            <span>{task.taskName}</span>
                        </li>
                    ))}
                </ul>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button className="add-trigger-btn" onClick={() => navigate(`/todo/tasks?listId=${activeListId}`)}>
                    タスクの追加
                </button>
            </div>
        </div>
    );
}

export default TodoMainPage;
