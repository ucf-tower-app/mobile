import { atom } from 'recoil';
import { User, UserStatus } from '../xplat/types';

export const userAtom = atom<User | undefined>({
  key: 'user',
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const isSignedInAtom = atom<boolean>({
  key: 'isSignedIn',
  default: false,
});

export const isInitializingAtom = atom<boolean>({
  key: 'isInitializing',
  default: true,
});

export const userPermissionLevelAtom = atom<UserStatus | undefined>({
  key: 'userPermissionLevel',
  default: undefined,
});
