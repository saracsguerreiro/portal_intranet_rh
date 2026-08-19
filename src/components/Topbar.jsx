import { Menu, Bell, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Topbar({ onMenuClick, title }) {
  const { user } = useAuth();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center gap-3 px-4 flex-shrink-0">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      <h1 className="font-semibold text-gray-800 text-base flex-1">{title}</h1>

      <div className="flex items-center gap-2">
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-tis-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.avatar}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800 leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.department}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
