import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Avatar, HStack, VStack, Center, Text, CloseIcon } from 'native-base';
import { PropMap } from '../../utils/routes/routes';

type Props = NativeStackScreenProps<PropMap, 'UserRow'>;
const UserRow = ({ route }: Props) => {
  return (
    <HStack h={20} pl={2} my={3} backgroundColor="white">
      <Center w="20%">
        <Avatar size="lg" source={{ uri: route.params.avatarUrl }} />
      </Center>
      <Center w="65%">
        <VStack w="full" h="full" pl={2} pt={2}>
          <Text fontSize="xl" fontWeight="bold">
            {route.params.userName}
          </Text>
          <Text fontSize="lg" color="grey">
            {route.params.userHandle}
          </Text>
        </VStack>
      </Center>
      {/** Should eventually support dynamic end buttons */}
      <Center w="15%" />
    </HStack>
  );
};

export default UserRow;
