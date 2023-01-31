import { Name as TabGlobalName } from '../tabGlobal/names';

// All valid route names for home tab
export const names = ['Home'] as const;
export type Name = (typeof names)[number] | TabGlobalName;
