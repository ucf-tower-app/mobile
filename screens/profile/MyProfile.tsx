import type { ProfileScreenNavigationProp } from '../../utils/types';
import Profile from '../../components/profile/Profile';
import LoadingProfile from '../../components/profile/LoadingProfile';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';

const MyProfile = ({
  navigation,
}: ProfileScreenNavigationProp<'MyProfile'>) => {
  const signedInUser = useRecoilValue(userAtom);

  return signedInUser !== undefined ? (
    <Profile
      userOfProfile={signedInUser}
      profileIsMine={true}
      navigate={navigation.push}
    />
  ) : (
    <LoadingProfile />
  );
};

export default MyProfile;
