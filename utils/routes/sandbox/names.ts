// All valid route names for sandbox tab
export const names = [
  'Sandbox',
  'RouteRow',
  'ProfileBanner',
  'StatBox',
  'LostAndFoundCard',
  'SearchBar',
  'LeaderboardCard',
  'UserRow',
  'LeaderboardRanking',
  'UserTag',
  'Post',
] as const;
export type Name = typeof names[number];
