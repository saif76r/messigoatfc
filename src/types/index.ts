export type UserRole = 'admin' | 'moderator' | 'captain' | 'player';

export type Position = 'ST' | 'RW' | 'LW' | 'CAM' | 'CM' | 'CDM' | 'CB' | 'LB' | 'RB' | 'GK';

export type PreferredFoot = 'Left' | 'Right' | 'Both';

export interface PlayerStats {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Player {
  id: string;
  name: string;
  email?: string;
  jerseyNumber: number;
  teamName: string;
  squadName?: string;
  ovr: number; // 1 - 200
  position: Position;
  preferredFoot: PreferredFoot;
  phone: string;
  avatarUrl?: string;
  stats: PlayerStats;
  isCaptain?: boolean;
  // Performance record
  matchesPlayed: number;
  goals: number;
  assists: number;
  cleanSheets: number;
  motmAwards: number;
  yellowCards: number;
  redCards: number;
  isRegisteredByUser: boolean;
  notes?: string;
  joinedDate: string;
  password?: string;
}

export interface TournamentWinner {
  id: string;
  tournamentName: string;
  winnerSquad: string;
  winningCaptain: string;
  runnerUpSquad?: string;
  finalScore?: string;
  date: string;
  mvpPlayer?: string;
  trophyName?: string;
  notes?: string;
}

export interface MatchScore {
  team1Score: number;
  team2Score: number;
}

export interface MatchEvent {
  id: string;
  minute: number;
  type: 'goal' | 'assist' | 'yellow' | 'red';
  playerId: string;
  playerName: string;
  team: 1 | 2;
}

export interface Match {
  id: string;
  title: string;
  team1Name: string;
  team2Name: string;
  date: string;
  time: string;
  venue: string;
  status: 'Upcoming' | 'Live' | 'Finished' | 'Postponed';
  score?: MatchScore;
  motmPlayerId?: string;
  motmPlayerName?: string;
  scorers?: string[];
  events?: MatchEvent[];
  referee?: string;
  notes?: string;
}

export interface UserSession {
  email: string;
  name: string;
  role: UserRole;
  playerId?: string;
}
