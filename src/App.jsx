import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import TodoTopPage from './TodoTopPage';
import TodoMainPage from './TodoMainPage';
import ListManagementPage from './ListManagementPage';
import ListAddPage from './ListAddPage';
import TaskAddPage from './TaskAddPage';
import LoginPage from './LoginPage';


function ProtectedRoute({ children }) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    if (!isLoggedIn) {

        return <Navigate to="/todo/login" replace />;
    }

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/todo/login" element={<LoginPage />} />

                <Route path="/" element={<Navigate to="/todo" replace />} />

                <Route path="/todo" element={
                    <ProtectedRoute>
                        <TodoTopPage />
                    </ProtectedRoute>
                } />
                <Route path="/todo/main" element={
                    <ProtectedRoute>
                        <TodoMainPage />
                    </ProtectedRoute>
                } />
                <Route path="/todo/lists" element={
                    <ProtectedRoute>
                        <ListManagementPage />
                    </ProtectedRoute>
                } />
                <Route path="/todo/lists/add" element={
                    <ProtectedRoute>
                        <ListAddPage />
                    </ProtectedRoute>
                } />
                <Route path="/todo/tasks" element={
                    <ProtectedRoute>
                        <TaskAddPage />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
