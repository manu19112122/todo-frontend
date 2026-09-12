// src/ListManagementPage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css'; // デザインを読み込む

function ListManagementPage() {
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);

    const fetchLists = async () => {
        try {
            const response = await fetch('http://localhost:8080/lists');
            if (response.ok) {
                const data = await response.json();
                setLists(data);
            }
        } catch (error) {
            console.error('リスト取得エラー:', error);
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    const handleDeleteList = async (listId) => {
        if (!window.confirm('このリストを削除しますか？（リスト内のタスクも同時にすべて削除されます）')) {
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/lists/${listId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                fetchLists();
            }
        } catch (error) {
            console.error('リスト削除エラー:', error);
        }
    };

    const handleBack = () => {
        if (lists.length === 0) {
            navigate('/todo');
        } else {
            navigate('/todo/main');
        }
    };

    return (
        <div className="todo-container"> {/* ★枠組みを統一 */}
            <div className="todo-header">
                <button className="back-button" onClick={handleBack}>
                    戻る
                </button>
                <h2 style={{ margin: 0 }}>リストの管理</h2>
                <button className="nav-button" onClick={() => navigate('/todo/lists/add')}>
                    リストの追加
                </button>
            </div>

            {lists.length === 0 ? (
                <div className="empty-message" style={{ fontSize: '20px', margin: '40px 0' }}>
                    まだリストが登録されていません
                </div>
            ) : (
                <ul className="item-list" style={{ marginTop: '20px' }}>
                    {lists.map((list) => (
                        <li key={list.listId} className="item-style">
                            <span>{list.listName}</span>
                            <button
                                className="delete-btn"
                                style={{ backgroundColor: '#fff', color: '#333', borderColor: '#333' }}
                                onClick={() => handleDeleteList(list.listId)}
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
