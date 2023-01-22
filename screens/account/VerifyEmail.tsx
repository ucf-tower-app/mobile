import { Button, Center, Heading, Text, VStack } from 'native-base';
import { useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import {
  isEmailVerifiedAtom,
  userPermissionLevelAtom,
} from '../../utils/atoms';
import { sendAuthEmail, startWaitForVerificationPoll } from '../../xplat/api';
import { auth } from '../../xplat/Firebase';

const VerifyEmail = () => {
  const setIsEmailVerified = useSetRecoilState(isEmailVerifiedAtom);
  const setUserPermissionLevel = useSetRecoilState(userPermissionLevelAtom);

  useEffect(() => {
    startWaitForVerificationPoll((user) => {
      setIsEmailVerified(true);
      user.getStatus().then(setUserPermissionLevel);
    });
  }, [setIsEmailVerified, setUserPermissionLevel]);

  return (
    <Center>
      <VStack
        w="90%"
        h="full"
        mx="3"
        maxW="300px"
        justifyContent="center"
        alignItems="center"
      >
        <Heading size="xl">You're almost there</Heading>
        <Text fontSize="md" color="gray.600">
          Verify your email to continue
        </Text>
        <Button mt={16} variant="link" onPress={sendAuthEmail}>
          Didn't get the email? Send another
        </Button>
        <Button mt={4} variant="outline" onPress={() => auth.signOut()}>
          Sign out
        </Button>
      </VStack>
    </Center>
  );
};

export default VerifyEmail;
