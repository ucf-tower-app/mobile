import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  isEmailVerifiedAtom,
  isInitializingAtom,
  isSignedInAtom,
  userAtom,
  userPermissionLevelAtom,
} from '../../utils/atoms';
import { getCurrentUser } from '../../xplat/api';
import { auth } from '../../xplat/Firebase';

type Props = {
  children: React.ReactNode;
};
const AuthProvider = ({ children }: Props) => {
  const setIsInitializing = useSetRecoilState(isInitializingAtom);
  const setIsSignedIn = useSetRecoilState(isSignedInAtom);
  const setIsEmailVerified = useSetRecoilState(isEmailVerifiedAtom);
  const setUser = useSetRecoilState(userAtom);
  const setUserPermissionLevel = useSetRecoilState(userPermissionLevelAtom);

  useEffect(
    () =>
      auth.onAuthStateChanged(async (user) => {
        if (user !== null) {
          setIsSignedIn(true);
          setIsEmailVerified(user.emailVerified);
          const lazyUser = await getCurrentUser();
          setUserPermissionLevel(await lazyUser.getStatus());
          setUser(lazyUser);
        } else {
          setIsSignedIn(false);
          setIsEmailVerified(false);
          setUserPermissionLevel(undefined);
          setUser(null);
        }
        setIsInitializing(false);
      }),
    [
      setIsEmailVerified,
      setIsInitializing,
      setIsSignedIn,
      setUserPermissionLevel,
      setUser,
    ]
  );

  return <>{children}</>;
};

export default AuthProvider;
