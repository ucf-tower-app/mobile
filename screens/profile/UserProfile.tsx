import { useEffect, useState } from 'react';
import LoadingProfile from '../../components/profile/LoadingProfile';
import Profile from '../../components/profile/Profile';
import { TabGlobalScreenProps } from '../../utils/types';
import { getUserByUsername } from '../../xplat/api';
import { User } from '../../xplat/types';

const UserProfile = ({ route }: TabGlobalScreenProps<'UserProfile'>) => {
  const [user, setUser] = useState<User | undefined>(undefined);
  const username = route.params.username;

  useEffect(() => {
    const getData = async () => {
      await getUserByUsername(username).then(setUser);
    };
    getData();
  }, [username]);

  return user !== undefined ? (
    <Profile userOfProfile={user} profileIsMine={false} />
  ) : (
    <LoadingProfile />
  );
};

export default UserProfile;
