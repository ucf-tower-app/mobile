import { Avatar, VStack, Heading, Text } from 'native-base';
import { useEffect, useState } from 'react';
import { User } from '../../xplat/types/user';

type Props = {
  user: User;
};
const ProfileBanner = ({ user }: Props) => {
  const [handle, setHandle] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      user.getUsername().then(setHandle);

      // TODO: get avatar and name pending:
      // Avatars: https://github.com/ucf-tower-app/xplat/pull/11/files
      // Fullname: https://github.com/ucf-tower-app/xplat/issues/12
    };

    fetchData();
  }, [user]);
  return (
    <VStack justifyContent="center" alignItems="center" bg="white">
      <Avatar source={{ uri: avatarUrl }} bg="gray.300" size="2xl" mb={3} />
      <Heading fontSize="3xl" mb={1}>
        {name}
      </Heading>
      <Text fontSize="lg" color="gray.400">
        {`@${handle}`}
      </Text>
    </VStack>
  );
};

export default ProfileBanner;
