import React from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Edit3, Shirt, Calendar, ChevronRight, LogIn, UserPlus, Key, ShieldCheck } from 'lucide-react';
import { Player } from '../types';

export const UserDashboard: React.FC = () => {
  const {
    currentUser,
    players,
    matches,
    setIsProfileModalOpen,
    setIsAuthModalOpen,
    setActiveTab
  } = useApp();

  // If user is NOT signed in, display a clean sign-in invitation card
  if (!currentUser) {
    return (
      <div className="space-y-4 pb-20">
        <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl p-6 text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shadow-lg shadow-amber-500/10">
            <LogIn className="w-8 h-8 text-amber-400" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-white tracking-tight">
              Player Performance Dashboard
            </h2>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Sign in with your player account to track your individual stats, OVR rating, squad fixtures, and manage your profile.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <Key className="w-4 h-4" />
              <span>Sign In / Join Messi Goat FC</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // When user IS signed in: strictly find this specific signed-in user's player record
  const activePlayer: Player =
    (currentUser.playerId ? players.find(p => p.id === currentUser.playerId) : null) ||
    (currentUser.email ? players.find(p => p.email?.toLowerCase() === currentUser.email.toLowerCase()) : null) ||
    players.find(p => p.name.toLowerCase() === currentUser.name.toLowerCase()) || {
      id: currentUser.playerId || 'player-current',
      name: currentUser.name,
      email: currentUser.email,
      jerseyNumber: 10,
      teamName: 'Messi Goat FC',
      squadName: 'Messi Goat FC',
      ovr: 100,
      position: 'CM',
      preferredFoot: 'Right',
      phone: '+880 1700-000000',
      stats: {
        pace: 100,
        shooting: 100,
        passing: 100,
        dribbling: 100,
        defending: 100,
        physical: 100
      },
      matchesPlayed: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      motmAwards: 0,
      yellowCards: 0,
      redCards: 0,
      isRegisteredByUser: true,
      joinedDate: new Date().toISOString().split('T')[0]
    };

  // Next upcoming match for this player's squad
  const upcomingMatch = matches.find(m =>
    m.status === 'Upcoming' && (m.team1Name === activePlayer.teamName || m.team2Name === activePlayer.teamName)
  );

  const getTierColor = (ovr: number) => {
    if (ovr >= 180) return 'from-amber-400 via-amber-300 to-yellow-500 text-slate-950';
    if (ovr >= 150) return 'from-cyan-400 to-blue-500 text-white';
    if (ovr >= 100) return 'from-emerald-400 to-teal-500 text-white';
    return 'from-slate-300 to-slate-400 text-slate-900';
  };

  const statItems = [
    { label: 'Pace', key: 'pace', val: activePlayer.stats.pace },
    { label: 'Shooting', key: 'shooting', val: activePlayer.stats.shooting },
    { label: 'Passing', key: 'passing', val: activePlayer.stats.passing },
    { label: 'Dribbling', key: 'dribbling', val: activePlayer.stats.dribbling },
    { label: 'Defending', key: 'defending', val: activePlayer.stats.defending },
    { label: 'Physical', key: 'physical', val: activePlayer.stats.physical },
  ];

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner with Stadium Atmosphere */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="h-28 relative">
          <img
            src="/src/assets/images/messi_stadium_banner_1793169549187.jpg"
            alt="Stadium backdrop"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1424] via-[#0d1424]/70 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs text-white">
            <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-semibold text-[11px] text-amber-300">Messi Goat FC</span>
            </div>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-1 text-[11px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded-lg transition-colors shadow-md"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          </div>
        </div>

        {/* Clean Profile Info Overlay */}
        <div className="px-4 pb-4 -mt-10 relative">
          <div className="flex items-end gap-3.5">
            {/* OVR Shield Badge */}
            <div className="relative shrink-0">
              <div className={`w-20 h-24 rounded-xl p-0.5 bg-gradient-to-b ${getTierColor(activePlayer.ovr)} shadow-lg flex flex-col items-center justify-between py-1.5`}>
                <div className="text-center leading-none">
                  <span className="text-3xl font-black font-mono tracking-tight tabular-nums block">
                    {activePlayer.ovr}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider block opacity-90">
                    {activePlayer.position}
                  </span>
                </div>
                <div className="w-5 h-5 flex items-center justify-center">
                  <Shirt className="w-4 h-4 opacity-80" />
                </div>
                <span className="text-[9px] font-black tracking-widest uppercase">
                  #{activePlayer.jerseyNumber}
                </span>
              </div>
            </div>

            {/* Clean Player Name & Squad */}
            <div className="flex-1 min-w-0 pb-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                {activePlayer.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold mt-0.5">
                <span className="truncate">{activePlayer.teamName || activePlayer.squadName || 'Messi Goat FC'}</span>
                {activePlayer.isCaptain && (
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    ⭐ Captain
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Performance Numbers Grid */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#12192c] border border-slate-800/80 rounded-xl p-3 text-center">
          <p className="text-[11px] text-slate-400 font-medium">Matches</p>
          <p className="text-2xl font-black text-white font-mono tabular-nums mt-0.5">
            {activePlayer.matchesPlayed}
          </p>
          <p className="text-[10px] text-slate-500 mt-0.5">Caps for Club</p>
        </div>

        <div className="bg-[#12192c] border border-slate-800/80 rounded-xl p-3 text-center">
          <p className="text-[11px] text-slate-400 font-medium">Goals</p>
          <p className="text-2xl font-black text-amber-400 font-mono tabular-nums mt-0.5">
            {activePlayer.goals}
          </p>
          <p className="text-[10px] text-amber-400/70 mt-0.5">
            {activePlayer.matchesPlayed > 0 ? (activePlayer.goals / activePlayer.matchesPlayed).toFixed(2) : 0}/match
          </p>
        </div>

        <div className="bg-[#12192c] border border-slate-800/80 rounded-xl p-3 text-center">
          <p className="text-[11px] text-slate-400 font-medium">Assists</p>
          <p className="text-2xl font-black text-cyan-400 font-mono tabular-nums mt-0.5">
            {activePlayer.assists}
          </p>
          <p className="text-[10px] text-cyan-400/70 mt-0.5">
            {activePlayer.matchesPlayed > 0 ? (activePlayer.assists / activePlayer.matchesPlayed).toFixed(2) : 0}/match
          </p>
        </div>
      </div>

      {/* Secondary Stats Strip */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#12192c]/70 border border-slate-800/60 rounded-xl p-2.5 text-center">
          <span className="text-[10px] text-slate-400 block">Clean Sheets</span>
          <span className="text-lg font-bold text-emerald-400 font-mono tabular-nums">
            {activePlayer.cleanSheets}
          </span>
        </div>
        <div className="bg-[#12192c]/70 border border-slate-800/60 rounded-xl p-2.5 text-center">
          <span className="text-[10px] text-slate-400 block">MOTM Honors</span>
          <span className="text-lg font-bold text-yellow-400 font-mono tabular-nums">
            {activePlayer.motmAwards} 🏆
          </span>
        </div>
        <div className="bg-[#12192c]/70 border border-slate-800/60 rounded-xl p-2.5 text-center">
          <span className="text-[10px] text-slate-400 block">Cards (Y/R)</span>
          <span className="text-lg font-bold text-slate-300 font-mono tabular-nums">
            {activePlayer.yellowCards}/{activePlayer.redCards}
          </span>
        </div>
      </div>

      {/* Attributes Breakdown */}
      <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Attributes Breakdown</span>
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">1-200 Rating Scale</span>
        </div>

        <div className="space-y-2.5">
          {statItems.map(stat => (
            <div key={stat.key} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{stat.label}</span>
                <span className={`font-mono font-bold tabular-nums ${
                  stat.val >= 160 ? 'text-amber-400' : stat.val >= 120 ? 'text-cyan-400' : stat.val >= 80 ? 'text-emerald-400' : 'text-slate-300'
                }`}>
                  {stat.val}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    stat.val >= 160 ? 'bg-gradient-to-r from-amber-500 to-yellow-300' :
                    stat.val >= 120 ? 'bg-gradient-to-r from-cyan-500 to-blue-400' :
                    stat.val >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                    'bg-slate-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, (stat.val / 200) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Fixture Quick Card */}
      {upcomingMatch ? (
        <div className="bg-gradient-to-br from-[#12192c] to-[#151f38] border border-amber-500/20 rounded-2xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-amber-400 font-semibold mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>Next Matchup</span>
            </span>
            <span className="text-slate-400 font-mono tabular-nums">{upcomingMatch.date} · {upcomingMatch.time}</span>
          </div>

          <div className="flex items-center justify-between gap-2 py-2">
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs text-slate-400">Team 1</p>
              <p className="text-sm font-bold text-white truncate">{upcomingMatch.team1Name}</p>
            </div>
            <div className="text-xs font-black text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg">
              VS
            </div>
            <div className="text-right flex-1 min-w-0">
              <p className="text-xs text-slate-400">Team 2</p>
              <p className="text-sm font-bold text-white truncate">{upcomingMatch.team2Name}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span className="truncate">📍 {upcomingMatch.venue}</span>
            <button
              onClick={() => setActiveTab('fixtures')}
              className="text-amber-400 font-medium hover:underline flex items-center gap-0.5 shrink-0"
            >
              <span>Match Center</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#12192c]/60 border border-slate-800 rounded-xl p-3 text-center text-xs text-slate-400">
          No upcoming scheduled match for {activePlayer.teamName || 'your squad'}. Check the Fixtures tab!
        </div>
      )}

      {/* Notes / Player Bio */}
      {activePlayer.notes && (
        <div className="bg-[#12192c] border border-slate-800 rounded-xl p-3 text-xs text-slate-300">
          <span className="text-amber-400 font-semibold block mb-1">Player Profile Notes</span>
          <p className="italic text-slate-400">{activePlayer.notes}</p>
        </div>
      )}
    </div>
  );
};
