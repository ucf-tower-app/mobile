import ProfileBanner from '../../components/profile/ProfileBanner';
import { UserStatus } from '../../xplat/types/common';
import { UserMock } from '../../xplat/types/user';

const userMock = new UserMock(
  'mockymock',
  "I'm a mocked user, I like mocks!",
  UserStatus.Employee,
  [],
  [],
  []
);

const ProfileBannerWrapper = () => {
  return <ProfileBanner user={userMock} />;
};

export default ProfileBannerWrapper;
