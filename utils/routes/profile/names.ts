// All valid route names for profile tab
export const names = ['MyProfile', 'Sends', 'Follow', 'UserProfile'] as const;
export type Name = (typeof names)[number];
