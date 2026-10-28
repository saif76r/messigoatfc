import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Smartphone, Monitor, User, LogIn, LogOut, Edit3, Crown, Cloud } from 'lucide-react';
import { UserRole } from '../types';

export const Header: React.FC = () => {
  const {
    currentUser,
    isCloudSynced,
    setIsAuthModalOpen,
    setIsProfileModalOpen,
    viewMode,
    setViewMode,
    logout
  } = useApp();

  const roleBadgeStyle: Record<UserRole, string> = {
    admin: 'text-amber-400 bg-amber-400/10 border-amber-400/30',
    moderator: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30',
    captain: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30',
    player: 'text-sky-400 bg-sky-400/10 border-sky-400/30'
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0d1322]/95 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-2.5">
      <div className="flex items-center justify-between gap-3 max-w-5xl mx-auto">
        {/* Brand Zone */}
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src="/src/assets/images/messi_goat_fc_logo_1793169548170.jpg"
            alt="Messi Goat FC Crest"
            className="w-9 h-9 rounded-full object-cover border border-amber-500/40 shrink-0 shadow-md shadow-amber-500/10"
          />
          <div className="truncate">
            <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5 truncate">
              <span>Messi Goat FC</span>
              <span className="text-[10px] text-amber-400 font-mono font-bold">#10</span>
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 truncate">
              <span>Player & Match Hub</span>
              {isCloudSynced && (
                <>
                  <span>·</span>
                  <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                    <Cloud className="w-2.5 h-2.5" />
                    <span>Firebase Live</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* User Account & Actions Zone */}
        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle (Desktop only) */}
          <button
            onClick={() => setViewMode(viewMode === 'phone' ? 'full' : 'phone')}
            title={viewMode === 'phone' ? 'Switch to Full Screen View' : 'Switch to Mobile Phone View'}
            className="hidden sm:flex items-center gap-1 px-2 py-1 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg text-[11px] transition-colors"
          >
            {viewMode === 'phone' ? <Monitor className="w-3.5 h-3.5 text-amber-400" /> : <Smartphone className="w-3.5 h-3.5 text-amber-400" />}
            <span>{viewMode === 'phone' ? 'Full' : 'Phone'}</span>
          </button>

          {/* Real User Profile / Sign In Area */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-xl">
              <div className="text-right hidden xs:block max-w-[110px]">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {currentUser.name}
                </p>
                <span className={`inline-block text-[9px] font-mono font-bold uppercase tracking-wider px-1 rounded border mt-0.5 ${roleBadgeStyle[currentUser.role]}`}>
                  {currentUser.role === 'captain' ? '⭐ CAPTAIN' : currentUser.role}
                </span>
              </div>

              {/* Edit My Profile button (Name, Squad, Team OVR) */}
              <button
                onClick={() => setIsProfileModalOpen(true)}
                title="Edit My Player Profile (Name, Squad, Team OVR)"
                className="flex items-center gap-1 px-2 py-1 bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 rounded-lg text-xs font-semibold border border-amber-400/30 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">Edit Profile</span>
              </button>

              {/* Log Out */}
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-0.5"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-transform active:scale-95"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Join</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
