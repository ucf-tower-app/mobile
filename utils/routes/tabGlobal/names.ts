// All valid tab-global route names
export const names = [
  'Follows',
  'Sends',
  'Profile',
  'RouteView',
  'CreatePost',
  'Comments',
] as const;
export type Name = (typeof names)[number];
