import UserRow from '../../components/profile/UserRow';
import { LazyStaticImage } from '../../xplat/types/common';
import { UserStatus } from '../../xplat/types/types';
import { UserMock } from '../../xplat/types/user';

const profilePic = new LazyStaticImage(
  'mock/path',
  'https://wallpaperaccess.com/full/317501.jpg'
);
const userMock = new UserMock(
  'mockitymock',
  'fakeemail@mail.com',
  'Mockity Mock',
  'Being mocked is my personality',
  UserStatus.Verified,
  [],
  [],
  [],
  profilePic
);

const UserRowWrapper = () => {
  return <UserRow user={userMock} />;
};

export default UserRowWrapper;
