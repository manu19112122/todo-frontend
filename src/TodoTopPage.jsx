// src/TodoTopPage.jsx
import './App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TodoTopPage() {
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [loading, setLoading] = useState(true);

    // JavaのAPIからリスト一覧を取得して、データがあるかチェックする
    useEffect(() => {
        const checkExistingData = async () => {
            try {
                const response = await fetch('http://localhost:8080/lists');
                if (response.ok) {
                    const data = await response.json();
                    setLists(data);
                    // 仕様書ルール：「既存のデータがある場合は、自動的にTODOリストメイン画面に遷移する」
                    if (data.length > 0) {
                        navigate('/todo/main');
                    }
                }
            } catch (error) {
                console.error('サーバー接続エラー:', error);
            } finally {
                setLoading(false);
            }
        };
        checkExistingData();
    }, [navigate]);

    if (loading) return <div style={{ padding: '20px' }}>読み込み中...</div>;

    return (
        <div className="todo-container">
            {/* ヘッダーエリア */}
            <div className="todo-header">
                <h2>名前未設定</h2>
                <button className="nav-button" onClick={() => navigate('/todo/lists')}>
                    リストの管理
                </button>
            </div>

            {/* タブエリア（名前未設定タブを1つ表示） */}
            <div className="tabs">
                <div className="tab active">名前未設定</div>
            </div>

            {/* 削除ボタンエリア（仕様書：タスクが0件の間は「削除」ボタンは非活性表示とする） */}
            <div className="action-area">
                <button className="delete-btn" disabled>
                    削除
                </button>
            </div>

            {/* メインメッセージ（仕様書：タスクがないため、「まだタスクが登録されていません」とメッセージを表示する） */}
            <div className="empty-message">
                まだタスクが登録されていません
            </div>

            {/* タスクの追加ボタンエリア */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button className="add-trigger-btn" onClick={() => navigate('/todo/tasks')}>
                    タスクの追加
                </button>
            </div>
        </div>
    );
}

export default TodoTopPage;
