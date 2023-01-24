// All valid route names for root stack
export const names = ['Tabs', 'Settings', 'LostAndFound', 'Tutorial'] as const;
export type Name = (typeof names)[number];
