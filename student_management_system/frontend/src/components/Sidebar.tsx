import React from 'react';
import { ActivePage } from '../types';

interface SidebarProps {
  active: ActivePage;
  onNavigate: (page: ActivePage) => void;
}

const navItems: { key: ActivePage; label: string; icon: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { key: 'students', label: 'Students', icon: '🎓' },
  { key: 'teachers', label: 'Teachers', icon: '👩‍🏫' },
  { key: 'courses', label: 'Courses', icon: '📚' },
  { key: 'enrollments', label: 'Enrollments', icon: '📋' },
];

export default function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 bg-slate-800 min-h-screen flex flex-col fixed left-0 top-0 z-40 shadow-xl">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center text-xl">🎓</div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">SMS</h1>
            <p className="text-slate-400 text-xs">Student Management</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer border-0 text-left
              ${active === item.key
                ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30'
                : 'text-slate-400 hover:bg-slate-700 hover:text-white'
              }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-slate-500 text-xs">© 2026 Student Management System</p>
      </div>
    </aside>
  );
}
