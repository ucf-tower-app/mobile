import { atom, selector } from 'recoil';
import { getCurrentUser } from '../xplat/api';

export const isInitializingAtom = atom({
  key: 'isInitializing',
  default: true,
});

export const userAtom = selector({
  key: 'user',
  get: async ({ get }) => {
    const signedIn = get(isSignedInAtom);

    if (signedIn === true) {
      let user = await getCurrentUser();
      return user;
    } else {
      return null;
    }
  },
});

export const isSignedInAtom = atom({
  key: 'isSignedIn',
  default: false,
});

/** Although potentially counterintuitive,
 * we want to treat all users as having verified emails.
 * This ensures that users are not blocked from interacting every
 * time that they open the application. Users that should be blocked
 * will be before they have time to do anything meaningful.
 **/
export const isEmailVerifiedAtom = atom({
  key: 'isEmailVerified',
  default: true,
});
