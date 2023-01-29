import Profile from '../../components/profile/Profile';
import LoadingProfile from '../../components/profile/LoadingProfile';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';

const MyProfile = () => {
  const signedInUser = useRecoilValue(userAtom);

  return signedInUser !== undefined ? (
    <Profile userOfProfile={signedInUser} profileIsMine={true} />
  ) : (
    <LoadingProfile />
  );
};

export default MyProfile;
