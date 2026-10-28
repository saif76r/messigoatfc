import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Shirt, Trophy, Edit3, Trash2, Phone, Mail, Award, Flame, Calendar } from 'lucide-react';
import { Player } from '../types';
import { PlayerInputModal } from './PlayerInputModal';

interface Props {
  player: Player;
  onClose: () => void;
}

export const PlayerDetailModal: React.FC<Props> = ({ player, onClose }) => {
  const { currentUser, deletePlayer } = useApp();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const isAdminOrMod = currentUser?.role === 'admin' || currentUser?.role === 'moderator';
  const isSelf = currentUser?.playerId === player.id || (Boolean(currentUser?.email) && currentUser?.email === player.email);

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to remove ${player.name} from the roster?`)) {
      deletePlayer(player.id);
      onClose();
    }
  };

  const getTierGradient = (ovr: number) => {
    if (ovr >= 185) return 'from-yellow-400 via-amber-300 to-yellow-600 text-slate-950';
    if (ovr >= 160) return 'from-amber-400 to-amber-600 text-slate-950';
    if (ovr >= 130) return 'from-cyan-400 to-blue-600 text-white';
    if (ovr >= 90) return 'from-emerald-400 to-teal-600 text-white';
    return 'from-slate-400 to-slate-600 text-slate-950';
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3">
        <div className="bg-[#12192c] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                #{player.jerseyNumber}
              </span>
              <span className="text-sm font-bold text-white truncate max-w-[200px]">
                {player.name}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-5 space-y-4 overflow-y-auto">
            {/* Top Card View (EA FC Gold Style) */}
            <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 to-[#0e1424] border border-slate-700/80 p-4 shadow-xl">
              <div className="flex items-start justify-between">
                {/* Left: OVR Shield */}
                <div className={`w-16 h-20 rounded-xl bg-gradient-to-b ${getTierGradient(player.ovr)} p-1 flex flex-col items-center justify-between shadow-md`}>
                  <div className="text-center leading-none">
                    <span className="text-2xl font-black font-mono tracking-tight block">
                      {player.ovr}
                    </span>
                    <span className="text-[9px] font-black uppercase tracking-wider block opacity-90">
                      {player.position}
                    </span>
                  </div>
                  <Shirt className="w-3.5 h-3.5 opacity-80" />
                  <span className="text-[8px] font-bold">#{player.jerseyNumber}</span>
                </div>

                {/* Right: Info */}
                <div className="flex-1 ml-3.5 min-w-0">
                  <div className="text-[11px] text-amber-400 font-semibold uppercase tracking-wider">
                    {player.teamName}
                  </div>
                  <h3 className="text-base font-black text-white leading-tight mt-0.5 truncate">
                    {player.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-mono">
                    <span>{player.preferredFoot} Foot</span>
                    <span>·</span>
                    <span className="tabular-nums">{player.phone}</span>
                  </div>
                  {player.email && (
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">{player.email}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Performance Stats Strip */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Matches</span>
                <span className="text-base font-black text-white font-mono tabular-nums">{player.matchesPlayed}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Goals</span>
                <span className="text-base font-black text-amber-400 font-mono tabular-nums">{player.goals}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Assists</span>
                <span className="text-base font-black text-cyan-400 font-mono tabular-nums">{player.assists}</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">MOTM</span>
                <span className="text-base font-black text-yellow-400 font-mono tabular-nums">{player.motmAwards}</span>
              </div>
            </div>

            {/* Hexagon/Bar Attributes */}
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-300 block mb-1">Attributes Breakdown</span>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {(['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'] as const).map(k => (
                  <div key={k} className="space-y-0.5">
                    <div className="flex justify-between text-[11px]">
                      <span className="capitalize text-slate-400">{k}</span>
                      <span className="font-mono font-bold text-amber-400 tabular-nums">{player.stats[k]}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${player.stats[k]}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {player.notes && (
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                <span className="text-[11px] font-semibold text-amber-400 block mb-0.5">Playstyle Notes</span>
                <p className="italic text-slate-400">{player.notes}</p>
              </div>
            )}

            {/* Actions Bar */}
            <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800">
              {isAdminOrMod && (
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Player</span>
                </button>
              )}

              <div className="flex items-center gap-2 ml-auto">
                {(isAdminOrMod || isSelf) && (
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-4 py-2 rounded-xl shadow-md transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Profile & OVR</span>
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white px-3 py-2"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <PlayerInputModal
          player={player}
          onClose={() => {
            setIsEditOpen(false);
            onClose();
          }}
        />
      )}
    </>
  );
};
