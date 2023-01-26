import type { ProfileScreenNavigationProp } from '../../utils/types';
import Profile from '../../components/profile/Profile';
import LoadingProfile from '../../components/profile/LoadingProfile';
import { useEffect, useState } from 'react';
import { User } from '../../xplat/types/types';
import { getUserByUsername } from '../../xplat/api';

const UserProfile = ({
  navigation,
  route,
}: ProfileScreenNavigationProp<'UserProfile'>) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const username = route.params.username;

  useEffect(() => {
    const getData = async () => {
      await getUserByUsername(username).then(setUser);
    };
    getData();
  }, [username]);

  return user !== undefined ? (
    <Profile
      userOfProfile={user}
      profileIsMine={false}
      navigate={navigation.push}
    />
  ) : (
    <LoadingProfile />
  );
};

export default UserProfile;
