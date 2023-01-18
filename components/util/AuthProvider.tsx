import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  isEmailVerifiedAtom,
  isInitializingAtom,
  isSignedInAtom,
} from '../../utils/atoms';
import { auth } from '../../xplat/Firebase';

type Props = {
  children: React.ReactNode;
};
const AuthProvider = ({ children }: Props) => {
  const setIsInitializing = useSetRecoilState(isInitializingAtom);
  const setIsSignedIn = useSetRecoilState(isSignedInAtom);
  const setIsEmailVerified = useSetRecoilState(isEmailVerifiedAtom);

  useEffect(() => {
    return auth.onAuthStateChanged(async (user) => {
      if (user !== null) {
        setIsSignedIn(true);
        setIsEmailVerified(user.emailVerified);
      } else {
        setIsSignedIn(false);
        setIsEmailVerified(false);
      }
      setIsInitializing(false);
    });
  }, [setIsEmailVerified, setIsInitializing, setIsSignedIn]);

  return <>{children}</>;
};

export default AuthProvider;
