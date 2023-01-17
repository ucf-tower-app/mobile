import { Avatar, Heading, Text, useColorModeValue, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { User } from '../../xplat/types/user';

type Props = {
  user: User;
};
const ProfileBanner = ({ user }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const [username, setUsername] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    user.getUsername().then(setUsername);
    user.getDisplayName().then(setDisplayName);
    user.getAvatarUrl().then(setAvatarUrl);
  }, [user]);

  return (
    <VStack justifyContent="center" alignItems="center" bg={baseBgColor}>
      <Avatar source={{ uri: avatarUrl }} bg="gray.300" size="2xl" mb={3} />
      <Heading fontSize="3xl" mb={1}>
        {displayName}
      </Heading>
      <Text fontSize="lg" color="gray.400">
        {`@${username}`}
      </Text>
    </VStack>
  );
};

export default ProfileBanner;
