import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  isEmailVerifiedAtom,
  isInitializingAtom,
  isSignedInAtom,
  userAtom,
} from '../../utils/atoms';
import { auth } from '../../xplat/Firebase';
import { getCurrentUser } from '../../xplat/api';

type Props = {
  children: React.ReactNode;
};
const AuthProvider = ({ children }: Props) => {
  const setIsInitializing = useSetRecoilState(isInitializingAtom);
  const setIsSignedIn = useSetRecoilState(isSignedInAtom);
  const setIsEmailVerified = useSetRecoilState(isEmailVerifiedAtom);
  const setUser = useSetRecoilState(userAtom);

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      if (user !== null) {
        setIsSignedIn(true);
        setIsEmailVerified(user.emailVerified);
        await getCurrentUser().then(setUser);
      } else {
        setIsSignedIn(false);
        setIsEmailVerified(false);
        setUser(null);
      }
      setIsInitializing(false);
    });
  }, [setIsEmailVerified, setIsInitializing, setIsSignedIn, setUser]);

  return <>{children}</>;
};

export default AuthProvider;
