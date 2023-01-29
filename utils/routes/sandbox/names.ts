import { Name as TabGlobalName } from '../tabGlobal/names';

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
  'SearchableRoutes',
  'RouteView',
] as const;
export type Name = (typeof names)[number] | TabGlobalName;
