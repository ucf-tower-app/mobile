import { Name as TabGlobalName } from '../tabGlobal/names';

// All valid route names for activeRoutes tab
export const names = ['Active Routes'] as const;
export type Name = (typeof names)[number] | TabGlobalName;
