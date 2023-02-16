import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
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
  const setIsSignedIn = useSetRecoilState(isSignedInAtom);
  const setUser = useSetRecoilState(userAtom);
  const setUserPermissionLevel = useSetRecoilState(userPermissionLevelAtom);

  useEffect(
    () =>
      auth.onAuthStateChanged(async (user) => {
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
      }),
    [setIsSignedIn, setUserPermissionLevel, setUser]
  );

  return <>{children}</>;
};

export default AuthProvider;
