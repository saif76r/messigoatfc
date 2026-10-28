import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, Shield, Star, Shirt, Phone, Check, Sparkles } from 'lucide-react';
import { TEAMS, POSITIONS } from '../data/mockPlayers';
import { Position, PreferredFoot, Player } from '../types';

interface Props {
  onClose: () => void;
}

export const ProfileEditModal: React.FC<Props> = ({ onClose }) => {
  const { currentUser, players, updatePlayer, addPlayer } = useApp();

  // Find player profile matching currentUser
  const existingPlayer = players.find(p => p.id === currentUser?.playerId) ||
    players.find(p => p.email?.toLowerCase() === currentUser?.email?.toLowerCase());

  const [name, setName] = useState(existingPlayer?.name || currentUser?.name || '');
  const [squadName, setSquadName] = useState(existingPlayer?.teamName || TEAMS[0]);
  const [customSquad, setCustomSquad] = useState('');
  const [isCustomSquad, setIsCustomSquad] = useState(false);
  const [ovr, setOvr] = useState(existingPlayer?.ovr || 82);
  const [jerseyNumber, setJerseyNumber] = useState(existingPlayer?.jerseyNumber || 10);
  const [position, setPosition] = useState<Position>(existingPlayer?.position || 'CM');
  const [preferredFoot, setPreferredFoot] = useState<PreferredFoot>(existingPlayer?.preferredFoot || 'Right');
  const [phone, setPhone] = useState(existingPlayer?.phone || '+880 1700-000000');
  const [notes, setNotes] = useState(existingPlayer?.notes || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSquad = isCustomSquad && customSquad.trim() ? customSquad.trim() : squadName;

    if (existingPlayer) {
      const updated: Player = {
        ...existingPlayer,
        name: name.trim(),
        teamName: finalSquad,
        squadName: finalSquad,
        ovr: Number(ovr),
        jerseyNumber: Number(jerseyNumber),
        position,
        preferredFoot,
        phone,
        notes,
        stats: {
          pace: ovr,
          shooting: ovr,
          passing: ovr,
          dribbling: ovr,
          defending: ovr,
          physical: ovr
        }
      };
      updatePlayer(updated);
    } else {
      // If no player record existed yet, create one
      addPlayer({
        name: name.trim(),
        email: currentUser?.email,
        teamName: finalSquad,
        squadName: finalSquad,
        ovr: Number(ovr),
        jerseyNumber: Number(jerseyNumber),
        position,
        preferredFoot,
        phone,
        notes,
        stats: {
          pace: ovr,
          shooting: ovr,
          passing: ovr,
          dribbling: ovr,
          defending: ovr,
          physical: ovr
        },
        matchesPlayed: 0,
        goals: 0,
        assists: 0,
        cleanSheets: 0,
        motmAwards: 0,
        yellowCards: 0,
        redCards: 0,
        isRegisteredByUser: true
      });
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#12192c] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>Edit My Player Profile</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Update Name, Squad Name & TEAM OVR for the player pool
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
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto">
          {savedSuccess && (
            <div className="p-2.5 rounded-xl bg-emerald-400/10 border border-emerald-400/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Profile updated successfully! Synced with player pool.</span>
            </div>
          )}

          {/* 1. Name */}
          <div>
            <label className="text-xs text-slate-300 font-bold block mb-1">
              Your Name <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Saif Meer"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
            />
          </div>

          {/* 2. Squad Name */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-slate-300 font-bold">
                Squad Name / Team Name <span className="text-amber-400">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsCustomSquad(!isCustomSquad)}
                className="text-[10px] text-amber-400 hover:underline"
              >
                {isCustomSquad ? 'Select Existing Squad' : '+ Type Custom Squad'}
              </button>
            </div>

            {isCustomSquad ? (
              <input
                type="text"
                value={customSquad}
                onChange={(e) => setCustomSquad(e.target.value)}
                placeholder="Type your Squad Name (e.g. Thunder Strikers, Goat Elite)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
              />
            ) : (
              <select
                value={squadName}
                onChange={(e) => setSquadName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
              >
                {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
          </div>

          {/* 3. TEAM OVR Rating (1-200) */}
          <div className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400" />
                <span>TEAM OVR (1 - 200 Scale)</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={ovr}
                  onChange={(e) => setOvr(Math.min(200, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-16 bg-slate-800 border border-slate-700 text-center rounded text-sm font-mono font-black text-amber-400 py-1"
                />
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="200"
              value={ovr}
              onChange={(e) => setOvr(parseInt(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 (Novice)</span>
              <span>75 (Developing)</span>
              <span>140 (Pro Starter)</span>
              <span>200 (GOAT Legend)</span>
            </div>
          </div>

          {/* Jersey, Position & Foot */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">Jersey #</label>
              <input
                type="number"
                min="1"
                max="99"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono font-bold text-center"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as Position)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
              >
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] text-slate-300 font-medium block mb-1">Foot</label>
              <select
                value={preferredFoot}
                onChange={(e) => setPreferredFoot(e.target.value as PreferredFoot)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-bold"
              >
                <option value="Right">Right</option>
                <option value="Left">Left</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880 1711-xxxxxx"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono"
            />
          </div>

          {/* Bio / Playstyle */}
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Playstyle / Notes</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Playmaker, fast winger, clinical finisher..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          {/* Submit */}
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
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
