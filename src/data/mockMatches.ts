import { Match } from '../types';

export const INITIAL_MATCHES: Match[] = [
  {
    id: 'match-1',
    title: 'Messi Goat FC Super Derby',
    team1Name: 'Goat Albiceleste',
    team2Name: 'Goat Gold',
    date: '2026-10-30',
    time: '19:30',
    venue: 'Goat Arena Main Pitch',
    status: 'Upcoming',
    referee: 'Pierluigi Collina Jr.',
    notes: 'Clash of titans. Captain Messi facing Captain Di Maria & Joy.'
  },
  {
    id: 'match-2',
    title: 'Midweek Clash: Matchday 8',
    team1Name: 'Goat Black',
    team2Name: 'Goat Navy',
    date: '2026-11-02',
    time: '20:15',
    venue: 'Pitch 2 - Floodlight Turf',
    status: 'Upcoming',
    referee: 'Joy Moderator',
    notes: 'Team Captain Alvarez vs Captain Enzo Fernandez.'
  },
  {
    id: 'match-3',
    title: 'Club Championship Round 7',
    team1Name: 'Goat Albiceleste',
    team2Name: 'Goat Black',
    date: '2026-10-24',
    time: '19:00',
    venue: 'Goat Arena Main Pitch',
    status: 'Finished',
    score: {
      team1Score: 4,
      team2Score: 2
    },
    motmPlayerId: 'player-admin-1',
    motmPlayerName: 'Lionel "Goat" Messi',
    scorers: [
      'Lionel Messi (14\', 58\', 89\')',
      'Saif Meer (33\')',
      'Julian Alvarez (42\', 77\')'
    ],
    referee: 'Tanvir Hossain',
    notes: 'Stunning hat-trick by Lionel Messi. Dibu Martinez saved a crucial penalty.'
  },
  {
    id: 'match-4',
    title: 'Weekend Gold Cup',
    team1Name: 'Goat Gold',
    team2Name: 'Goat Navy',
    date: '2026-10-18',
    time: '18:30',
    venue: 'Pitch 3 - Training Grounds',
    status: 'Finished',
    score: {
      team1Score: 3,
      team2Score: 3
    },
    motmPlayerId: 'player-mod-2',
    motmPlayerName: 'Joy Moderator',
    scorers: [
      'Angel Di Maria (12\')',
      'Joy Moderator (44\', 81\')',
      'Enzo Fernandez (25\')',
      'Nahuel Molina (67\')',
      'Alexis Mac Allister (90+2\')'
    ],
    referee: 'Lionel Messi',
    notes: 'Thrilling 3-3 draw with late injury-time equalizer.'
  }
];
