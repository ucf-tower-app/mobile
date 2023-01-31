import { Name as TabGlobalName } from '../tabGlobal/names';

// All valid route names for profile tab
export const names = [] as const;
export type Name = (typeof names)[number] | TabGlobalName;
