import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Calendar, Clock, MapPin, User, Trophy, ShieldAlert, Check } from 'lucide-react';
import { Match } from '../types';
import { TEAMS } from '../data/mockPlayers';

interface Props {
  match: Match | null; // null means create new
  onClose: () => void;
}

export const MatchEditModal: React.FC<Props> = ({ match, onClose }) => {
  const { addMatch, updateMatch, players } = useApp();

  const [title, setTitle] = useState(match?.title || 'Club Matchday Clash');
  const [team1Name, setTeam1Name] = useState(match?.team1Name || 'Goat Albiceleste');
  const [team2Name, setTeam2Name] = useState(match?.team2Name || 'Goat Gold');
  const [date, setDate] = useState(match?.date || new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState(match?.time || '19:30');
  const [venue, setVenue] = useState(match?.venue || 'Goat Arena Main Turf');
  const [status, setStatus] = useState<Match['status']>(match?.status || 'Upcoming');
  const [team1Score, setTeam1Score] = useState(match?.score?.team1Score ?? 0);
  const [team2Score, setTeam2Score] = useState(match?.score?.team2Score ?? 0);
  const [referee, setReferee] = useState(match?.referee || 'Pierluigi Collina Jr.');
  const [motmPlayerId, setMotmPlayerId] = useState(match?.motmPlayerId || '');
  const [scorersText, setScorersText] = useState(match?.scorers?.join(', ') || '');
  const [notes, setNotes] = useState(match?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedMotm = players.find(p => p.id === motmPlayerId);
    const scorersArray = scorersText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const matchData = {
      title,
      team1Name,
      team2Name,
      date,
      time,
      venue,
      status,
      referee,
      notes,
      score: status === 'Finished' || status === 'Live' ? { team1Score, team2Score } : undefined,
      motmPlayerId: status === 'Finished' && selectedMotm ? selectedMotm.id : undefined,
      motmPlayerName: status === 'Finished' && selectedMotm ? selectedMotm.name : undefined,
      scorers: scorersArray.length > 0 ? scorersArray : undefined,
    };

    if (match) {
      updateMatch({ ...match, ...matchData });
    } else {
      addMatch(matchData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="bg-[#12192c] border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>{match ? 'Edit Match Fixture' : 'Schedule New Match'}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Match Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Messi Goat FC Super Derby"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Teams Selection */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label htmlFor="modal-team-1" className="text-xs text-slate-300 font-medium block mb-1">Team 1</label>
              <select
                id="modal-team-1"
                aria-label="Team 1"
                value={team1Name}
                onChange={(e) => setTeam1Name(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
              >
                {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="modal-team-2" className="text-xs text-slate-300 font-medium block mb-1">Team 2</label>
              <select
                id="modal-team-2"
                aria-label="Team 2"
                value={team2Name}
                onChange={(e) => setTeam2Name(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-semibold"
              >
                {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Date, Time & Venue */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 font-medium block mb-1">Kick-off Time</label>
              <input
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Venue / Pitch</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Goat Arena Main Turf"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Match Status */}
          <div>
            <label htmlFor="modal-match-status" className="text-xs text-slate-300 font-medium block mb-1">Status</label>
            <select
              id="modal-match-status"
              aria-label="Match Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
            >
              <option value="Upcoming">Upcoming</option>
              <option value="Live">Live</option>
              <option value="Finished">Finished</option>
              <option value="Postponed">Postponed</option>
            </select>
          </div>

          {/* Scores (if finished or live) */}
          {(status === 'Finished' || status === 'Live') && (
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-amber-400 block">Match Score & Outcome</span>
              <div className="grid grid-cols-2 gap-2 text-center">
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 truncate">{team1Name}</label>
                  <input
                    type="number"
                    min="0"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
                    className="w-20 mx-auto bg-slate-800 border border-slate-700 rounded-lg p-2 text-center text-xl font-mono font-bold text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1 truncate">{team2Name}</label>
                  <input
                    type="number"
                    min="0"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
                    className="w-20 mx-auto bg-slate-800 border border-slate-700 rounded-lg p-2 text-center text-xl font-mono font-bold text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-slate-300 block mb-1">Goal Scorers (comma separated)</label>
                <input
                  type="text"
                  value={scorersText}
                  onChange={(e) => setScorersText(e.target.value)}
                  placeholder="e.g. Lionel Messi (24', 68'), Joy Mod (55')"
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div>
                <label htmlFor="modal-motm-select" className="text-[11px] text-slate-300 block mb-1">Man of the Match (MOTM)</label>
                <select
                  id="modal-motm-select"
                  aria-label="Man of the Match (MOTM)"
                  value={motmPlayerId}
                  onChange={(e) => setMotmPlayerId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                >
                  <option value="">Select MOTM Player</option>
                  {players.slice(0, 50).map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.jerseyNumber} {p.name} ({p.teamName})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Referee */}
          <div>
            <label className="text-xs text-slate-300 font-medium block mb-1">Referee</label>
            <input
              type="text"
              value={referee}
              onChange={(e) => setReferee(e.target.value)}
              placeholder="e.g. Joy Moderator / Tanvir Hossain"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
            />
          </div>

          {/* Buttons */}
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
              {match ? 'Save Match Changes' : 'Create Fixture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
