import { Box, HStack, Pressable, useColorModeValue } from 'native-base';
import { User } from '../../xplat/types/user';
import Tintable from '../util/Tintable';
import UserTag from './UserTag';

type Props = {
  user: User | undefined;
  endComponent?: JSX.Element;
  navigate: Function;
};
const UserRow = ({ user, endComponent, navigate }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <Pressable onPress={() => navigate}>
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
