// All valid tab-global route names
export const names = [
  'Follows',
  'Sends',
  'Profile',
  'Route View',
  'Create Post',
  'Comments',
] as const;
export type Name = (typeof names)[number];
