import { VStack, Text, Button } from 'native-base';
import { useEffect } from 'react';
import { sendAuthEmail } from '../../xplat/api';
import { auth } from '../../xplat/Firebase';

const checkUser = () => {
  setInterval(() => {
    auth.currentUser?.reload();
    if (auth.currentUser?.emailVerified !== true) checkUser();
  }, 1000);
};

const VerifyEmail = () => {
  useEffect(() => {
    checkUser();
  }, []);

  return (
    <VStack w="full" h="full" justifyContent="center" alignItems="center">
      <Text>Verify email</Text>
      <Button onPress={() => auth.signOut()}>Sign out</Button>
      <Button onPress={() => sendAuthEmail()}>Send another email</Button>
    </VStack>
  );
};

export default VerifyEmail;
