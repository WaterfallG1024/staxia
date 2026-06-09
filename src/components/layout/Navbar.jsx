import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Layers, ListTodo, Settings } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Navbar() {
  const navItems = [
    { to: '/', icon: <Home className="w-5 h-5" />, label: 'Home' },
    { to: '/stack', icon: <Layers className="w-5 h-5" />, label: 'Stack' },
    { to: '/list', icon: <ListTodo className="w-5 h-5" />, label: 'List' },
    { to: '/setting', icon: <Settings className="w-5 h-5" />, label: 'Setting' },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-lg rounded-full px-4 py-2 z-50 flex items-center gap-2">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center p-2 rounded-full transition-all duration-300 min-w-[64px]",
              isActive 
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
            )
          }
        >
          {item.icon}
          <span className="text-[10px] font-medium mt-1">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
