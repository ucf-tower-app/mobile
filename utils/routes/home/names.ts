// All valid route names for home tab
export const names = [
  'All',
  'Following',
  'Leaderboards',
  'Lost and Found',
] as const;
export type Name = typeof names[number];
