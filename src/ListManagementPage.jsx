import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './api/todoApi';
import './App.css';

function ListManagementPage() {
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [hasDeletedAll, setHasDeletedAll] = useState(false);

    useEffect(() => {
        const fetchLists = async () => {
            try {
                setError(null);
                const response = await apiClient.get('/lists');
                let fetchedLists = response.data;

                // 初回読み込み時、Java側が0件の時だけ「名前未設定」を出す
                if (fetchedLists.length === 0 && !hasDeletedAll) {
                    fetchedLists = [{ listId: -1, listName: '名前未設定', isDummy: true }];
                } else {
                    fetchedLists.sort((a, b) => a.listId - b.listId);
                }

                setLists(fetchedLists);
            } catch (err) {
                console.error('リスト取得エラー:', err);
                setError('データの取得に失敗しました。Javaサーバーが起動しているか確認してください。');
            } finally {
                setLoading(false);
            }
        };
        void fetchLists();
    }, [hasDeletedAll]);

    const handleDeleteList = async (list) => {
        if (!window.confirm('このリストを削除しますか？（リスト内のタスクも同時にすべて削除されます）')) {
            return;
        }
        try {
            setDeleteError(null);

            if (list.listId === -1) {
                setLists([]);
                setHasDeletedAll(true);
                return;
            }

            await apiClient.delete(`/lists/${list.listId}`);

            const response = await apiClient.get('/lists');
            let fetchedLists = response.data;

            // リストを削除して0件になった場合は、完全に空にする
            if (fetchedLists.length === 0) {
                setLists([]);
                setHasDeletedAll(true);
            } else {
                fetchedLists.sort((a, b) => a.listId - b.listId);
                setLists(fetchedLists);
            }
        } catch (err) {
            console.error('リスト削除エラー:', err);
            setDeleteError('リストの削除に失敗しました。もう一度お試しください。');
        }
    };

    const handleBack = () => {
        if (lists.length === 0 || (lists.length === 1 && lists[0].listId === -1)) {
            navigate('/todo');
        } else {
            navigate('/todo/main');
        }
    };

    if (loading) {
        return (
            <div className="todo-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <div style={{ fontSize: '18px', color: '#666' }}>データを読み込み中...</div>
            </div>
        );
    }

    return (
        <div className="todo-container">
            <div className="todo-header">
                <button className="back-button" onClick={handleBack}>
                    戻る
                </button>
                <h2 style={{ margin: 0 }}>リストの管理</h2>
                <button className="nav-button" onClick={() => navigate('/todo/lists/add')}>
                    リストの追加
                </button>
            </div>

            {error && (
                <div style={{ color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', margin: '15px 0', textAlign: 'center', fontWeight: 'bold' }}>
                    {error}
                </div>
            )}

            {deleteError && (
                <div style={{ color: 'red', backgroundColor: '#ffebee', padding: '10px', borderRadius: '4px', margin: '15px 0', textAlign: 'center' }}>
                    {deleteError}
                </div>
            )}

            {/* リストが空になった場合はメッセージのみを表示 */}
            {lists.length === 0 ? (
                <div className="empty-message" style={{ fontSize: '20px', margin: '40px 0' }}>
                    登録されているリストはありません
                </div>
            ) : (
                <ul className="item-list" style={{ marginTop: '20px' }}>
                    {lists.map((list) => (
                        <li key={list.listId} className="item-style">
                            <span>{list.listName}</span>
                            <button
                                className="delete-btn"
                                style={{ backgroundColor: '#fff', color: '#333', borderColor: '#333', cursor: 'pointer' }}
                                onClick={() => void handleDeleteList(list)}
                            >
                                削除
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ListManagementPage;
