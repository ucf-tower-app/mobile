import type { ProfileScreenNavigationProp } from '../../utils/types';
import Profile from '../../components/profile/Profile';
import LoadingProfile from '../../components/profile/LoadingProfile';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';

const ProfileWrapper = ({
  navigation,
}: ProfileScreenNavigationProp<'Profile'>) => {
  const user = useRecoilValue(userAtom);

  return user !== null ? (
    <Profile
      userOfProfile={user}
      profileIsMine={true}
      navigate={navigation.navigate}
    />
  ) : (
    <LoadingProfile />
  );
};

export default ProfileWrapper;
