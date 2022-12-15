import { Avatar, HStack, VStack, Center, Text } from 'native-base';
import { User } from '../../xplat/types/user';
import { useEffect, useState } from 'react';

type Props = {
  user: User;
  endComponent?: JSX.Element;
};
const UserRow = ({ user, endComponent }: Props) => {
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
    <HStack h={20} pl={2} my={3} backgroundColor="white">
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
};

export default UserRow;
