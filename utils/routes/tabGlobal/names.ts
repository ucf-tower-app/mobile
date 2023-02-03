// All valid tab-global route names
export const names = [
  'UserProfile',
  'Follows',
  'Sends',
  'MyProfile',
  'RouteView',
  'CreatePost',
  'Comments',
] as const;
export type Name = (typeof names)[number];
