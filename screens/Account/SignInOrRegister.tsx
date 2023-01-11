import {
  VStack,
  Center,
  FormControl,
  Input,
  Heading,
  Button,
} from 'native-base';
import { useState } from 'react';
import { signIn } from '../../xplat/api';
import Register from './Register';

export type SignInFormData = {
  usernameOrEmail: string;
  password: string;
};

const SignInOrRegister = () => {
  const [formData, setData] = useState<SignInFormData>({
    usernameOrEmail: '',
    password: '',
  });

  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const onSubmit = () => {
    // TODO: Validate the data
    console.log(formData);
    signIn(formData.usernameOrEmail, formData.password);
  };

  return isRegistering ? (
    <Register setIsRegistering={setIsRegistering} />
  ) : (
    <Center>
      <VStack w="90%" h="full" mx="3" maxW="300px" justifyContent="center">
        <Heading size="xl">Sign in</Heading>
        <FormControl isRequired>
          <FormControl.Label
            _text={{
              bold: true,
            }}
          >
            Username or email
          </FormControl.Label>
          <Input
            placeholder="SenderMcSendIt"
            onChangeText={(usernameOrEmail) =>
              setData({ ...formData, usernameOrEmail })
            }
          />
          <FormControl.Label
            _text={{
              bold: true,
            }}
          >
            Password
          </FormControl.Label>
          <Input
            placeholder="mysecretpassword"
            onChangeText={(password) => setData({ ...formData, password })}
            type="password"
          />
        </FormControl>
        <Button onPress={onSubmit} mt={5}>
          Submit
        </Button>
        <Button variant="link" onPress={() => setIsRegistering(true)}>
          Don't have an account?
        </Button>
      </VStack>
    </Center>
  );
};

export default SignInOrRegister;
