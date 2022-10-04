// All valid route names for tabs
export const names = ['DefaultTab', 'SandboxTab'] as const;
export type Name = typeof names[number];
