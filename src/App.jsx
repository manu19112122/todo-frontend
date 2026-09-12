// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import TodoTopPage from './TodoTopPage';
import TodoMainPage from './TodoMainPage';
import ListManagementPage from './ListManagementPage';
import ListAddPage from './ListAddPage';
import TaskAddPage from './TaskAddPage';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/todo" replace />} />
                <Route path="/todo" element={<TodoTopPage />} />
                <Route path="/todo/main" element={<TodoMainPage />} />
                <Route path="/todo/lists" element={<ListManagementPage />} />
                <Route path="/todo/lists/add" element={<ListAddPage />} />
                <Route path="/todo/tasks" element={<TaskAddPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
