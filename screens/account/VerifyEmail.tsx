import { Button, Center, Heading, Input, Text, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { userPermissionLevelAtom } from '../../utils/atoms';
import { auth } from '../../xplat/Firebase';
import { confirmEmailCode, sendEmailCode } from '../../xplat/api';

const VerifyEmail = () => {
  const setUserPermissionLevel = useSetRecoilState(userPermissionLevelAtom);
  const [targCode, setTargCode] = useState<number>();
  const [attemptCode, setAttemptCode] = useState<string>('');

  useEffect(() => {
    if (targCode !== undefined) sendEmailCode().then(setTargCode);
  }, [targCode]);

  useEffect(() => {
    if (targCode?.toString() === attemptCode) {
      confirmEmailCode().then((user) => {
        user.getStatus().then(setUserPermissionLevel);
      });
    }
  }, [attemptCode, setUserPermissionLevel, targCode]);

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
        <Input onChangeText={setAttemptCode} />
        <Button
          mt={16}
          variant="link"
          onPress={() => sendEmailCode().then(setTargCode)}
        >
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
