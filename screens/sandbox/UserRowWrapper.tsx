import UserRow from '../../components/profile/UserRow';
import { userMock } from '../../utils/mocks';

const navigate = () => {
  console.log('Pressed');
};

const UserRowWrapper = () => {
  return <UserRow user={userMock} navigate={navigate} />;
};

export default UserRowWrapper;
