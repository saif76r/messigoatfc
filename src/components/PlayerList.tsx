import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, UserPlus, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Shield, Zap, Sparkles, Crown, Star } from 'lucide-react';
import { Player, Position } from '../types';
import { TEAMS, POSITIONS } from '../data/mockPlayers';

export const PlayerList: React.FC = () => {
  const {
    players,
    currentUser,
    setSelectedPlayer,
    setIsPlayerModalOpen,
    toggleCaptain
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('All');
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [captainsOnly, setCaptainsOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'ovr_desc' | 'ovr_asc' | 'goals' | 'assists' | 'matches'>('ovr_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const isAdminOrMod = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  // Filter & Sort
  const filteredPlayers = useMemo(() => {
    return players.filter(player => {
      const matchesSearch =
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.phone.includes(searchQuery) ||
        player.jerseyNumber.toString() === searchQuery.trim() ||
        player.teamName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTeam = selectedTeam === 'All' || player.teamName === selectedTeam;
      const matchesPos = selectedPosition === 'All' || player.position === selectedPosition;
      const matchesCaptain = !captainsOnly || player.isCaptain;

      return matchesSearch && matchesTeam && matchesPos && matchesCaptain;
    }).sort((a, b) => {
      if (sortBy === 'ovr_desc') return b.ovr - a.ovr;
      if (sortBy === 'ovr_asc') return a.ovr - b.ovr;
      if (sortBy === 'goals') return b.goals - a.goals;
      if (sortBy === 'assists') return b.assists - a.assists;
      if (sortBy === 'matches') return b.matchesPlayed - a.matchesPlayed;
      return 0;
    });
  }, [players, searchQuery, selectedTeam, selectedPosition, captainsOnly, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredPlayers.length / pageSize) || 1;
  const paginatedPlayers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPlayers.slice(start, start + pageSize);
  }, [filteredPlayers, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getOvrColor = (ovr: number) => {
    if (ovr >= 170) return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
    if (ovr >= 140) return 'text-cyan-400 bg-cyan-400/10 border-cyan-400/30';
    if (ovr >= 100) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
    return 'text-slate-300 bg-slate-800 border-slate-700';
  };

  const totalCaptains = players.filter(p => p.isCaptain).length;

  return (
    <div className="space-y-3.5 pb-20">
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
            <span>Roster Pool</span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md tabular-nums">
              {players.length} Players
            </span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Player list with Team OVR, Squads & Admin Captain Controls
          </p>
        </div>

        {isAdminOrMod && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setSelectedPlayer(null); // new player mode
                setIsPlayerModalOpen(true);
              }}
              className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition-colors shadow-md shadow-amber-500/10"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Player</span>
            </button>
          </div>
        )}
      </div>

      {/* Admin Captain Hint if Admin/Mod */}
      {isAdminOrMod && (
        <div className="bg-amber-400/10 border border-amber-400/20 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-300">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Admin Power:</strong> You can assign as many Captains as you want among the 300 players.
            </span>
          </div>
          <span className="font-mono text-xs font-bold text-amber-400 shrink-0 ml-2">
            {totalCaptains} Captains
          </span>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search player by name, squad name, jersey # or phone..."
          className="w-full bg-[#12192c] border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2"
          >
            Clear
          </button>
        )}
      </div>

      {/* Filter Chips Bar (Clean Segmented) */}
      <div className="space-y-2">
        {/* Teams filter + Captains filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {/* Captains quick toggle */}
          <button
            onClick={() => {
              setCaptainsOnly(!captainsOnly);
              setCurrentPage(1);
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap shrink-0 transition-colors font-bold flex items-center gap-1 ${
              captainsOnly
                ? 'bg-amber-400 text-slate-950 shadow-md'
                : 'bg-[#12192c] text-amber-400 border border-amber-400/30 hover:bg-slate-800'
            }`}
          >
            <Crown className="w-3 h-3" />
            <span>Captains Only ({totalCaptains})</span>
          </button>

          <span className="text-[10px] text-slate-500 font-medium uppercase shrink-0 mr-0.5">Squad:</span>
          {['All', ...TEAMS].map(team => (
            <button
              key={team}
              onClick={() => {
                setSelectedTeam(team);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap shrink-0 transition-colors font-medium ${
                selectedTeam === team
                  ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                  : 'bg-[#12192c] text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {team}
            </button>
          ))}
        </div>

        {/* Position & Sort Filter */}
        <div className="flex items-center justify-between gap-2 text-xs">
          {/* Position Selector */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none flex-1">
            <span className="text-[10px] text-slate-500 font-medium uppercase shrink-0 mr-0.5">Pos:</span>
            {['All', 'ST', 'RW', 'LW', 'CAM', 'CM', 'CDM', 'CB', 'GK'].map(pos => (
              <button
                key={pos}
                onClick={() => {
                  setSelectedPosition(pos);
                  setCurrentPage(1);
                }}
                className={`px-2 py-0.5 rounded text-[11px] font-mono shrink-0 ${
                  selectedPosition === pos
                    ? 'bg-slate-700 text-amber-400 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-1 shrink-0">
            <label htmlFor="sort-by-select" className="sr-only">Sort Players</label>
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="sort-by-select"
              aria-label="Sort Players"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#12192c] border border-slate-700 text-[11px] text-slate-300 rounded px-2 py-1 focus:outline-none focus:border-amber-400"
            >
              <option value="ovr_desc">Highest OVR</option>
              <option value="ovr_asc">Lowest OVR</option>
              <option value="goals">Top Scorers</option>
              <option value="assists">Top Assists</option>
              <option value="matches">Most Caps</option>
            </select>
          </div>
        </div>
      </div>

      {/* Players List Table / Cards */}
      <div className="space-y-1.5">
        {paginatedPlayers.length === 0 ? (
          <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No players found matching your criteria. Try adjusting filters or search.
          </div>
        ) : (
          paginatedPlayers.map((player, index) => {
            const globalIndex = (currentPage - 1) * pageSize + index + 1;
            const isAdmin = player.email === 'admingoat@gmail.com';
            const isMod = player.email === 'joy@gmail.com';

            return (
              <div
                key={player.id}
                onClick={() => {
                  setSelectedPlayer(player);
                  setIsPlayerModalOpen(true);
                }}
                className="bg-[#12192c] hover:bg-[#162038] border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 flex items-center justify-between gap-2.5 transition-colors cursor-pointer active:scale-[0.99]"
              >
                {/* Left: Index & OVR */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] text-slate-500 font-mono w-5 text-right tabular-nums">
                    {globalIndex}
                  </span>

                  <div className={`w-10 h-10 rounded-lg border flex flex-col items-center justify-center font-mono ${getOvrColor(player.ovr)}`}>
                    <span className="text-sm font-black leading-none tabular-nums">{player.ovr}</span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">{player.position}</span>
                  </div>
                </div>

                {/* Middle: Name, Team, Jersey, Phone & Captain badge */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-xs font-bold text-white truncate">
                      {player.name}
                    </h3>
                    {player.isCaptain && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-400/40 shrink-0 flex items-center gap-0.5">
                        <Crown className="w-2.5 h-2.5" />
                        <span>CAPTAIN</span>
                      </span>
                    )}
                    {isAdmin && (
                      <span className="text-[9px] bg-amber-400/20 text-amber-400 font-mono px-1 rounded font-bold shrink-0">
                        ADMIN
                      </span>
                    )}
                    {isMod && (
                      <span className="text-[9px] bg-cyan-400/20 text-cyan-400 font-mono px-1 rounded font-bold shrink-0">
                        MOD
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5 truncate">
                    <span className="font-mono text-amber-400/80 font-bold">#{player.jerseyNumber}</span>
                    <span>·</span>
                    <span className="text-slate-300 font-medium truncate">{player.teamName}</span>
                    <span>·</span>
                    <span className="text-slate-500 font-mono tabular-nums">{player.phone}</span>
                  </div>
                </div>

                {/* Right: Admin Captain Toggle / Stats */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Admin/Mod Captain Toggle Button */}
                  {isAdminOrMod && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCaptain(player.id);
                      }}
                      title={player.isCaptain ? 'Demote from Captain' : 'Appoint as Team Captain'}
                      className={`p-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                        player.isCaptain
                          ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:text-amber-400 hover:bg-slate-700 border border-slate-700'
                      }`}
                    >
                      <Crown className="w-3 h-3" />
                      <span className="hidden xs:inline">
                        {player.isCaptain ? 'Captain' : '+ Make Cap'}
                      </span>
                    </button>
                  )}

                  {/* Stats summary */}
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-amber-400 tabular-nums">
                      {player.goals} G <span className="text-slate-500 font-normal">/</span> {player.assists} A
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                      {player.matchesPlayed} caps
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800 text-xs">
          <p className="text-[11px] text-slate-400 font-mono tabular-nums">
            Showing {(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredPlayers.length)} of {filteredPlayers.length}
          </p>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-[#12192c] border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 py-1 text-xs font-mono font-semibold text-amber-400 bg-amber-400/10 rounded-md tabular-nums">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-[#12192c] border border-slate-800 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
