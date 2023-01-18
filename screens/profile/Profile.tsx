import type { ProfileScreenNavigationProp } from '../../utils/types';
import ProfileBanner from '../../components/profile/ProfileBanner';
import { userAtom } from '../../utils/atoms';
import { useRecoilValue } from 'recoil';
import { VStack } from 'native-base';

const Profile = ({ navigation }: ProfileScreenNavigationProp<'Profile'>) => {
  return <VStack space="sm" />;
};

export default Profile;
