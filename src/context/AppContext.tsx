import React, { createContext, useContext, useState, useEffect } from 'react';
import { Player, Match, UserSession, UserRole, TournamentWinner } from '../types';
import { INITIAL_KEY_PLAYERS, generateFullRoster } from '../data/mockPlayers';
import { INITIAL_MATCHES } from '../data/mockMatches';
import {
  collection,
  onSnapshot,
  doc,
  setDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase/config';

interface AppContextType {
  currentUser: UserSession | null;
  players: Player[];
  matches: Match[];
  tournamentWinners: TournamentWinner[];
  currentTournamentName: string;
  setTournamentName: (name: string) => void;
  isCloudSynced: boolean;
  activeTab: 'dashboard' | 'roster' | 'balance' | 'fixtures' | 'admin';
  setActiveTab: (tab: 'dashboard' | 'roster' | 'balance' | 'fixtures' | 'admin') => void;
  selectedPlayer: Player | null;
  setSelectedPlayer: (player: Player | null) => void;
  isPlayerModalOpen: boolean;
  setIsPlayerModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  viewMode: 'phone' | 'full';
  setViewMode: (mode: 'phone' | 'full') => void;
  // Actions
  login: (email: string, pass: string) => { success: boolean; message: string };
  signUpPlayer: (data: {
    name: string;
    email: string;
    password: string;
    squadName: string;
    ovr: number;
    phone?: string;
    jerseyNumber?: number;
    position?: any;
  }) => { success: boolean; message: string };
  logout: () => void;
  switchUserRole: (role: UserRole) => void;
  toggleCaptain: (playerId: string, forceStatus?: boolean) => void;
  addPlayer: (player: Omit<Player, 'id' | 'joinedDate'>) => void;
  updatePlayer: (player: Player) => void;
  deletePlayer: (id: string) => void;
  populateTo300: () => void;
  resetRoster: () => void;
  addMatch: (match: Omit<Match, 'id'>) => void;
  updateMatch: (match: Match) => void;
  deleteMatch: (id: string) => void;
  addTournamentWinner: (winner: Omit<TournamentWinner, 'id'>) => void;
  deleteTournamentWinner: (id: string) => void;
}

const STORAGE_PLAYERS_KEY = 'messi_goat_fc_players_real_v5';
const STORAGE_MATCHES_KEY = 'messi_goat_fc_matches_v5';
const STORAGE_USER_KEY = 'messi_goat_fc_user_v5';
const STORAGE_WINNERS_KEY = 'messi_goat_fc_winners_v5';
const STORAGE_TOURNAMENT_NAME_KEY = 'messi_goat_fc_curr_tourn_v5';

const DEFAULT_WINNERS: TournamentWinner[] = [
  {
    id: 'winner-1',
    tournamentName: 'Messi Goat Champions Trophy 2026',
    winnerSquad: 'Goat Albiceleste',
    winningCaptain: 'Lionel "Goat" Messi',
    runnerUpSquad: 'Goat Gold',
    finalScore: '4 - 2',
    date: '2026-10-24',
    mvpPlayer: 'Lionel Messi',
    trophyName: 'Golden Goat Cup'
  },
  {
    id: 'winner-2',
    tournamentName: 'Messi Goat Super Derby Matchday 7',
    winnerSquad: 'Goat Gold',
    winningCaptain: 'Joy Moderator',
    runnerUpSquad: 'Goat Black',
    finalScore: '3 - 1',
    date: '2026-09-18',
    mvpPlayer: 'Joy Moderator',
    trophyName: 'Derby Shield'
  }
];

const DEFAULT_USER: UserSession = {
  email: 'admingoat@gmail.com',
  name: 'Lionel "Goat" Messi (Admin)',
  role: 'admin',
  playerId: 'player-admin-1'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [players, setPlayers] = useState<Player[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PLAYERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return [...INITIAL_KEY_PLAYERS];
  });

  const [matches, setMatches] = useState<Match[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MATCHES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_MATCHES;
  });

  const [tournamentWinners, setTournamentWinners] = useState<TournamentWinner[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WINNERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return DEFAULT_WINNERS;
  });

  const [currentTournamentName, setCurrentTournamentName] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_TOURNAMENT_NAME_KEY) || 'Messi Goat Champions Trophy 2026';
    } catch {
      return 'Messi Goat Champions Trophy 2026';
    }
  });

  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'roster' | 'balance' | 'fixtures' | 'admin'>('dashboard');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isPlayerModalOpen, setIsPlayerModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'phone' | 'full'>('phone');

  // Persistence to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PLAYERS_KEY, JSON.stringify(players));
    } catch (e) {
      console.warn('Could not save players', e);
    }
  }, [players]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MATCHES_KEY, JSON.stringify(matches));
    } catch (e) {
      console.warn('Could not save matches', e);
    }
  }, [matches]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WINNERS_KEY, JSON.stringify(tournamentWinners));
    } catch (e) {
      console.warn('Could not save tournament winners', e);
    }
  }, [tournamentWinners]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_TOURNAMENT_NAME_KEY, currentTournamentName);
    } catch (e) {
      console.warn('Could not save tournament name', e);
    }
  }, [currentTournamentName]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch (e) {
      console.warn('Could not save user', e);
    }
  }, [currentUser]);

  // Real-time Firestore Synchronizer for Players
  useEffect(() => {
    const playersCol = collection(db, 'players');
    const unsubscribe = onSnapshot(
      playersCol,
      async (snapshot) => {
        setIsCloudSynced(true);
        if (!snapshot.empty) {
          const remotePlayers: Player[] = [];
          const fakeDocIdsToDelete: string[] = [];

          snapshot.forEach((docSnap) => {
            const data = docSnap.data() as Player;
            // Only keep real accounts: Admin, Moderator, or registered by a user
            const isReal = data.isRegisteredByUser || data.id === 'player-admin-1' || data.id === 'player-mod-2';
            if (isReal) {
              remotePlayers.push(data);
            } else {
              fakeDocIdsToDelete.push(docSnap.id);
            }
          });

          // Clean up leftover test data from remote Firestore
          if (fakeDocIdsToDelete.length > 0) {
            try {
              const batch = writeBatch(db);
              fakeDocIdsToDelete.forEach((id) => {
                batch.delete(doc(db, 'players', id));
              });
              await batch.commit();
            } catch (cleanErr) {
              console.warn('Cleaned sample data note:', cleanErr);
            }
          }

          if (remotePlayers.length > 0) {
            remotePlayers.sort((a, b) => b.ovr - a.ovr);
            setPlayers(remotePlayers);
          } else {
            const batch = writeBatch(db);
            INITIAL_KEY_PLAYERS.forEach((p) => {
              batch.set(doc(db, 'players', p.id), p);
            });
            await batch.commit();
            setPlayers([...INITIAL_KEY_PLAYERS]);
          }
        } else {
          // Firestore is empty on first boot, seed ONLY the 2 official accounts (Admin & Moderator)
          try {
            const batch = writeBatch(db);
            INITIAL_KEY_PLAYERS.forEach((p) => {
              const ref = doc(db, 'players', p.id);
              batch.set(ref, p);
            });
            await batch.commit();
            setPlayers([...INITIAL_KEY_PLAYERS]);
          } catch (seedErr) {
            console.warn('Initial Firestore player seeding note:', seedErr);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'players');
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore Synchronizer for Matches
  useEffect(() => {
    const matchesCol = collection(db, 'matches');
    const unsubscribe = onSnapshot(
      matchesCol,
      async (snapshot) => {
        if (!snapshot.empty) {
          const remoteMatches: Match[] = [];
          snapshot.forEach((docSnap) => {
            remoteMatches.push(docSnap.data() as Match);
          });
          setMatches(remoteMatches);
        } else {
          try {
            const batch = writeBatch(db);
            INITIAL_MATCHES.forEach((m) => {
              const ref = doc(db, 'matches', m.id);
              batch.set(ref, m);
            });
            await batch.commit();
          } catch (seedErr) {
            console.warn('Initial Firestore matches seeding note:', seedErr);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'matches');
      }
    );

    return () => unsubscribe();
  }, []);

  // Real-time Firestore Synchronizer for Tournament Winners
  useEffect(() => {
    const winnersCol = collection(db, 'tournament_winners');
    const unsubscribe = onSnapshot(
      winnersCol,
      async (snapshot) => {
        if (!snapshot.empty) {
          const remoteWinners: TournamentWinner[] = [];
          snapshot.forEach((docSnap) => {
            remoteWinners.push(docSnap.data() as TournamentWinner);
          });
          setTournamentWinners(remoteWinners);
        } else {
          try {
            const batch = writeBatch(db);
            DEFAULT_WINNERS.forEach((w) => {
              const ref = doc(db, 'tournament_winners', w.id);
              batch.set(ref, w);
            });
            await batch.commit();
          } catch (seedErr) {
            console.warn('Initial Firestore tournament winners seeding note:', seedErr);
          }
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'tournament_winners');
      }
    );

    return () => unsubscribe();
  }, []);

  // Check if current user is Admin or Moderator
  const isAdminOrMod = currentUser?.role === 'admin' || currentUser?.role === 'moderator';

  // Auth Functions: Login with Email & Password stored in Firebase
  const login = (email: string, pass: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();

    if (!trimmedEmail || !trimmedPass) {
      return { success: false, message: 'Please enter both Email and Password.' };
    }

    // 1. Super Admin
    if (trimmedEmail === 'admingoat@gmail.com') {
      if (trimmedPass === '123456ABCD') {
        const adminSession: UserSession = {
          email: 'admingoat@gmail.com',
          name: 'Lionel "Goat" Messi (Admin)',
          role: 'admin',
          playerId: 'player-admin-1'
        };
        setCurrentUser(adminSession);
        return { success: true, message: 'Welcome back, Super Admin Messi!' };
      }
      return { success: false, message: 'Incorrect Admin password. Hint: 123456ABCD' };
    }

    // 2. Official Moderator
    if (trimmedEmail === 'joy@gmail.com') {
      if (trimmedPass === 'joy123') {
        const modSession: UserSession = {
          email: 'joy@gmail.com',
          name: 'Joy Moderator (Mod)',
          role: 'moderator',
          playerId: 'player-mod-2'
        };
        setCurrentUser(modSession);
        return { success: true, message: 'Welcome back, Moderator Joy!' };
      }
      return { success: false, message: 'Incorrect Moderator password. Hint: joy123' };
    }

    // 3. Real Player Account stored in Firebase
    const matchingPlayer = players.find(p => p.email?.toLowerCase() === trimmedEmail);
    if (matchingPlayer) {
      // If player already has a password set, verify it
      if (matchingPlayer.password && matchingPlayer.password !== trimmedPass) {
        return { success: false, message: 'Incorrect password for this player account. Please try again.' };
      }

      // If player did not have a password set yet, update it in Firebase
      if (!matchingPlayer.password) {
        matchingPlayer.password = trimmedPass;
        try {
          setDoc(doc(db, 'players', matchingPlayer.id), { password: trimmedPass }, { merge: true });
        } catch (e) {
          console.warn('Updated player password in firestore note:', e);
        }
      }

      const role: UserRole = matchingPlayer.isCaptain ? 'captain' : 'player';
      const userSession: UserSession = {
        email: matchingPlayer.email || trimmedEmail,
        name: matchingPlayer.name,
        role,
        playerId: matchingPlayer.id
      };
      setCurrentUser(userSession);
      return { success: true, message: `Welcome back, ${matchingPlayer.name}!` };
    }

    return {
      success: false,
      message: 'Account not found with this email. Click "Join as New Player" to create your account!'
    };
  };

  // Sign up new player and save password directly in Firebase Firestore
  const signUpPlayer = (data: {
    name: string;
    email: string;
    password: string;
    squadName: string;
    ovr: number;
    phone?: string;
    jerseyNumber?: number;
    position?: any;
  }): { success: boolean; message: string } => {
    if (!data.name.trim() || !data.email.trim() || !data.password?.trim()) {
      return { success: false, message: 'Name, Email, and Password are required.' };
    }

    const trimmedEmail = data.email.trim().toLowerCase();
    const existing = players.find(p => p.email?.toLowerCase() === trimmedEmail);
    if (existing) {
      return { success: false, message: 'A player with this email is already registered. Please sign in.' };
    }

    const newId = `player-reg-${Date.now()}`;
    const newPlayer: Player = {
      id: newId,
      name: data.name.trim(),
      email: trimmedEmail,
      password: data.password.trim(),
      teamName: data.squadName.trim() || 'Unassigned (Draft Pool)',
      squadName: data.squadName.trim() || 'Unassigned (Draft Pool)',
      ovr: Math.min(200, Math.max(1, data.ovr || 120)),
      jerseyNumber: data.jerseyNumber || (Math.floor(Math.random() * 98) + 1),
      position: data.position || 'CM',
      preferredFoot: 'Right',
      phone: data.phone || '+880 1700-000000',
      stats: {
        pace: data.ovr,
        shooting: data.ovr,
        passing: data.ovr,
        dribbling: data.ovr,
        defending: data.ovr,
        physical: data.ovr
      },
      isCaptain: false,
      matchesPlayed: 0,
      goals: 0,
      assists: 0,
      cleanSheets: 0,
      motmAwards: 0,
      yellowCards: 0,
      redCards: 0,
      isRegisteredByUser: true,
      notes: `Registered player of ${data.squadName}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    // Save locally
    setPlayers(prev => [newPlayer, ...prev]);

    // Save to Firebase Firestore (including login password)
    try {
      setDoc(doc(db, 'players', newId), newPlayer);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `players/${newId}`);
    }

    const session: UserSession = {
      email: newPlayer.email || trimmedEmail,
      name: newPlayer.name,
      role: 'player',
      playerId: newId
    };
    setCurrentUser(session);

    return { success: true, message: `Account created! Welcome to Messi Goat FC, ${newPlayer.name}!` };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUserRole = (role: UserRole) => {
    if (role === 'admin') {
      setCurrentUser({
        email: 'admingoat@gmail.com',
        name: 'Lionel "Goat" Messi (Admin)',
        role: 'admin',
        playerId: 'player-admin-1'
      });
    } else if (role === 'moderator') {
      setCurrentUser({
        email: 'joy@gmail.com',
        name: 'Joy Moderator (Mod)',
        role: 'moderator',
        playerId: 'player-mod-2'
      });
    }
  };

  // Captain Appointment by Admin / Moderator (Strict RBAC: Only Admin or Moderator)
  const toggleCaptain = (playerId: string, forceStatus?: boolean) => {
    if (!isAdminOrMod) {
      console.warn('RBAC Notice: Only Admin or Moderator can assign captains.');
      return;
    }

    const targetPlayer = players.find(p => p.id === playerId);
    if (!targetPlayer) return;

    const nextStatus = forceStatus !== undefined ? forceStatus : !targetPlayer.isCaptain;
    const updated: Player = { ...targetPlayer, isCaptain: nextStatus };

    setPlayers(prev => prev.map(p => p.id === playerId ? updated : p));

    // Update in Firestore
    try {
      setDoc(doc(db, 'players', playerId), updated, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `players/${playerId}`);
    }

    if (currentUser && currentUser.playerId === playerId) {
      if (currentUser.role !== 'admin' && currentUser.role !== 'moderator') {
        setCurrentUser(prev => prev ? { ...prev, role: nextStatus ? 'captain' : 'player' } : null);
      }
    }
  };

  // Player Operations (Strict RBAC: Admin & Mod can add any player)
  const addPlayer = (playerData: Omit<Player, 'id' | 'joinedDate'>) => {
    if (!isAdminOrMod) {
      console.warn('RBAC Notice: Only Admin or Moderator can register other players directly.');
      return;
    }

    const newPlayer: Player = {
      ...playerData,
      id: `player-${Date.now()}`,
      joinedDate: new Date().toISOString().split('T')[0]
    };
    setPlayers(prev => [newPlayer, ...prev]);

    try {
      setDoc(doc(db, 'players', newPlayer.id), newPlayer);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `players/${newPlayer.id}`);
    }
  };

  // Player updates: Admin/Mod can update any player; regular players can ONLY update their own profile
  const updatePlayer = (updatedPlayer: Player) => {
    const isSelf = currentUser?.playerId === updatedPlayer.id || (Boolean(currentUser?.email) && currentUser?.email?.toLowerCase() === updatedPlayer.email?.toLowerCase());
    if (!isAdminOrMod && !isSelf) {
      console.warn('RBAC Notice: Players can only update their own profile.');
      return;
    }

    setPlayers(prev => prev.map(p => p.id === updatedPlayer.id ? updatedPlayer : p));
    if (selectedPlayer?.id === updatedPlayer.id) {
      setSelectedPlayer(updatedPlayer);
    }

    try {
      setDoc(doc(db, 'players', updatedPlayer.id), updatedPlayer);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `players/${updatedPlayer.id}`);
    }

    if (currentUser?.playerId === updatedPlayer.id || currentUser?.email === updatedPlayer.email) {
      setCurrentUser(prev => prev ? {
        ...prev,
        name: updatedPlayer.name,
        email: updatedPlayer.email || prev.email,
        role: prev.role === 'admin' || prev.role === 'moderator' ? prev.role : (updatedPlayer.isCaptain ? 'captain' : 'player')
      } : null);
    }
  };

  // Delete Player: Strict RBAC - Only Admin & Mod
  const deletePlayer = (id: string) => {
    if (!isAdminOrMod) {
      console.warn('RBAC Notice: Only Admin or Moderator can delete players.');
      return;
    }

    setPlayers(prev => prev.filter(p => p.id !== id));
    if (selectedPlayer?.id === id) {
      setSelectedPlayer(null);
    }

    try {
      deleteDoc(doc(db, 'players', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `players/${id}`);
    }
  };

  const populateTo300 = async () => {
    // Disabled - strictly real player accounts only
  };

  const resetRoster = async () => {
    if (!isAdminOrMod) return;
    try {
      const realOnly = players.filter(p => p.isRegisteredByUser || p.id === 'player-admin-1' || p.id === 'player-mod-2');
      const finalReal = realOnly.length >= 2 ? realOnly : [...INITIAL_KEY_PLAYERS];
      setPlayers(finalReal);

      const batch = writeBatch(db);
      finalReal.forEach(p => {
        batch.set(doc(db, 'players', p.id), p);
      });
      await batch.commit();
    } catch (err) {
      console.warn('Reset roster Firestore warning:', err);
    }
  };

  // Match Operations (Strict RBAC: Only Admin or Moderator)
  const addMatch = (matchData: Omit<Match, 'id'>) => {
    if (!isAdminOrMod) return;
    const newMatch: Match = {
      ...matchData,
      id: `match-${Date.now()}`
    };
    setMatches(prev => [newMatch, ...prev]);

    try {
      setDoc(doc(db, 'matches', newMatch.id), newMatch);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `matches/${newMatch.id}`);
    }
  };

  const updateMatch = (updatedMatch: Match) => {
    if (!isAdminOrMod) return;
    setMatches(prev => prev.map(m => m.id === updatedMatch.id ? updatedMatch : m));

    try {
      setDoc(doc(db, 'matches', updatedMatch.id), updatedMatch);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `matches/${updatedMatch.id}`);
    }

    if (updatedMatch.status === 'Finished' && updatedMatch.motmPlayerId) {
      setPlayers(prev => prev.map(p => {
        if (p.id === updatedMatch.motmPlayerId) {
          const updatedP = { ...p, motmAwards: p.motmAwards + 1 };
          setDoc(doc(db, 'players', p.id), updatedP, { merge: true });
          return updatedP;
        }
        return p;
      }));
    }
  };

  const deleteMatch = (id: string) => {
    if (!isAdminOrMod) return;
    setMatches(prev => prev.filter(m => m.id !== id));

    try {
      deleteDoc(doc(db, 'matches', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `matches/${id}`);
    }
  };

  // Tournament Winner Operations (Strict RBAC: Only Admin or Moderator)
  const addTournamentWinner = (winnerData: Omit<TournamentWinner, 'id'>) => {
    if (!isAdminOrMod) {
      console.warn('RBAC Notice: Only Admin or Moderator can record tournament winners.');
      return;
    }
    const newWinner: TournamentWinner = {
      ...winnerData,
      id: `winner-${Date.now()}`
    };
    setTournamentWinners(prev => [newWinner, ...prev]);

    try {
      setDoc(doc(db, 'tournament_winners', newWinner.id), newWinner);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `tournament_winners/${newWinner.id}`);
    }
  };

  const deleteTournamentWinner = (id: string) => {
    if (!isAdminOrMod) return;
    setTournamentWinners(prev => prev.filter(w => w.id !== id));

    try {
      deleteDoc(doc(db, 'tournament_winners', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `tournament_winners/${id}`);
    }
  };

  const setTournamentName = (name: string) => {
    if (!isAdminOrMod) return;
    setCurrentTournamentName(name);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        players,
        matches,
        tournamentWinners,
        currentTournamentName,
        setTournamentName,
        isCloudSynced,
        activeTab,
        setActiveTab,
        selectedPlayer,
        setSelectedPlayer,
        isPlayerModalOpen,
        setIsPlayerModalOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        viewMode,
        setViewMode,
        login,
        signUpPlayer,
        logout,
        switchUserRole,
        toggleCaptain,
        addPlayer,
        updatePlayer,
        deletePlayer,
        populateTo300,
        resetRoster,
        addMatch,
        updateMatch,
        deleteMatch,
        addTournamentWinner,
        deleteTournamentWinner
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
