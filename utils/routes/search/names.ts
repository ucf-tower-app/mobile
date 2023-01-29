import { Name as TabGlobalName } from '../tabGlobal/names';

// All valid route names for search tab
export const names = ['Search'] as const;
export type Name = (typeof names)[number] | TabGlobalName;
