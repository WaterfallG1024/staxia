import React, { useEffect, useRef } from 'react';
import { cn } from '../../utils/cn';
import { Check, GripHorizontal } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export function TaskBlock({ task, body }) {
  const blockRef = useRef(null);
  const { settings, updateTaskStatus } = useAppContext();

  useEffect(() => {
    if (!body || !blockRef.current) return;

    let animationFrameId;

    const renderLoop = () => {
      if (blockRef.current && body) {
        // bodyの位置と角度をDOMのtransformに同期させる
        const { x, y } = body.position;
        const angle = body.angle;
        // マウスでドラッグしやすいように要素の中心を(0,0)にして配置
        blockRef.current.style.transform = `translate(${x - body.width / 2}px, ${y - body.height / 2}px) rotate(${angle}rad)`;
      }
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    return () => cancelAnimationFrame(animationFrameId);
  }, [body]);

  const handleComplete = () => {
    updateTaskStatus(task.id, 'done');
  };

  if (!body) return null;

  // richモード時のスタイル
  const isRich = settings.mode === 'rich';
  // 重要度で色を変える
  const getGradient = (importance) => {
    if (importance >= 8) return 'from-rose-500 to-orange-500';
    if (importance >= 5) return 'from-amber-400 to-yellow-500';
    return 'from-emerald-400 to-teal-500';
  };

  return (
    <div
      ref={blockRef}
      className={cn(
        "absolute top-0 left-0 flex flex-col justify-between overflow-hidden shadow-lg select-none cursor-grab active:cursor-grabbing",
        "transition-[background,opacity] duration-300 pointer-events-none", // ドラッグ操作はcanvas(matter.js)が受けるため、見た目のdivはイベントを透過させる
        isRich 
          ? `bg-gradient-to-br ${getGradient(task.importance)} text-white rounded-xl border border-white/20` 
          : "bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border-2 border-slate-900 dark:border-white shadow-[4px_4px_0_0_rgba(15,23,42,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]"
      )}
      style={{
        width: body.width,
        height: body.height,
        opacity: task.status === 'done' ? 0.3 : 1,
      }}
    >
      <div className="flex-1 p-3 flex flex-col justify-center items-center text-center overflow-hidden">
        <span className="font-bold text-sm leading-tight line-clamp-2 w-full px-2">
          {task.title}
        </span>
      </div>
    </div>
  );
}
