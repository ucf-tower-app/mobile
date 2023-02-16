import { Name as TabGlobalName } from '../tabGlobal/names';

// All valid route names for likes tab
export const names = ['Leaderboards'] as const;
export type Name = (typeof names)[number] | TabGlobalName;
