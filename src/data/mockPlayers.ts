import { Player, Position, PreferredFoot } from '../types';

export const TEAMS = [
  'Goat Albiceleste',
  'Goat Gold',
  'Goat Black',
  'Goat Navy',
  'Unassigned (Draft Pool)'
] as const;

export const POSITIONS: Position[] = ['ST', 'RW', 'LW', 'CAM', 'CM', 'CDM', 'CB', 'LB', 'RB', 'GK'];

// Official club accounts (Admin and Moderator are both players in the club as requested)
export const INITIAL_KEY_PLAYERS: Player[] = [
  {
    id: 'player-admin-1',
    name: 'Lionel "Goat" Messi (Admin)',
    email: 'admingoat@gmail.com',
    jerseyNumber: 10,
    teamName: 'Goat Albiceleste',
    ovr: 199,
    position: 'RW',
    preferredFoot: 'Left',
    phone: '+880 1711-000010',
    stats: { pace: 93, shooting: 98, passing: 99, dribbling: 99, defending: 42, physical: 78 },
    isCaptain: true,
    matchesPlayed: 45,
    goals: 52,
    assists: 38,
    cleanSheets: 0,
    motmAwards: 28,
    yellowCards: 2,
    redCards: 0,
    isRegisteredByUser: false,
    notes: 'Club Founder & Super Admin. Master of free kicks and team vision.',
    joinedDate: '2024-01-01',
    password: '123456ABCD'
  },
  {
    id: 'player-mod-2',
    name: 'Joy Moderator (Mod)',
    email: 'joy@gmail.com',
    jerseyNumber: 8,
    teamName: 'Goat Gold',
    ovr: 185,
    position: 'CM',
    preferredFoot: 'Right',
    phone: '+880 1711-000008',
    stats: { pace: 84, shooting: 82, passing: 91, dribbling: 87, defending: 79, physical: 83 },
    isCaptain: true,
    matchesPlayed: 38,
    goals: 14,
    assists: 24,
    cleanSheets: 0,
    motmAwards: 9,
    yellowCards: 4,
    redCards: 0,
    isRegisteredByUser: false,
    notes: 'Head Moderator & midfield general. Oversees fixtures and team integrity.',
    joinedDate: '2024-01-10',
    password: 'joy123'
  }
];

// Returns only the real official players list. No fake/sample generated test players.
export function generateFullRoster(_targetCount?: number): Player[] {
  return [...INITIAL_KEY_PLAYERS];
}
