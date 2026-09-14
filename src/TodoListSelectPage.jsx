import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from './api/todoApi';

function TodoListSelectPage() {
  const navigate = useNavigate();
  const [listName, setListName] = useState('');
  const [lists, setLists] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      try {
        const response = await apiClient.get('/lists');
        setLists(response.data);
      } catch (error) {
        console.error('バックエンドサーバーに接続できません', error);
      }
    };

    void fetchLists();
  }, []);

  const refreshLists = async () => {
    try {
      const response = await apiClient.get('/lists');
      setLists(response.data);
    } catch (error) {
      console.error('再取得エラー:', error);
    }
  };

  const handleAddList = async (e) => {
    e.preventDefault();

    if (!listName.trim()) {
      alert('リスト名を入力してください。');
      return;
    }
    if (listName.length > 20) {
      alert('リスト名は20文字以内で入力してください。');
      return;
    }

    try {
      const response = await apiClient.post('/lists', { listName: listName });

      if (response.status === 201) {
        setListName('');
        await refreshLists();
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert(error.response.data.message || '入力不備または重複エラーです。');
      } else {
        alert('サーバーとの通信に失敗しました。');
      }
    }
  };

  const handleDeleteList = async (listId) => {
    if (!window.confirm('このリストを削除しますか？（含まれるタスクも削除されます）')) {
      return;
    }

    try {
      const response = await apiClient.delete(`/lists/${listId}`);
      if (response.status === 200 || response.status === 204) {
        await refreshLists();
      } else {
        alert('削除に失敗しました。');
      }
    } catch (err) {
      console.error('通信エラー:', err);
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
                style={{ cursor: 'pointer', color: '#3498db', fontWeight: 'bold', fontSize: '18px', flex: 1, textAlign: 'center' }}
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
