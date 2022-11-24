import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, VStack, Heading, Text } from 'native-base';
import { PropMap } from '../../utils/routes/routes';

type Props = NativeStackScreenProps<PropMap, 'ProfileBanner'>;
const ProfileBanner = ({ route }: Props) => {
  return (
    <VStack justifyContent="center" alignItems="center" bg="white">
      <Avatar source={{ uri: route.params.avatarUrl }} size="2xl" mb={3} />
      <Heading fontSize="3xl" mb={1}>
        {route.params.userName}
      </Heading>
      <Text fontSize="lg" color="gray.400">
        {`@${route.params.userHandle}`}
      </Text>
    </VStack>
  );
};

export default ProfileBanner;
