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
  const setIsInitializing = useSetRecoilState(isInitializingAtom);
  const setIsSignedIn = useSetRecoilState(isSignedInAtom);
  const setUser = useSetRecoilState(userAtom);
  const setUserPermissionLevel = useSetRecoilState(userPermissionLevelAtom);

  useEffect(
    () =>
      auth.onAuthStateChanged(async (user) => {
        setIsInitializing(true);
        if (user !== null) {
          setIsSignedIn(true);
          const lazyUser = await getCurrentUser();
          setUserPermissionLevel(await lazyUser.getStatus());
          setUser(lazyUser);
        } else {
          setIsSignedIn(false);
          setUserPermissionLevel(undefined);
          setUser(undefined);
        }
        setIsInitializing(false);
      }),
    [setIsInitializing, setIsSignedIn, setUserPermissionLevel, setUser]
  );

  return <>{children}</>;
};

export default AuthProvider;
