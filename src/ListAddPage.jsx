// src/ListAddPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function ListAddPage() {
    const navigate = useNavigate();
    const [listName, setListName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // ★追加成功メッセージ用の状態

    const handleAddList = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage(''); // メッセージを一旦リセット

        if (!listName.trim()) {
            setErrorMessage('リスト名を入力してください');
            return;
        }
        if (listName.length >= 21) {
            setErrorMessage('文字数は20文字以内にして入力してください');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/lists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listName: listName })
            });

            if (response.status === 201) {
                // ★修正①・②：管理画面に戻らず、入力欄の下に成功メッセージを表示する
                setSuccessMessage(`リスト：${listName}は追加されました`);
                setListName(''); // 次の入力のために欄を空にする
            } else if (response.status === 400) {
                setErrorMessage('既に登録されているリスト名は使用できません');
            }
        } catch (error) {
            setErrorMessage('サーバーとの通信に失敗しました');
        }
    };

    return (
        <div className="todo-container">
            {/* ヘッダーエリア */}
            <div className="todo-header" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* 戻るボタンは左端に固定 */}
                <button className="back-button" onClick={() => navigate('/todo/lists')} style={{ position: 'absolute', left: 0 }}>
                    戻る
                </button>
                {/* ★修正③：タイトル名を真ん中（中央）に配置 */}
                <h2 style={{ margin: 0, fontSize: '22px', textAlign: 'center', width: '100%' }}>リストの追加</h2>
            </div>

            <form onSubmit={handleAddList} style={{ marginTop: '40px' }}>
                <input
                    type="text"
                    className="input-field"
                    placeholder="リスト名を入力してください"
                    value={listName}
                    onChange={(e) => {
                        setListName(e.target.value);
                        if (errorMessage) setErrorMessage('');
                        if (successMessage) setSuccessMessage(''); // 文字入力を始めたらメッセージを消す
                    }}
                    maxLength={25}
                />

                {/* エラーメッセージ（赤字） */}
                {errorMessage && <span className="error-text">{errorMessage}</span>}

                {/* ★修正②：追加成功メッセージ（緑字で入力欄の下に表示） */}
                {successMessage && <span className="success-text">{successMessage}</span>}

                <button type="submit" className="submit-btn">
                    追加
                </button>
            </form>
        </div>
    );
}

export default ListAddPage;
