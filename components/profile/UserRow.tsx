import {
  Avatar,
  HStack,
  VStack,
  Center,
  Text,
  Pressable,
  useColorModeValue,
} from 'native-base';
import { User } from '../../xplat/types/user';
import { useEffect, useState } from 'react';

// TODO
const navigateToProfile = () => {};

type Props = {
  user: User;
  endComponent?: JSX.Element;
};
const UserRow = ({ user, endComponent }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const primaryBgColor = useColorModeValue(
    'lightMode.primary',
    'darkMode.primary'
  );

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [displayName, setDisplayName] = useState<string>('');
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      await user.getData();

      user.getAvatarUrl().then(setAvatarUrl);
      user.getDisplayName().then(setDisplayName);
      user.getUsername().then(setUsername);
    };

    fetchData();
  }, [user]);

  return (
    <Pressable bg={baseBgColor} onPress={navigateToProfile}>
      {({ isHovered, isPressed }) => {
        return (
          <HStack
            h={20}
            pl={2}
            my={3}
            bg={isPressed || isHovered ? primaryBgColor : baseBgColor}
          >
            <Center w="20%">
              <Avatar size="lg" source={{ uri: avatarUrl }} />
            </Center>
            <Center w="65%">
              <VStack w="full" h="full" pl={2} pt={2}>
                <Text fontSize="xl" fontWeight="bold">
                  {displayName}
                </Text>
                <Text fontSize="lg" color="grey">
                  @{username}
                </Text>
              </VStack>
            </Center>
            <Center w="15%">{endComponent}</Center>
          </HStack>
        );
      }}
    </Pressable>
  );
};

export default UserRow;
