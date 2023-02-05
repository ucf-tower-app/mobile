import { atom } from 'recoil';
import { User, UserStatus } from '../xplat/types';

export const isInitializingAtom = atom<boolean>({
  key: 'isInitializing',
  default: true,
});

export const userAtom = atom<User | undefined>({
  key: 'user',
  default: undefined,
  dangerouslyAllowMutability: true,
});

export const isSignedInAtom = atom<boolean>({
  key: 'isSignedIn',
  default: false,
});

/** Although potentially counterintuitive,
 * we want to treat all users as having verified emails.
 * This ensures that users are not blocked from interacting every
 * time that they open the application. Users that should be blocked
 * will be before they have time to do anything meaningful.
 **/
export const isEmailVerifiedAtom = atom<boolean>({
  key: 'isEmailVerified',
  default: true,
});

export const userPermissionLevelAtom = atom<UserStatus | undefined>({
  key: 'userPermissionLevel',
  default: undefined,
});
