import { Center } from 'native-base';
import UserTag from '../../components/profile/UserTag';
import { userMock } from '../../utils/mocks';

const UserTagWrapper = () => {
  return (
    <Center>
      <UserTag user={userMock} />
    </Center>
  );
};

export default UserTagWrapper;
