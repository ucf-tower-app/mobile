import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  isInitializingAtom,
  isSignedInAtom,
  userAtom,
  userPermissionLevelAtom,
} from '../../utils/atoms';
import { auth } from '../../xplat/Firebase';
import { getCurrentUser } from '../../xplat/api';

type Props = {
  children: React.ReactNode;
};
const AuthProvider = ({ children }: Props) => {
  const setIsSignedIn = useSetRecoilState(isSignedInAtom);
  const setUser = useSetRecoilState(userAtom);
  const setUserPermissionLevel = useSetRecoilState(userPermissionLevelAtom);
  const setIsInitializing = useSetRecoilState(isInitializingAtom);

  useEffect(
    () =>
      auth.onAuthStateChanged(async (user) => {
        if (user !== null) {
          setIsSignedIn(true);
          const lazyUser = await getCurrentUser();
          setUserPermissionLevel(await lazyUser.getStatus());
          setUser(lazyUser);
          setTimeout(() => setIsInitializing(false), 200);
        } else {
          setIsSignedIn(false);
          setUserPermissionLevel(undefined);
          setUser(undefined);
          setTimeout(() => setIsInitializing(false), 200);
        }
      }),
    [setIsSignedIn, setUserPermissionLevel, setUser, setIsInitializing]
  );

  return <>{children}</>;
};

export default AuthProvider;
