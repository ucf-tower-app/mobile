// All valid route names for tabs
export const names = [
  'HomeTab',
  'LikesTab',
  'SearchTab',
  'ProfileTab',
  'SandboxTab',
] as const;
export type Name = typeof names[number];
