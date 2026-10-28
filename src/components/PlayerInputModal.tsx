import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Phone, Shirt, Shield, Star, Check } from 'lucide-react';
import { Player, Position, PreferredFoot, PlayerStats } from '../types';
import { TEAMS, POSITIONS } from '../data/mockPlayers';

interface Props {
  player: Player | null; // null for new player registration
  onClose: () => void;
}

export const PlayerInputModal: React.FC<Props> = ({ player, onClose }) => {
  const { addPlayer, updatePlayer, currentUser } = useApp();

  const [name, setName] = useState(player?.name || '');
  const [email, setEmail] = useState(player?.email || currentUser?.email || '');
  const [teamName, setTeamName] = useState(player?.teamName || TEAMS[0]);
  const [ovr, setOvr] = useState(player?.ovr || 78);
  const [position, setPosition] = useState<Position>(player?.position || 'ST');
  const [preferredFoot, setPreferredFoot] = useState<PreferredFoot>(player?.preferredFoot || 'Right');
  const [jerseyNumber, setJerseyNumber] = useState(player?.jerseyNumber || 10);
  const [phone, setPhone] = useState(player?.phone || '+880 17');
  const [playerPassword, setPlayerPassword] = useState(player?.password || '');
  const [notes, setNotes] = useState(player?.notes || '');

  // Detailed stats
  const [stats, setStats] = useState<PlayerStats>(player?.stats || {
    pace: 78,
    shooting: 75,
    passing: 77,
    dribbling: 79,
    defending: 65,
    physical: 74
  });

  // Keep OVR roughly synced or allow custom OVR
  const handleStatChange = (key: keyof PlayerStats, val: number) => {
    const updated = { ...stats, [key]: Math.min(99, Math.max(30, val)) };
    setStats(updated);
  };

  const handleOvrSlider = (val: number) => {
    setOvr(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (player) {
      // update
      updatePlayer({
        ...player,
        name,
        email,
        password: playerPassword.trim() || player.password,
        teamName,
        ovr,
        position,
        preferredFoot,
        jerseyNumber,
        phone,
        stats,
        notes
      });
    } else {
      // create new
      addPlayer({
        name,
        email,
        password: playerPassword.trim() || '123456',
        teamName,
        ovr,
        position,
        preferredFoot,
        jerseyNumber,
        phone,
        stats,
        matchesPlayed: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        motmAwards: 0,
        yellowCards: 0,
        redCards: 0,
        isRegisteredByUser: true,
        notes
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#12192c] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Shirt className="w-4 h-4 text-amber-400" />
              <span>{player ? 'Edit Player Information' : 'Register New Player'}</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {player ? `Update profile for ${player.name}` : 'Enter your name, squad & player OVR details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          {/* Name & Phone */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">
                Player Full Name <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Saif Meer / Lionel Messi"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1711-xxxxxx"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
              <div>
                <label className="text-xs text-slate-300 font-medium block mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="player@goatfc.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Login Password (Firebase)</label>
              <input
                type="text"
                value={playerPassword}
                onChange={(e) => setPlayerPassword(e.target.value)}
                placeholder="Set player login password (e.g. 123456)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          {/* Team, Jersey, Position & Foot */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="modal-player-team" className="text-xs text-slate-300 font-medium block mb-1">Team / Squad</label>
              <select
                id="modal-player-team"
                aria-label="Team / Squad"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              >
                {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Jersey Number</label>
              <input
                type="number"
                min="1"
                max="99"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="modal-player-pos" className="text-xs text-slate-300 font-medium block mb-1">Primary Position</label>
              <select
                id="modal-player-pos"
                aria-label="Primary Position"
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              >
                {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="modal-player-foot" className="text-xs text-slate-300 font-medium block mb-1">Preferred Foot</label>
              <select
                id="modal-player-foot"
                aria-label="Preferred Foot"
                value={preferredFoot}
                onChange={(e) => setPreferredFoot(e.target.value as PreferredFoot)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
              >
                <option value="Right">Right Foot</option>
                <option value="Left">Left Foot</option>
                <option value="Both">Both (Ambidextrous)</option>
              </select>
            </div>
          </div>

          {/* TEAM OVR Slider (1-200) */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" />
                <span>Player TEAM OVR Rating (1 - 200)</span>
              </label>
              <input
                type="number"
                min="1"
                max="200"
                value={ovr}
                onChange={(e) => handleOvrSlider(Math.min(200, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-16 bg-slate-800 border border-slate-700 text-center rounded text-sm font-mono font-black text-amber-400 py-1"
              />
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={ovr}
              onChange={(e) => handleOvrSlider(parseInt(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 (Novice)</span>
              <span>75 (Developing)</span>
              <span>140 (Pro Starter)</span>
              <span>200 (GOAT Legend)</span>
            </div>
          </div>

          {/* Individual Detailed Attributes */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-300 block">Individual Attributes (0-99)</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(['pace', 'shooting', 'passing', 'dribbling', 'defending', 'physical'] as const).map(k => (
                <div key={k} className="flex items-center justify-between bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="capitalize text-slate-400">{k}</span>
                  <input
                    type="number"
                    min="30"
                    max="99"
                    value={stats[k]}
                    onChange={(e) => handleStatChange(k, parseInt(e.target.value) || 50)}
                    className="w-12 bg-slate-800 border border-slate-700 text-center rounded text-xs font-mono font-bold text-amber-400 py-0.5"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Player Notes / Playstyle</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Free kick specialist, aggressive pressing, winger speed..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-colors"
            >
              {player ? 'Update Profile' : 'Save & Register Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
