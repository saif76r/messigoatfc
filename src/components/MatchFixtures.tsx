import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Plus, Trophy, Clock, MapPin, Award, Edit3, Trash2, ShieldCheck, Flame } from 'lucide-react';
import { Match } from '../types';
import { MatchEditModal } from './MatchEditModal';

export const MatchFixtures: React.FC = () => {
  const { matches, currentUser, deleteMatch } = useApp();
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Finished'>('All');
  const [selectedMatchForEdit, setSelectedMatchForEdit] = useState<Match | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdminOrMod = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  const filteredMatches = matches.filter(m => {
    if (filter === 'Upcoming') return m.status === 'Upcoming' || m.status === 'Live';
    if (filter === 'Finished') return m.status === 'Finished';
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Title & Actions */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>Fixtures & Results</span>
          </h2>
          <p className="text-[11px] text-slate-400">Match schedules, live updates & official club results</p>
        </div>

        {isAdminOrMod ? (
          <button
            onClick={() => {
              setSelectedMatchForEdit(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-1.5 text-xs bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg transition-colors shadow-md shadow-amber-500/10 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Match</span>
          </button>
        ) : (
          <span className="text-[10px] text-slate-500 border border-slate-800 px-2 py-1 rounded-md">
            Managed by Admins & Mods
          </span>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#12192c] rounded-xl border border-slate-800">
        {(['All', 'Upcoming', 'Finished'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              filter === tab
                ? 'bg-amber-400 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === 'All' ? 'All Matches' : tab}
          </button>
        ))}
      </div>

      {/* Matches Feed */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
            No matches found in this category.
          </div>
        ) : (
          filteredMatches.map(match => {
            const isFinished = match.status === 'Finished';
            const isLive = match.status === 'Live';

            return (
              <div
                key={match.id}
                className="bg-[#12192c] border border-slate-800/90 rounded-2xl p-4 space-y-3 relative overflow-hidden"
              >
                {/* Top Info Bar */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-400 truncate max-w-[180px]">
                    {match.title}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isLive ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse' :
                      isFinished ? 'bg-slate-800 text-emerald-400' :
                      'bg-slate-800 text-amber-400'
                    }`}>
                      {match.status}
                    </span>

                    {isAdminOrMod && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setSelectedMatchForEdit(match);
                            setIsModalOpen(true);
                          }}
                          title="Edit match or record score"
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteMatch(match.id)}
                          title="Delete fixture"
                          className="p-1 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scoreboard / Versus Section */}
                <div className="grid grid-cols-5 items-center py-1">
                  {/* Team 1 */}
                  <div className="col-span-2 text-left">
                    <p className="text-sm font-bold text-white leading-tight">
                      {match.team1Name}
                    </p>
                  </div>

                  {/* Center Score / VS */}
                  <div className="col-span-1 text-center">
                    {isFinished || isLive ? (
                      <div className="inline-flex items-center gap-2 font-mono font-black text-xl text-white bg-slate-900/90 px-3 py-1 rounded-xl border border-slate-700/80 tabular-nums">
                        <span className="text-amber-400">{match.score?.team1Score ?? 0}</span>
                        <span className="text-slate-600">-</span>
                        <span className="text-cyan-400">{match.score?.team2Score ?? 0}</span>
                      </div>
                    ) : (
                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
                        VS
                      </span>
                    )}
                  </div>

                  {/* Team 2 */}
                  <div className="col-span-2 text-right">
                    <p className="text-sm font-bold text-white leading-tight">
                      {match.team2Name}
                    </p>
                  </div>
                </div>

                {/* Date, Time & Pitch */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800/60 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{match.date} · {match.time}</span>
                  </span>
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span className="truncate">{match.venue}</span>
                  </span>
                </div>

                {/* Match Details: Scorers & MOTM (if finished) */}
                {isFinished && (
                  <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                    {match.scorers && match.scorers.length > 0 && (
                      <div className="text-[11px] text-slate-300">
                        <span className="text-amber-400 font-semibold mr-1">⚽ Goals:</span>
                        <span className="text-slate-400">{match.scorers.join(' · ')}</span>
                      </div>
                    )}

                    {match.motmPlayerName && (
                      <div className="text-[11px] text-amber-300 flex items-center gap-1 font-semibold">
                        <Trophy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Man of the Match:</span>
                        <span className="text-white underline">{match.motmPlayerName}</span>
                      </div>
                    )}
                  </div>
                )}

                {match.referee && (
                  <div className="text-[10px] text-slate-500 flex items-center justify-between">
                    <span>Referee: {match.referee}</span>
                    {match.notes && <span className="italic truncate max-w-[160px]">{match.notes}</span>}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <MatchEditModal
          match={selectedMatchForEdit}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};
