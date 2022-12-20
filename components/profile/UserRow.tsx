import { Box, HStack, Pressable, useColorModeValue } from 'native-base';
import { User } from '../../xplat/types/user';
import Tintable from '../util/Tintable';
import UserTag from './UserTag';

// TODO
const navigateToProfile = () => {};

type Props = {
  user: User | undefined;
  endComponent?: JSX.Element;
};
const UserRow = ({ user, endComponent }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <Pressable onPress={navigateToProfile}>
      {({ isHovered, isPressed }) => {
        return (
          <Box bg={baseBgColor}>
            <Tintable tinted={isHovered || isPressed} />
            <HStack alignItems="center" justifyContent="space-between">
              <UserTag user={user} size="lg" />
              {endComponent}
            </HStack>
          </Box>
        );
      }}
    </Pressable>
  );
};

export default UserRow;
