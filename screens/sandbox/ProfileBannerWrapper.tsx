import ProfileBanner from '../../components/profile/ProfileBanner';
import { userMock } from '../../utils/mocks';

const ProfileBannerWrapper = () => {
  return <ProfileBanner user={userMock} />;
};

export default ProfileBannerWrapper;
