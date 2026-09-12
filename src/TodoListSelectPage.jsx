import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TodoListSelectPage() {
  const navigate = useNavigate();
  const [listName, setListName] = useState('');

  // 最初は空の配列にしておき、JavaのAPIから取得したデータを入れます
  const [lists, setLists] = useState([]);

  // 【API通信：一覧取得】画面が開いた瞬間に自動でJavaからリスト一覧を読み込む
  const fetchLists = async () => {
    try {
      const response = await fetch('http://localhost:8080/lists');
      if (response.ok) {
        const data = await response.json();
        setLists(data); // Javaから届いたリスト一覧を画面にセット
      } else {
        console.error('リストの取得に失敗しました');
      }
    } catch (error) {
      console.error('バックエンドサーバーに接続できません', error);
    }
  };

  // 画面が表示されたときに実行するおまじない
  useEffect(() => {
    fetchLists();
  }, []);

  // 【API通信：リスト登録】追加ボタンが押されたときの処理
  const handleAddList = async (e) => {
    e.preventDefault();

    // フロント側でのバリデーション（空チェック、21文字以上はエラー）
    if (!listName.trim()) {
      alert('リスト名を入力してください。');
      return;
    }
    if (listName.length > 20) {
      alert('リスト名は20文字以内で入力してください。');
      return;
    }

    try {
      // Javaの POST /lists APIを呼び出す
      const response = await fetch('http://localhost:8080/lists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listName: listName })
      });

      if (response.status === 201) {
        // 登録成功(211ではなく201)
        setListName(''); // 入力欄を空にする
        fetchLists(); // 最新の一覧をJavaから再取得して画面を更新
      } else if (response.status === 400) {
        // Java側から返ってきたエラー（重複など）をキャッチ
        const errorData = await response.json();
        alert(errorData.message || '入力不備または重複エラーです。');
      }
    } catch (error) {
      alert('サーバーとの通信に失敗しました。');
    }
  };

  // 【API通信：リスト削除】削除ボタンが押されたときの処理
  const handleDeleteList = async (listId) => {
    if (!window.confirm('このリストを削除しますか？（含まれるタスクも削除されます）')) {
      return;
    }

    try {
      // Javaの DELETE /lists/{id} APIを呼び出す
      const response = await fetch(`http://localhost:8080/lists/${listId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchLists(); // 削除が成功したら一覧を更新
      } else {
        alert('削除に失敗しました。');
      }
    } catch (error) {
      alert('サーバーとの通信に失敗しました。');
    }
  };

  return (
      <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>TODOアプリ - リスト選択</h2>

        <form onSubmit={handleAddList} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
              type="text"
              placeholder="新しいリスト名を入力"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              style={{ flex: 1, padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px' }}
          />
          <button type="submit" style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}>
            追加
          </button>
        </form>

        <ul style={{ listStyle: 'none', padding: 0 }}>
          {lists.map((list) => (
              <li
                  key={list.listId}
                  style={{
                    padding: '15px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    marginBottom: '10px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                  }}
              >
            <span
                onClick={() => navigate(`/todo/main?listId=${list.listId}`)}
                style={{ cursor: 'pointer', color: '#3498db', fontWeight: 'bold', fontSize: '18px', flex: 1, textSalign: 'center' }}
            >
              {list.listName}
            </span>
                <button
                    onClick={() => handleDeleteList(list.listId)}
                    style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  削除
                </button>
              </li>
          ))}
        </ul>
      </div>
  );
}

export default TodoListSelectPage;
