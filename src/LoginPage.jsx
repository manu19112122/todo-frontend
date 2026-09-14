import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

function LoginPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        setErrorMessage('');

        // ログイン処理
        if (username === 'admin' && password === 'password') {

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('username', username);

            // ログイン成功したらTODOリストのトップへ移動
            navigate('/todo');
        } else {
            // エラー時の処理
            setErrorMessage('ユーザー名またはパスワードが正しくありません');
        }
    };

    return (
        <div className="todo-container" style={{ marginTop: '50px' }}>
            <div className="todo-header" style={{ justifyContent: 'center' }}>
                <h2 style={{ margin: 0 }}>ログイン</h2>
            </div>

            <form onSubmit={handleLogin} style={{ marginTop: '40px' }}>
                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>ユーザー名</label>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="ユーザー名を入力してください"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', fontSize: '14px' }}>パスワード</label>
                    <input
                        type="password"
                        className="input-field"
                        placeholder="パスワードを入力してください"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {errorMessage && (
                    <div className="error-text" style={{ color: 'red', marginBottom: '15px', fontWeight: 'bold', textAlign: 'center' }}>
                        {errorMessage}
                    </div>
                )}

                <button type="submit" className="submit-btn" style={{ width: '100%', marginTop: '10px' }}>
                    ログイン
                </button>
            </form>
        </div>
    );
}

export default LoginPage;
