// All valid route names for sandbox tab
export const names = [
  'Sandbox',
  'RouteRow',
  'ProfileBanner',
  'StatBox',
  /*
  'LostAndFoundCard',
  */
] as const;
export type Name = typeof names[number];
