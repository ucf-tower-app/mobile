import UserRow from '../../components/profile/UserRow';
import { userMock } from '../../utils/mocks';

const UserRowWrapper = () => {
  return <UserRow user={userMock} />;
};

export default UserRowWrapper;
