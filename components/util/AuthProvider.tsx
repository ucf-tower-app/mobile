import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  isEmailVerifiedAtom,
  isInitializingAtom,
  isSignedInAtom,
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
  const setUserPermissionLevel = useSetRecoilState(userPermissionLevelAtom);

  useEffect(
    () =>
      auth.onAuthStateChanged(async (user) => {
        if (user !== null) {
          setIsSignedIn(true);
          setIsEmailVerified(user.emailVerified);

          const lazyUser = await getCurrentUser();
          setUserPermissionLevel(await lazyUser.getStatus());
        } else {
          setIsSignedIn(false);
          setIsEmailVerified(false);
          setUserPermissionLevel(undefined);
        }
        setIsInitializing(false);
      }),
    [
      setIsEmailVerified,
      setIsInitializing,
      setIsSignedIn,
      setUserPermissionLevel,
    ]
  );

  return <>{children}</>;
};

export default AuthProvider;
