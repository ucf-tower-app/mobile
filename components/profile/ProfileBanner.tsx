import { Avatar, Heading, Text, VStack } from 'native-base';
import { FetchedUser } from '../../xplat/types';

type Props = {
  fetchedUser: FetchedUser;
};
const ProfileBanner = ({ fetchedUser }: Props) => {
  return (
    <VStack justifyContent="center" alignItems="center">
      <Avatar
        source={{ uri: fetchedUser.avatarUrl }}
        bg="gray.300"
        size="2xl"
        mb={3}
        borderWidth={2}
      />
      <Heading fontSize="3xl" mb={1}>
        {fetchedUser.displayName}
      </Heading>
      <Text fontSize="md" color="gray.400">
        {`@${fetchedUser.username}`}
      </Text>
      <Text fontSize="lg" color="gray.400">
        {`${fetchedUser.bio}`}
      </Text>
    </VStack>
  );
};

export default ProfileBanner;
