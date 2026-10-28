import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Scale, Users, RefreshCw, Zap, Shield, Plus, Minus, ArrowLeftRight, Crown, Trophy, Edit3, Search, X, Check, Award } from 'lucide-react';
import { Player } from '../types';
import { TEAMS } from '../data/mockPlayers';

export const TeamBalance: React.FC = () => {
  const { players, currentUser, toggleCaptain, currentTournamentName, setTournamentName } = useApp();

  const isAdminOrMod = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  // Tournament Name editing state
  const [isEditingTournName, setIsEditingTournName] = useState(false);
  const [tempTournName, setTempTournName] = useState(currentTournamentName);

  // Custom Squad Names
  const [squad1Name, setSquad1Name] = useState('Squad A (Albiceleste)');
  const [squad2Name, setSquad2Name] = useState('Squad B (Gold XI)');
  const [editingSquadName, setEditingSquadName] = useState<1 | 2 | null>(null);
  const [tempSquadName, setTempSquadName] = useState('');

  // Appointed Captains from the 300 player pool
  const allCaptains = useMemo(() => {
    const caps = players.filter(p => p.isCaptain);
    if (caps.length >= 2) return caps;
    return [players[0], players[1]];
  }, [players]);

  const [captain1Id, setCaptain1Id] = useState<string>(() => allCaptains[0]?.id || players[0]?.id || '');
  const [captain2Id, setCaptain2Id] = useState<string>(() => allCaptains[1]?.id || players[1]?.id || '');

  // Modal to appoint ANY player from 300 pool as Captain
  const [assignCaptainTarget, setAssignCaptainTarget] = useState<1 | 2 | null>(null);
  const [captainSearchQuery, setCaptainSearchQuery] = useState('');

  // Modal to create custom squad from scratch
  const [isCreateSquadOpen, setIsCreateSquadOpen] = useState(false);
  const [newSquadName, setNewSquadName] = useState('');
  const [newSquadTarget, setNewSquadTarget] = useState<1 | 2>(1);
  const [newSquadCaptainId, setNewSquadCaptainId] = useState('');

  // Selected player IDs for Squad 1 & Squad 2
  const [squad1Ids, setSquad1Ids] = useState<string[]>(() => {
    return [players[0]?.id, players[2]?.id, players[4]?.id, players[6]?.id].filter(Boolean);
  });

  const [squad2Ids, setSquad2Ids] = useState<string[]>(() => {
    return [players[1]?.id, players[3]?.id, players[5]?.id, players[7]?.id].filter(Boolean);
  });

  const [poolSearch, setPoolSearch] = useState('');

  // Resolved Captains
  const captain1 = players.find(p => p.id === captain1Id) || players[0];
  const captain2 = players.find(p => p.id === captain2Id) || players[1];

  // Resolved squad players
  const squad1Players = useMemo(() => players.filter(p => squad1Ids.includes(p.id)), [players, squad1Ids]);
  const squad2Players = useMemo(() => players.filter(p => squad2Ids.includes(p.id)), [players, squad2Ids]);

  // Available unpicked players
  const availablePlayers = useMemo(() => {
    return players.filter(p =>
      !squad1Ids.includes(p.id) &&
      !squad2Ids.includes(p.id) &&
      (poolSearch === '' || p.name.toLowerCase().includes(poolSearch.toLowerCase()) || p.teamName.toLowerCase().includes(poolSearch.toLowerCase()))
    );
  }, [players, squad1Ids, squad2Ids, poolSearch]);

  // Squad Stat Metrics
  const calculateSquadMetrics = (squad: Player[]) => {
    if (squad.length === 0) return { avgOvr: 0, totalOvr: 0, att: 0, mid: 0, def: 0 };
    const totalOvr = squad.reduce((sum, p) => sum + p.ovr, 0);
    const avgOvr = Number((totalOvr / squad.length).toFixed(1));

    const attSquad = squad.filter(p => ['ST', 'RW', 'LW'].includes(p.position));
    const midSquad = squad.filter(p => ['CAM', 'CM', 'CDM'].includes(p.position));
    const defSquad = squad.filter(p => ['CB', 'LB', 'RB', 'GK'].includes(p.position));

    const avgAtt = attSquad.length ? attSquad.reduce((sum, p) => sum + (p.stats.shooting + p.stats.pace) / 2, 0) / attSquad.length : avgOvr;
    const avgMid = midSquad.length ? midSquad.reduce((sum, p) => sum + (p.stats.passing + p.stats.dribbling) / 2, 0) / midSquad.length : avgOvr;
    const avgDef = defSquad.length ? defSquad.reduce((sum, p) => sum + (p.stats.defending + p.stats.physical) / 2, 0) / defSquad.length : avgOvr;

    return {
      avgOvr,
      totalOvr,
      att: Math.round(avgAtt),
      mid: Math.round(avgMid),
      def: Math.round(avgDef)
    };
  };

  const stats1 = calculateSquadMetrics(squad1Players);
  const stats2 = calculateSquadMetrics(squad2Players);
  const ovrDelta = Number(Math.abs(stats1.avgOvr - stats2.avgOvr).toFixed(1));

  // Captain Assignment Handler
  const handleAssignCaptainFromPool = (player: Player) => {
    if (!isAdminOrMod) return;

    if (!player.isCaptain) {
      toggleCaptain(player.id, true);
    }

    if (assignCaptainTarget === 1) {
      setCaptain1Id(player.id);
      if (!squad1Ids.includes(player.id)) {
        setSquad1Ids(prev => [player.id, ...prev.filter(id => id !== player.id)]);
      }
      setSquad2Ids(prev => prev.filter(id => id !== player.id));
    } else if (assignCaptainTarget === 2) {
      setCaptain2Id(player.id);
      if (!squad2Ids.includes(player.id)) {
        setSquad2Ids(prev => [player.id, ...prev.filter(id => id !== player.id)]);
      }
      setSquad1Ids(prev => prev.filter(id => id !== player.id));
    }

    setAssignCaptainTarget(null);
    setCaptainSearchQuery('');
  };

  // Create Custom Squad Handler
  const handleCreateCustomSquad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSquadName.trim() || !isAdminOrMod) return;

    const chosenCaptain = players.find(p => p.id === newSquadCaptainId) || players[0];
    if (!chosenCaptain.isCaptain) {
      toggleCaptain(chosenCaptain.id, true);
    }

    if (newSquadTarget === 1) {
      setSquad1Name(newSquadName.trim());
      setCaptain1Id(chosenCaptain.id);
      setSquad1Ids(prev => [chosenCaptain.id, ...prev.filter(id => id !== chosenCaptain.id)]);
      setSquad2Ids(prev => prev.filter(id => id !== chosenCaptain.id));
    } else {
      setSquad2Name(newSquadName.trim());
      setCaptain2Id(chosenCaptain.id);
      setSquad2Ids(prev => [chosenCaptain.id, ...prev.filter(id => id !== chosenCaptain.id)]);
      setSquad1Ids(prev => prev.filter(id => id !== chosenCaptain.id));
    }

    setIsCreateSquadOpen(false);
    setNewSquadName('');
  };

  // Captain Draft actions
  const pickForSquad1 = (id: string) => {
    setSquad2Ids(prev => prev.filter(pId => pId !== id));
    if (!squad1Ids.includes(id)) {
      setSquad1Ids(prev => [...prev, id]);
    }
  };

  const pickForSquad2 = (id: string) => {
    setSquad1Ids(prev => prev.filter(pId => pId !== id));
    if (!squad2Ids.includes(id)) {
      setSquad2Ids(prev => [...prev, id]);
    }
  };

  const removeFromSquad = (id: string) => {
    setSquad1Ids(prev => prev.filter(pId => pId !== id));
    setSquad2Ids(prev => prev.filter(pId => pId !== id));
  };

  // Auto-Balance Equalizer
  const handleAutoBalance = () => {
    const combined = [...squad1Players, ...squad2Players].sort((a, b) => b.ovr - a.ovr);
    const t1: string[] = [];
    const t2: string[] = [];
    let sum1 = 0;
    let sum2 = 0;

    combined.forEach(p => {
      if (sum1 <= sum2) {
        t1.push(p.id);
        sum1 += p.ovr;
      } else {
        t2.push(p.id);
        sum2 += p.ovr;
      }
    });

    setSquad1Ids(t1);
    setSquad2Ids(t2);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* 1. TOP SECTION: TOURNAMENT NAME & ADMIN CAPTAIN SELECTION */}
      <div className="bg-[#12192c] border border-amber-500/30 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20 inline-flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              <span>ACTIVE TOURNAMENT</span>
            </span>

            {isEditingTournName ? (
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  value={tempTournName}
                  onChange={(e) => setTempTournName(e.target.value)}
                  placeholder="Enter Tournament Name"
                  className="bg-slate-900 border border-amber-400 rounded-xl px-3 py-1.5 text-sm text-white font-black flex-1 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (tempTournName.trim()) setTournamentName(tempTournName.trim());
                    setIsEditingTournName(false);
                  }}
                  className="px-3 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-1.5">
                <h2 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                  {currentTournamentName}
                </h2>
                {isAdminOrMod && (
                  <button
                    onClick={() => {
                      setTempTournName(currentTournamentName);
                      setIsEditingTournName(true);
                    }}
                    title="Change Tournament Name (Admin)"
                    className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            <p className="text-[11px] text-slate-400 mt-1">
              Admin assigns Captains for this tournament, then Captains pick their squads from the pool.
            </p>
          </div>

          {isAdminOrMod && (
            <button
              onClick={() => {
                setNewSquadName('');
                setNewSquadCaptainId(players[0]?.id || '');
                setIsCreateSquadOpen(true);
              }}
              className="flex items-center gap-1 text-[11px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-2.5 py-1.5 rounded-lg transition-colors shadow-md shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Custom Squad</span>
            </button>
          )}
        </div>
      </div>

      {/* Select Squad Names & Captains for Match */}
      <div className="grid grid-cols-2 gap-2 bg-[#12192c] p-3 rounded-xl border border-slate-800">
        {/* Squad 1 Config */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            {editingSquadName === 1 ? (
              <div className="flex items-center gap-1 w-full">
                <input
                  type="text"
                  value={tempSquadName}
                  onChange={(e) => setTempSquadName(e.target.value)}
                  placeholder="Squad 1 Name"
                  className="w-full bg-slate-900 border border-amber-400 text-[11px] text-white rounded px-1.5 py-0.5 font-bold"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (tempSquadName.trim()) setSquad1Name(tempSquadName.trim());
                    setEditingSquadName(null);
                  }}
                  className="text-[10px] text-emerald-400 hover:underline shrink-0"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-bold text-amber-400 truncate max-w-[120px]">
                  {squad1Name}
                </span>
                {isAdminOrMod && (
                  <button
                    onClick={() => {
                      setTempSquadName(squad1Name);
                      setEditingSquadName(1);
                    }}
                    title="Rename Squad"
                    className="text-slate-400 hover:text-amber-400 p-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          <label className="text-[10px] text-slate-400 font-medium block">
            Squad Captain:
          </label>
          <select
            value={captain1Id}
            onChange={(e) => setCaptain1Id(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 font-bold focus:outline-none focus:border-amber-400"
          >
            {allCaptains.map(c => (
              <option key={c.id} value={c.id}>
                ⭐ {c.name} ({c.ovr} OVR)
              </option>
            ))}
          </select>

          {/* Quick Assign from Pool Button */}
          {isAdminOrMod && (
            <button
              onClick={() => {
                setAssignCaptainTarget(1);
                setCaptainSearchQuery('');
              }}
              className="w-full text-center py-1 text-[10px] font-bold text-amber-400 hover:text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 rounded-md border border-amber-400/30 transition-colors"
            >
              + Assign Any Player as Captain
            </button>
          )}
        </div>

        {/* Squad 2 Config */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            {editingSquadName === 2 ? (
              <div className="flex items-center gap-1 w-full">
                <input
                  type="text"
                  value={tempSquadName}
                  onChange={(e) => setTempSquadName(e.target.value)}
                  placeholder="Squad 2 Name"
                  className="w-full bg-slate-900 border border-cyan-400 text-[11px] text-white rounded px-1.5 py-0.5 font-bold"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (tempSquadName.trim()) setSquad2Name(tempSquadName.trim());
                    setEditingSquadName(null);
                  }}
                  className="text-[10px] text-emerald-400 hover:underline shrink-0"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full">
                <span className="text-[11px] font-bold text-cyan-400 truncate max-w-[120px]">
                  {squad2Name}
                </span>
                {isAdminOrMod && (
                  <button
                    onClick={() => {
                      setTempSquadName(squad2Name);
                      setEditingSquadName(2);
                    }}
                    title="Rename Squad"
                    className="text-slate-400 hover:text-cyan-400 p-0.5"
                  >
                    <Edit3 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          <label className="text-[10px] text-slate-400 font-medium block">
            Squad Captain:
          </label>
          <select
            value={captain2Id}
            onChange={(e) => setCaptain2Id(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-xs text-white rounded-lg p-2 font-bold focus:outline-none focus:border-cyan-400"
          >
            {allCaptains.map(c => (
              <option key={c.id} value={c.id}>
                ⭐ {c.name} ({c.ovr} OVR)
              </option>
            ))}
          </select>

          {/* Quick Assign from Pool Button */}
          {isAdminOrMod && (
            <button
              onClick={() => {
                setAssignCaptainTarget(2);
                setCaptainSearchQuery('');
              }}
              className="w-full text-center py-1 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 rounded-md border border-cyan-400/30 transition-colors"
            >
              + Assign Any Player as Captain
            </button>
          )}
        </div>
      </div>

      {/* Live Balance Gauge */}
      <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-white flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>Live Balance Analysis</span>
          </span>
          <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
            ovrDelta <= 2.0 ? 'bg-emerald-400/20 text-emerald-400 border border-emerald-400/30' :
            ovrDelta <= 5.0 ? 'bg-amber-400/20 text-amber-400 border border-amber-400/30' :
            'bg-rose-400/20 text-rose-400 border border-rose-400/30'
          }`}>
            {ovrDelta <= 2.0 ? 'Fair Match (Balanced)' : `Difference: ${ovrDelta} OVR`}
          </span>
        </div>

        {/* Squad Comparison Summary */}
        <div className="grid grid-cols-2 gap-2">
          {/* Squad 1 Summary */}
          <div className="bg-slate-900/90 border border-amber-500/20 rounded-xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-amber-400 block truncate">
              {squad1Name} ({squad1Players.length})
            </span>
            <span className="text-[10px] text-slate-400 block truncate mt-0.5">
              Cap: {captain1?.name.split(' ')[0]}
            </span>
            <span className="text-2xl font-black text-white font-mono tabular-nums block mt-0.5">
              {stats1.avgOvr}
            </span>
            <div className="flex justify-around text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-800">
              <span>ATT: <strong className="text-white">{stats1.att}</strong></span>
              <span>MID: <strong className="text-white">{stats1.mid}</strong></span>
              <span>DEF: <strong className="text-white">{stats1.def}</strong></span>
            </div>
          </div>

          {/* Squad 2 Summary */}
          <div className="bg-slate-900/90 border border-cyan-500/20 rounded-xl p-2.5 text-center">
            <span className="text-[10px] font-bold text-cyan-400 block truncate">
              {squad2Name} ({squad2Players.length})
            </span>
            <span className="text-[10px] text-slate-400 block truncate mt-0.5">
              Cap: {captain2?.name.split(' ')[0]}
            </span>
            <span className="text-2xl font-black text-white font-mono tabular-nums block mt-0.5">
              {stats2.avgOvr}
            </span>
            <div className="flex justify-around text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-slate-800">
              <span>ATT: <strong className="text-white">{stats2.att}</strong></span>
              <span>MID: <strong className="text-white">{stats2.mid}</strong></span>
              <span>DEF: <strong className="text-white">{stats2.def}</strong></span>
            </div>
          </div>
        </div>

        {/* Auto Balance Button */}
        <button
          onClick={handleAutoBalance}
          disabled={squad1Players.length + squad2Players.length < 2}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all active:scale-[0.98] disabled:opacity-40"
        >
          <RefreshCw className="w-3.5 h-3.5 text-slate-950" />
          <span>Auto-Balance Squads (Equalize OVR)</span>
        </button>
      </div>

      {/* Squad Pick Lists Side-by-Side */}
      <div className="grid grid-cols-2 gap-2">
        {/* Squad A */}
        <div className="bg-[#12192c] border border-amber-500/20 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400 mb-2">
            <span className="truncate">{squad1Name.split(' ')[0]} ({squad1Players.length})</span>
            <span className="font-mono text-[10px]">OVR {stats1.avgOvr}</span>
          </div>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {squad1Players.length === 0 ? (
              <p className="text-[10px] text-slate-500 italic p-2 text-center">Pick players from pool</p>
            ) : (
              squad1Players.map(p => (
                <div key={p.id} className="flex items-center justify-between gap-1 text-[11px] bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                  <div className="min-w-0 truncate">
                    <span className="font-mono text-amber-400 font-bold mr-1">{p.ovr}</span>
                    <span className="text-white font-medium truncate">{p.name.split(' ')[0]}</span>
                    {p.id === captain1Id && <span className="text-[9px] text-amber-400 ml-1 font-bold">⭐</span>}
                    <span className="text-[9px] text-slate-400 ml-1">({p.position})</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => pickForSquad2(p.id)}
                      title="Swap to Squad B"
                      className="p-1 text-slate-400 hover:text-cyan-400"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromSquad(p.id)}
                      title="Remove"
                      className="p-1 text-slate-400 hover:text-red-400"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Squad B */}
        <div className="bg-[#12192c] border border-cyan-500/20 rounded-xl p-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-cyan-400 mb-2">
            <span className="truncate">{squad2Name.split(' ')[0]} ({squad2Players.length})</span>
            <span className="font-mono text-[10px]">OVR {stats2.avgOvr}</span>
          </div>
          <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
            {squad2Players.length === 0 ? (
              <p className="text-[10px] text-slate-500 italic p-2 text-center">Pick players from pool</p>
            ) : (
              squad2Players.map(p => (
                <div key={p.id} className="flex items-center justify-between gap-1 text-[11px] bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                  <div className="min-w-0 truncate">
                    <span className="font-mono text-cyan-400 font-bold mr-1">{p.ovr}</span>
                    <span className="text-white font-medium truncate">{p.name.split(' ')[0]}</span>
                    {p.id === captain2Id && <span className="text-[9px] text-cyan-400 ml-1 font-bold">⭐</span>}
                    <span className="text-[9px] text-slate-400 ml-1">({p.position})</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => pickForSquad1(p.id)}
                      title="Swap to Squad A"
                      className="p-1 text-slate-400 hover:text-amber-400"
                    >
                      <ArrowLeftRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeFromSquad(p.id)}
                      title="Remove"
                      className="p-1 text-slate-400 hover:text-red-400"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Available Player Pool for Captains to Pick */}
      <div className="bg-[#12192c] border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <Users className="w-4 h-4 text-amber-400" />
            <span>Available Player Pool ({availablePlayers.length})</span>
          </h3>
          <input
            type="text"
            placeholder="Search pool..."
            value={poolSearch}
            onChange={(e) => setPoolSearch(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-500 w-32 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
          {availablePlayers.slice(0, 25).map(p => (
            <div key={p.id} className="flex items-center justify-between bg-slate-900/70 p-2 rounded-xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-amber-400 text-xs tabular-nums">
                  {p.ovr}
                </span>
                <div className="truncate">
                  <div className="flex items-center gap-1 truncate">
                    <p className="font-semibold text-white truncate">{p.name}</p>
                    {p.isCaptain && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 font-bold px-1 rounded">
                        CAP
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">{p.position} · {p.teamName}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={() => pickForSquad1(p.id)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                >
                  + Squad A
                </button>
                <button
                  onClick={() => pickForSquad2(p.id)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-colors"
                >
                  + Squad B
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: Assign ANY player from 300 pool as Captain */}
      {assignCaptainTarget && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#12192c] border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Assign Captain for {assignCaptainTarget === 1 ? squad1Name : squad2Name}</span>
                </h3>
                <p className="text-[11px] text-slate-400">Pick any player from the 300 roster to be Captain</p>
              </div>
              <button
                onClick={() => setAssignCaptainTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 border-b border-slate-800">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 300 players by name, jersey, team..."
                  value={captainSearchQuery}
                  onChange={(e) => setCaptainSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              </div>
            </div>

            <div className="p-3 space-y-1.5 overflow-y-auto max-h-72">
              {players
                .filter(p => captainSearchQuery === '' || p.name.toLowerCase().includes(captainSearchQuery.toLowerCase()) || p.teamName.toLowerCase().includes(captainSearchQuery.toLowerCase()))
                .slice(0, 30)
                .map(player => (
                  <div
                    key={player.id}
                    onClick={() => handleAssignCaptainFromPool(player)}
                    className="flex items-center justify-between bg-slate-900/80 hover:bg-slate-800 p-2.5 rounded-xl border border-slate-800 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-amber-400 text-xs tabular-nums">
                        {player.ovr}
                      </span>
                      <div className="truncate">
                        <p className="font-bold text-white text-xs truncate flex items-center gap-1">
                          <span>{player.name}</span>
                          {player.isCaptain && <Crown className="w-3 h-3 text-amber-400" />}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          #{player.jerseyNumber} · {player.position} · {player.teamName}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1 rounded-lg text-[10px] font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors shadow"
                    >
                      Set Captain
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Custom Squad & Assign Captain */}
      {isCreateSquadOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="bg-[#12192c] border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Create Custom Squad</span>
                </h3>
                <p className="text-[11px] text-slate-400">Name your squad & select its Captain</p>
              </div>
              <button
                onClick={() => setIsCreateSquadOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCustomSquad} className="p-4 space-y-3.5">
              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Squad Name</label>
                <input
                  type="text"
                  required
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  placeholder="e.g. Goat Thunder XI, Royal Strikers"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-bold"
                />
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Apply to Match Slot:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewSquadTarget(1)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                      newSquadTarget === 1
                        ? 'bg-amber-400 text-slate-950 border-amber-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Squad A Slot
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSquadTarget(2)}
                    className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                      newSquadTarget === 2
                        ? 'bg-cyan-400 text-slate-950 border-cyan-400'
                        : 'bg-slate-900 text-slate-400 border-slate-800'
                    }`}
                  >
                    Squad B Slot
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 font-bold block mb-1">Assign Captain from 300 Pool:</label>
                <select
                  value={newSquadCaptainId}
                  onChange={(e) => setNewSquadCaptainId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-white font-bold focus:outline-none focus:border-amber-400"
                >
                  {players.slice(0, 50).map(p => (
                    <option key={p.id} value={p.id}>
                      {p.isCaptain ? '⭐ ' : ''}{p.name} ({p.ovr} OVR - {p.position})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateSquadOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-colors"
                >
                  Create & Set Captain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
