// All valid route names for tabs
export const names = [
  'HomeTab',
  'LeaderboardsTab',
  'ActiveRoutesTab',
  'SearchTab',
  'ProfileTab',
  'SandboxTab',
] as const;
export type Name = typeof names[number];
