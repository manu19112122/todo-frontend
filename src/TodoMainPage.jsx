import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from './api/todoApi';
import './App.css';

function TodoMainPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const urlListId = searchParams.get('listId');

    const [lists, setLists] = useState([]);
    const [activeListId, setActiveListId] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [checkedTaskIds, setCheckedTaskIds] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const fetchListsAndCleanUp = async () => {
            try {
                setErrorMessage('');

                // サーバーからリスト一覧を取得
                const listRes = await apiClient.get('/lists');
                let fetchedLists = listRes.data;


                const hasOtherList = fetchedLists.some(l => l.listName !== '名前未設定');
                const defaultList = fetchedLists.find(l => l.listName === '名前未設定');

                if (hasOtherList && defaultList) {
                    try {
                        await apiClient.delete(`/lists/${defaultList.listId}`);

                        // 消去した後の最新のリスト一覧を再取得する
                        const updatedListRes = await apiClient.get('/lists');
                        fetchedLists = updatedListRes.data;
                    } catch (cleanUpErr) {
                        console.error('不要になったデフォルトリストの削除に失敗しました:', cleanUpErr);
                    }
                }

                // リストを登録順に並び替える
                fetchedLists.sort((a, b) => a.listId - b.listId);

                // Java側にリストが1件も存在しない時だけ、画面上に名前未設定を表示する
                if (fetchedLists.length === 0) {
                    const dummyList = { listId: -1, listName: '名前未設定' };
                    fetchedLists = [dummyList];
                }

                setLists(fetchedLists);

                if (fetchedLists.length === 0) {
                    navigate('/todo');
                    return;
                }

                // アクティブにするタブの選択
                if (urlListId && fetchedLists.some(l => l.listId === Number(urlListId))) {
                    setActiveListId(Number(urlListId));
                } else if (!activeListId || !fetchedLists.some(l => l.listId === activeListId)) {

                    setActiveListId(fetchedLists[0]?.listId || null);
                }
            } catch (error) {
                console.error('リスト取得エラー:', error);
                setErrorMessage('リストデータの取得に失敗しました。サーバーの接続を確認してください。');
            } finally {
                setLoading(false);
            }
        };
        void fetchListsAndCleanUp();
    }, [urlListId, activeListId, navigate]);

    useEffect(() => {
        const fetchTasks = async () => {
            if (activeListId === null || activeListId === undefined) return;
            try {
                const response = await apiClient.get(`/lists/${activeListId}/tasks`);
                setTasks(response.data);
                setCheckedTaskIds({});
                setErrorMessage('');
            } catch (error) {
                console.error('タスク取得エラー:', error);
                setTasks([]);
            }
        };
        void fetchTasks();
    }, [activeListId]);

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
            setIsDeleting(true);
            setErrorMessage('');

            for (const id of targetIds) {
                await apiClient.delete(`/tasks/${id}`);
            }

            const response = await apiClient.get(`/lists/${activeListId}/tasks`);
            setTasks(response.data);
            setCheckedTaskIds({});
        } catch (error) {
            console.error('タスク削除エラー:', error);
            setErrorMessage('タスクの削除中にエラーが発生しました');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleLogout = () => {
        if (window.confirm('ログアウトしますか？')) {
            localStorage.clear();
            navigate('/todo/login');
        }
    };

    const activeList = lists.find(l => l.listId === activeListId);

    if (loading && lists.length === 0) {
        return (
            <div className="todo-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                <div style={{ fontSize: '18px', color: '#666' }}>データを読み込み中...</div>
            </div>
        );
    }

    return (
        <div className="todo-container">
            <div className="todo-header">
                <h2>{activeList ? activeList.listName : 'リスト'}</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="nav-button" onClick={handleLogout} style={{ backgroundColor: '#fff', color: '#e74c3c', borderColor: '#e74c3c' }}>
                        ログアウト
                    </button>
                    <button className="nav-button" onClick={() => navigate('/todo/lists')} disabled={isDeleting}>
                        リストの管理
                    </button>
                </div>
            </div>

            <div className="tabs">
                {lists.map(list => (
                    <div
                        key={list.listId}
                        className={`tab ${list.listId === activeListId ? 'active' : ''}`}
                        onClick={() => !isDeleting && handleTabClick(list.listId)}
                    >
                        {list.listName}
                    </div>
                ))}
            </div>

            <div className="action-area" style={{ flexDirection: 'column', alignItems: 'flex-end', minHeight: '50px' }}>
                <button
                    className="delete-btn"
                    onClick={handleDeleteTasks}
                    disabled={isDeleting || tasks.length === 0}
                    style={{
                        cursor: (isDeleting || tasks.length === 0) ? 'not-allowed' : 'pointer',
                        opacity: (isDeleting || tasks.length === 0) ? 0.6 : 1
                    }}
                >
                    {isDeleting ? '削除中...' : '削除'}
                </button>
                {errorMessage && <span className="error-text" style={{ color: 'red', marginTop: '5px', fontWeight: 'bold' }}>⚠️ {errorMessage}</span>}
            </div>

            {tasks.length === 0 ? (
                <div className="empty-message" style={{ fontSize: '18px', margin: '40px 0' }}>
                    まだタスクが登録されていません
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
                                disabled={isDeleting}
                            />
                            <span>{task.taskName}</span>
                        </li>
                    ))}
                </ul>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button
                    className="add-trigger-btn"
                    onClick={() => navigate(`/todo/tasks?listId=${activeListId}`)}
                    disabled={isDeleting}
                >
                    タスクの追加
                </button>
            </div>
        </div>
    );
}

export default TodoMainPage;
