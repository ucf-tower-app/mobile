// All valid route names for profile tab
export const names = ['MyProfile', 'Sends', 'Follows', 'UserProfile'] as const;
export type Name = (typeof names)[number];
