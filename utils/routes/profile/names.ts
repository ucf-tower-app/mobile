// All valid route names for profile tab
export const names = ['Profile', 'Sends', 'Followers'] as const;
export type Name = typeof names[number];
