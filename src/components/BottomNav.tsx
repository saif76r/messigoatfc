import React from 'react';
import { useApp } from '../context/AppContext';
import { User, Users, Scale, Calendar, Trophy } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, players } = useApp();
  const isAdminOrMod = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  const navItems = [
    {
      id: 'dashboard' as const,
      label: 'My Stats',
      icon: User,
      badge: null
    },
    {
      id: 'roster' as const,
      label: '1-300 Pool',
      icon: Users,
      badge: players.length
    },
    {
      id: 'balance' as const,
      label: 'Squad Pick',
      icon: Scale,
      badge: null
    },
    {
      id: 'fixtures' as const,
      label: 'Fixtures',
      icon: Calendar,
      badge: null
    },
    {
      id: 'admin' as const,
      label: 'Club Hub',
      icon: Trophy,
      badge: isAdminOrMod ? '★' : null
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0b101d]/95 backdrop-blur-lg border-t border-slate-800/90 pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 items-center px-1">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-all relative ${
                isActive ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {item.badge !== null && (
                  <span className="absolute -top-1.5 -right-3 text-[9px] font-mono font-bold px-1 py-0.2 rounded-full bg-amber-500 text-slate-950 min-w-3.5 text-center">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 tracking-tight truncate max-w-full ${isActive ? 'text-amber-400' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-6 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
