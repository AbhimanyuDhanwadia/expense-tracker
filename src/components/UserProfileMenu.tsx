import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User as UserIcon, Moon, Sun, Settings, LogOut } from 'lucide-react';

export default function UserProfileMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 pr-3 bg-white/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-gray-700 dark:text-gray-100 rounded-full transition-all shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-transparent"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700 flex-shrink-0">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-sm">
              {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-4 h-4" />}
            </div>
          )}
        </div>
        <span className="text-sm font-semibold max-w-[100px] truncate hidden sm:block">
          {user.displayName || 'Profile'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 dark:border-slate-700 overflow-hidden z-50 transform origin-top-right transition-all">
          <div className="p-4 border-b border-gray-50 dark:border-slate-700 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 dark:bg-slate-700 mb-3 shadow-inner">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 font-bold text-2xl">
                  {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserIcon className="w-8 h-8" />}
                </div>
              )}
            </div>
            <h3 className="font-bold text-gray-900 dark:text-white truncate w-full">{user.displayName || 'User'}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate w-full">{user.email || 'No email'}</p>
          </div>
          
          <div className="p-2">
            <button 
              onClick={toggleDarkMode}
              className="w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                Theme
              </div>
              <span className="text-xs font-semibold bg-gray-100 dark:bg-slate-900 px-2 py-1 rounded-md text-gray-500 dark:text-gray-400">
                {darkMode ? 'Dark' : 'Light'}
              </span>
            </button>
            <button 
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4" />
              Account Settings
            </button>
          </div>
          
          <div className="p-2 border-t border-gray-50 dark:border-slate-700">
            <button 
              onClick={() => {
                setIsOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
