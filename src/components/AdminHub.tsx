import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Trophy, Crown, Plus, Calendar, Medal, Trash2, X, Check, Award, Star, Shield } from 'lucide-react';
import { TEAMS } from '../data/mockPlayers';
import { TournamentWinner } from '../types';

export const AdminHub: React.FC = () => {
  const {
    currentUser,
    tournamentWinners,
    addTournamentWinner,
    deleteTournamentWinner,
    players,
    currentTournamentName
  } = useApp();

  const isAdminOrMod = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  const [isAddWinnerOpen, setIsAddWinnerOpen] = useState(false);
  const [tournamentName, setTournamentName] = useState(currentTournamentName);
  const [winnerSquad, setWinnerSquad] = useState<string>(TEAMS[0]);
  const [customWinnerSquad, setCustomWinnerSquad] = useState('');
  const [isCustomWinnerSquad, setIsCustomWinnerSquad] = useState(false);
  const [winningCaptain, setWinningCaptain] = useState(players[0]?.name || 'Lionel "Goat" Messi');
  const [runnerUpSquad, setRunnerUpSquad] = useState<string>(TEAMS[1]);
  const [finalScore, setFinalScore] = useState('3 - 1');
  const [mvpPlayer, setMvpPlayer] = useState(players[0]?.name || 'Lionel Messi');
  const [trophyName, setTrophyName] = useState('Goat Champions Trophy');
  const [notes, setNotes] = useState('Glorious tournament victory with undefeated run.');

  const handleAddWinner = (e: React.FormEvent) => {
    e.preventDefault();
    const finalWinnerSquadName = isCustomWinnerSquad && customWinnerSquad.trim() ? customWinnerSquad.trim() : winnerSquad;
    if (!tournamentName.trim() || !finalWinnerSquadName) return;

    addTournamentWinner({
      tournamentName: tournamentName.trim(),
      winnerSquad: finalWinnerSquadName,
      winningCaptain: winningCaptain.trim(),
      runnerUpSquad: runnerUpSquad.trim() || undefined,
      finalScore: finalScore.trim() || undefined,
      mvpPlayer: mvpPlayer.trim() || undefined,
      trophyName: trophyName.trim() || 'Champions Trophy',
      notes: notes.trim() || undefined,
      date: new Date().toISOString().split('T')[0]
    });

    setIsAddWinnerOpen(false);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Banner / Hall of Fame Header */}
      <div className="bg-gradient-to-br from-[#131c33] via-[#10172b] to-[#0a0f1d] border border-amber-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-400">
                <Trophy className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-black text-white tracking-tight">
                Tournament Winners
              </h2>
            </div>
            <p className="text-[11px] text-slate-300 mt-1 max-w-sm">
              Messi Goat FC Champions Wall & Tournament Winners Hall of Fame.
            </p>
          </div>

          {/* Admin / Mod Button to Record New Tournament Winner */}
          {isAdminOrMod ? (
            <button
              onClick={() => {
                setTournamentName(currentTournamentName);
                setIsAddWinnerOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-xl text-xs shadow-md shadow-amber-500/20 transition-transform active:scale-95 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Record Winner</span>
            </button>
          ) : (
            <div className="text-right">
              <span className="text-[10px] text-amber-400 font-mono font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                Official Hall of Fame
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Tournament Winners List */}
      <div className="space-y-3">
        {tournamentWinners.length === 0 ? (
          <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-8 text-center space-y-2">
            <Trophy className="w-10 h-10 text-amber-400/40 mx-auto" />
            <p className="text-sm font-bold text-white">No Tournament Winners Recorded Yet</p>
            <p className="text-xs text-slate-400">
              {isAdminOrMod ? 'Click "+ Record Winner" above to record the first tournament champion!' : 'Tournament results will appear here.'}
            </p>
          </div>
        ) : (
          tournamentWinners.map((winner, idx) => (
            <div
              key={winner.id}
              className="bg-[#12192c] border border-amber-500/25 rounded-2xl p-4 shadow-lg hover:border-amber-400/50 transition-colors relative overflow-hidden group"
            >
              {/* Gold Ribbon / Rank */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-black text-amber-400 flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{winner.trophyName || 'Champions Cup'}</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">· {winner.date}</span>
                  </div>
                  <h3 className="text-base font-black text-white tracking-tight mt-0.5">
                    {winner.tournamentName}
                  </h3>
                </div>

                {isAdminOrMod && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Delete record for ${winner.tournamentName}?`)) {
                        deleteTournamentWinner(winner.id);
                      }
                    }}
                    title="Delete record (Admin/Mod only)"
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Champion Squad Banner */}
              <div className="bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-400/30 rounded-xl p-3 mb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                      CHAMPION SQUAD
                    </span>
                    <p className="text-base font-black text-white mt-0.5">
                      🏆 {winner.winnerSquad}
                    </p>
                  </div>
                  {winner.finalScore && (
                    <div className="text-right">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Final Score</span>
                      <span className="text-sm font-mono font-black text-amber-300 bg-slate-900 px-2 py-0.5 rounded border border-amber-500/20">
                        {winner.finalScore}
                      </span>
                    </div>
                  )}
                </div>

                {winner.runnerUpSquad && (
                  <p className="text-[11px] text-slate-400 mt-1">
                    Runner-up: <span className="text-slate-300 font-medium">{winner.runnerUpSquad}</span>
                  </p>
                )}
              </div>

              {/* Winning Captain & MVP */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" />
                    <span>Winning Captain</span>
                  </span>
                  <p className="font-bold text-white mt-0.5 truncate">{winner.winningCaptain}</p>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Medal className="w-3 h-3 text-amber-400" />
                    <span>Tournament MVP</span>
                  </span>
                  <p className="font-bold text-amber-300 mt-0.5 truncate">{winner.mvpPlayer || 'Team Effort'}</p>
                </div>
              </div>

              {winner.notes && (
                <p className="text-[11px] text-slate-400 italic mt-2.5 pt-2 border-t border-slate-800">
                  "{winner.notes}"
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* Admin/Mod Modal: Record Tournament Winner */}
      {isAddWinnerOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#12192c] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Record Tournament Winner</h3>
              </div>
              <button
                onClick={() => setIsAddWinnerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddWinner} className="p-4 space-y-3 overflow-y-auto text-xs">
              <div>
                <label className="text-slate-300 font-bold block mb-1">Tournament Name</label>
                <input
                  type="text"
                  required
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                  placeholder="e.g. Messi Goat Champions Cup 2026"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-bold">Champion / Winner Squad</label>
                  <button
                    type="button"
                    onClick={() => setIsCustomWinnerSquad(!isCustomWinnerSquad)}
                    className="text-[10px] text-amber-400 hover:underline"
                  >
                    {isCustomWinnerSquad ? 'Select Predefined Squad' : '+ Custom Squad Name'}
                  </button>
                </div>
                {isCustomWinnerSquad ? (
                  <input
                    type="text"
                    required
                    value={customWinnerSquad}
                    onChange={(e) => setCustomWinnerSquad(e.target.value)}
                    placeholder="Enter winning squad name"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  />
                ) : (
                  <select
                    value={winnerSquad}
                    onChange={(e) => setWinnerSquad(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                  >
                    {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                )}
              </div>

              <div>
                <label className="text-slate-300 font-bold block mb-1">Winning Captain</label>
                <select
                  value={winningCaptain}
                  onChange={(e) => setWinningCaptain(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold focus:outline-none focus:border-amber-400"
                >
                  {players.map(p => (
                    <option key={p.id} value={p.name}>
                      {p.isCaptain ? '⭐ ' : ''}{p.name} ({p.ovr} OVR)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Runner-Up Squad</label>
                  <input
                    type="text"
                    value={runnerUpSquad}
                    onChange={(e) => setRunnerUpSquad(e.target.value)}
                    placeholder="Runner-up team"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Final Score</label>
                  <input
                    type="text"
                    value={finalScore}
                    onChange={(e) => setFinalScore(e.target.value)}
                    placeholder="e.g. 4 - 2"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono font-bold text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Tournament MVP</label>
                  <input
                    type="text"
                    value={mvpPlayer}
                    onChange={(e) => setMvpPlayer(e.target.value)}
                    placeholder="Player of tournament"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-medium block mb-1">Trophy Title</label>
                  <input
                    type="text"
                    value={trophyName}
                    onChange={(e) => setTrophyName(e.target.value)}
                    placeholder="e.g. Golden Goat Cup"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-medium block mb-1">Victory Notes / Highlights</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Undefeated champion run with 14 goals"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddWinnerOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-colors"
                >
                  Save to Hall of Fame
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
