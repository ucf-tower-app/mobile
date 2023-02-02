import { Avatar, Heading, Text, useColorModeValue, VStack } from 'native-base';
import { FetchedUser } from '../../utils/queries';

type Props = {
  fetchedUser: FetchedUser;
};
const ProfileBanner = ({ fetchedUser }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <VStack justifyContent="center" alignItems="center" bg={baseBgColor}>
      <Avatar
        source={{ uri: fetchedUser.avatarUrl }}
        bg="gray.300"
        size="2xl"
        mb={3}
      />
      <Heading fontSize="3xl" mb={1}>
        {fetchedUser.displayName}
      </Heading>
      <Text fontSize="lg" color="gray.400">
        {`@${fetchedUser.username}`}
      </Text>
    </VStack>
  );
};

export default ProfileBanner;
