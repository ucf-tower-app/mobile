import type { ProfileScreenNavigationProp } from '../../utils/types';
import ProfileBanner from '../../components/profile/ProfileBanner';
import { View, VStack } from 'native-base';
import { useRecoilValueLoadable } from 'recoil';
import { userAtom } from '../../utils/atoms';

const Profile = ({ navigation }: ProfileScreenNavigationProp<'Profile'>) => {
  const user = useRecoilValueLoadable(userAtom);

  return (
    <VStack space="sm">
      {user.contents !== null && user.state === 'hasValue' ? (
        <ProfileBanner user={user.contents} />
      ) : (
        <View />
      )}
    </VStack>
  );
};

export default Profile;
