import { useNavigation } from '@react-navigation/native';
import { Box, HStack, Pressable, useColorModeValue } from 'native-base';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import { navigateToUserProfile } from '../../utils/nav';
import { TabGlobalNavigationProp } from '../../utils/types';
import { User } from '../../xplat/types/user';
import Tintable from '../util/Tintable';
import UserTag from './UserTag';

type Props = {
  user: User | undefined;
  endComponent?: JSX.Element;
};
const UserRow = ({ user, endComponent }: Props) => {
  const navigation = useNavigation<TabGlobalNavigationProp>();

  const signedInUser = useRecoilValue(userAtom);

  const tryNavigate = () => {
    const [signedInUserId, targetProfileUserId] = [
      signedInUser?.docRef!.id,
      user?.docRef!.id,
    ];

    if (targetProfileUserId === undefined || signedInUserId === undefined)
      return;

    navigateToUserProfile(signedInUserId, targetProfileUserId, navigation);
  };

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  if (user === undefined) return null;

  return (
    <Pressable onPress={tryNavigate}>
      {({ isHovered, isPressed }) => {
        return (
          <Box bg={baseBgColor}>
            <Tintable tinted={isHovered || isPressed} />
            <HStack alignItems="center" justifyContent="space-between">
              <UserTag userDocRefId={user.getId()} size="lg" />
              {endComponent}
            </HStack>
          </Box>
        );
      }}
    </Pressable>
  );
};

export default UserRow;
