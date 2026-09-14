import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './api/todoApi';
import './App.css';

function TodoTopPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkExistingData = async () => {
            try {
                const response = await apiClient.get('/lists');
                // リストが1件でもあれば、自動的にメイン画面へ進む
                if (response.data && response.data.length > 0) {
                    navigate('/todo/main');
                }
            } catch (error) {
                console.error('サーバー接続エラー:', error);
            } finally {
                setLoading(false);
            }
        };
        void checkExistingData();
    }, [navigate]);


    const handleLogout = () => {
        if (window.confirm('ログアウトしますか？')) {
            localStorage.clear();
            navigate('/todo/login');
        }
    };

    if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;

    return (
        <div className="todo-container">
            {/* ヘッダーエリア */}
            <div className="todo-header">
                <h2>名前未設定</h2>
                <div style={{ display: 'flex', gap: '10px' }}>

                    <button className="nav-button" onClick={handleLogout} style={{ backgroundColor: '#fff', color: '#e74c3c', borderColor: '#e74c3c', cursor: 'pointer' }}>
                        ログアウト
                    </button>
                    <button className="nav-button" onClick={() => navigate('/todo/lists')}>
                        リストの管理
                    </button>
                </div>
            </div>

            {/* タブ*/}
            <div className="tabs">
                <div className="tab active">名前未設定</div>
            </div>

            {/* 削除ボタン*/}
            <div className="action-area">
                <button className="delete-btn" disabled>
                    削除
                </button>
            </div>

            {/* メインメッセージ */}
            <div className="empty-message">
                まだタスクが登録されていません
            </div>

            {/* タスクの追加ボタン */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button className="add-trigger-btn" onClick={() => navigate('/todo/tasks?listId=-1')}>
                    タスクの追加
                </button>
            </div>
        </div>
    );
}

export default TodoTopPage;
