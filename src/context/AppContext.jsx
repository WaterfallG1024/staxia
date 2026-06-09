import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState([
    // 初期データのサンプル
    {
      id: "1",
      title: "プロジェクトの企画書作成",
      deadline: new Date().toISOString(),
      importance: 10,
      status: "todo"
    },
    {
      id: "2",
      title: "チームミーティングの準備",
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3日後
      importance: 7,
      status: "todo"
    }
  ]);

  const [settings, setSettings] = useState({
    gravity: 1.0,       // 0.1 ~ 3.0
    animation: true,
    speed: 1.0,         // 0.5 ~ 2.0
    mode: "rich",       // "rich" | "light"
  });

  const addTask = (task) => {
    setTasks(prev => [...prev, task]);
  };

  const updateTaskStatus = (id, status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <AppContext.Provider value={{
      tasks,
      settings,
      addTask,
      updateTaskStatus,
      deleteTask,
      updateSetting
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
