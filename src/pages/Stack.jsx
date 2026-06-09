import React, { useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { usePhysics } from '../components/physics/usePhysics';
import { TaskBlock } from '../components/physics/TaskBlock';

export default function Stack() {
  const { tasks, settings } = useAppContext();
  const { sceneRef, bodiesMap, addTaskBody, removeTaskBody } = usePhysics(settings);
  
  // 初期ロード時やタスク変更時にBodyを同期
  useEffect(() => {
    if (!sceneRef.current) return;
    
    // 現在のコンテナの幅と高さを取得
    const width = sceneRef.current.clientWidth;

    // Todoタスクのみをブロックとして表示
    const todoTasks = tasks.filter(t => t.status === 'todo');

    // 削除されたタスクのBodyを消す
    for (const taskId of bodiesMap.keys()) {
      if (!todoTasks.find(t => t.id === taskId)) {
        removeTaskBody(taskId);
      }
    }

    // 新しいタスクのBodyを追加する
    todoTasks.forEach((task, index) => {
      if (!bodiesMap.has(task.id)) {
        // 出現位置をランダムに散らす
        const x = (width / 2) + (Math.random() * 200 - 100);
        const y = -100 - (index * 150); // 上から順に降ってくるように
        
        addTaskBody(task, x, y);
      }
    });
  }, [tasks, addTaskBody, removeTaskBody, bodiesMap]);

  return (
    <div className="relative w-full h-[calc(100vh-80px)] overflow-hidden bg-slate-50/50 dark:bg-slate-950/50">
      {/* 物理エンジンの当たり判定とマウスイベントを受け取るコンテナ */}
      <div 
        ref={sceneRef} 
        className="absolute inset-0 z-10 touch-none"
      />
      
      {/* 視覚的なDOMブロック（Z-IndexはCanvasより下だがpointer-events-noneなので問題ない） */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {tasks.filter(t => t.status === 'todo').map(task => {
          const body = bodiesMap.get(task.id);
          if (!body) return null;
          return <TaskBlock key={task.id} task={task} body={body} />;
        })}
      </div>
      
      {/* 背景の装飾 */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 dark:opacity-10 z-[-1]">
        <h1 className="text-[15vw] font-black tracking-tighter">STAXIA</h1>
      </div>
    </div>
  );
}
