import { Button, Heading, Text, VStack } from 'native-base';
import { auth } from '../../xplat/Firebase';
const NotifyBanned = () => {
  return (
    <VStack w="full" h="full" justifyContent="center" alignItems="center">
      <Heading fontSize="2xl">Banned</Heading>
      <Text>This account has been permanently banned.</Text>
      <Button variant="link" onPress={() => auth.signOut()}>
        Sign out
      </Button>
    </VStack>
  );
};

export default NotifyBanned;
