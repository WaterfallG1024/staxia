import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { calculateImportance } from '../utils/taskLogic';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Home() {
  const { addTask } = useAppContext();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      title: title.trim(),
      deadline: deadline || new Date().toISOString(), // 期限未指定なら今日
      importance: calculateImportance(deadline || new Date().toISOString()),
      status: "todo"
    };

    addTask(newTask);
    setTitle('');
    setDeadline('');
    
    // 追加したらStack画面へ遷移
    navigate('/stack');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="w-full max-w-xl text-center space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          STAXIA
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">
          What needs to be stacked?
        </p>
        
        <form onSubmit={handleSubmit} className="relative w-full shadow-2xl rounded-2xl dark:shadow-none bg-white dark:bg-slate-900/50 p-2 ring-1 ring-slate-200 dark:ring-slate-800 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row gap-2">
            <Input 
              type="text"
              placeholder="Add a new task..." 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 h-14 text-lg border-none shadow-none focus-visible:ring-0 bg-transparent px-4"
              autoFocus
            />
            <div className="h-px md:h-14 md:w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <div className="flex gap-2">
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full md:w-[160px] h-14 border-none shadow-none focus-visible:ring-0 bg-transparent text-slate-500 cursor-pointer"
              />
              <Button type="submit" size="lg" className="h-14 px-8 rounded-xl font-semibold shadow-md">
                Stack
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
