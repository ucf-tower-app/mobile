import { Center, FormControl, Input, VStack } from 'native-base';

const ChangePassword = () => {
  return (
    <Center width="full" p="3">
      <VStack width="full">
        <FormControl>
          <FormControl.Label>Old Password</FormControl.Label>
          <Input />
        </FormControl>
        <FormControl mt="3">
          <FormControl.Label>New Password</FormControl.Label>
          <Input />
        </FormControl>
      </VStack>
    </Center>
  );
};

export default ChangePassword;
