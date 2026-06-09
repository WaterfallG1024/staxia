import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Switch } from '../components/ui/Switch';
import { cn } from '../utils/cn';
import { format, parseISO } from 'date-fns';

export default function List() {
  const { tasks, updateTaskStatus } = useAppContext();

  // todoが上、doneが下に来るようにソート
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === b.status) {
      return new Date(a.deadline) - new Date(b.deadline);
    }
    return a.status === 'todo' ? -1 : 1;
  });

  return (
    <div className="p-6 md:p-12 animate-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Task List</h1>
          <p className="text-slate-500">Manage your stacked tasks.</p>
        </div>

        <Card className="border-none shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedTasks.length === 0 ? (
              <p className="text-center text-slate-500 py-8">No tasks yet.</p>
            ) : (
              sortedTasks.map(task => (
                <div 
                  key={task.id} 
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border transition-all duration-300",
                    task.status === 'done' 
                      ? "bg-slate-50 border-slate-100 opacity-60 dark:bg-slate-900 dark:border-slate-800" 
                      : "bg-white border-slate-200 shadow-sm dark:bg-slate-950 dark:border-slate-800"
                  )}
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className={cn(
                      "font-semibold truncate transition-all duration-300",
                      task.status === 'done' ? "line-through text-slate-500" : "text-slate-900 dark:text-slate-50"
                    )}>
                      {task.title}
                    </h3>
                    <div className="flex gap-4 mt-1 text-xs text-slate-500">
                      <span>Deadline: {format(parseISO(task.deadline), 'MMM d, yyyy')}</span>
                      <span>Importance: {task.importance}/10</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-slate-500">
                      {task.status === 'done' ? 'Done' : 'Todo'}
                    </span>
                    <Switch 
                      checked={task.status === 'done'} 
                      onCheckedChange={(checked) => updateTaskStatus(task.id, checked ? 'done' : 'todo')}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
