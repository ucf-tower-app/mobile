import { VStack, Text, Button } from 'native-base';
import { sendAuthEmail } from '../../xplat/api';
import { auth } from '../../xplat/Firebase';

const VerifyEmail = () => {
  return (
    <VStack w="full" h="full" justifyContent="center" alignItems="center">
      <Text>Verify email</Text>
      <Button onPress={() => auth.signOut()}>Sign out</Button>
      <Button onPress={() => sendAuthEmail()}>Send another email</Button>
    </VStack>
  );
};

export default VerifyEmail;
