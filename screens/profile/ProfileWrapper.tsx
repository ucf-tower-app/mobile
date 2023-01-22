import type { ProfileScreenNavigationProp } from '../../utils/types';
import Profile from '../../components/profile/Profile';
import { User } from '../../xplat/types/user';
import { useState } from 'react';
import { getCurrentUser } from '../../xplat/api';
import { useEffect } from 'react';
import LoadingProfile from '../../components/profile/LoadingProfile';

const ProfileWrapper = ({
  navigation,
}: ProfileScreenNavigationProp<'Profile'>) => {
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const getUser = async () => {
      await getCurrentUser().then(setUser);
    };
    getUser();
  }, []);

  return user !== undefined ? (
    <Profile user={user} profileIsMine={true} />
  ) : (
    <LoadingProfile />
  );
};

export default ProfileWrapper;
