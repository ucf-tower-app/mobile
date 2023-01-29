import Profile from '../../components/profile/Profile';
import LoadingProfile from '../../components/profile/LoadingProfile';
import { useEffect, useState } from 'react';
import { User } from '../../xplat/types/types';
import { getUserByUsername } from '../../xplat/api';
import { TabGlobalScreenProps } from '../../utils/types';

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
