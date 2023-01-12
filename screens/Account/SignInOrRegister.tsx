import {
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  VStack,
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
  const [isServerProcessing, setIsServerProcessing] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const onSubmit = () => {
    // TODO: Validate the data
    console.log(formData);
    setIsServerProcessing(true);
    signIn(formData.usernameOrEmail, formData.password).finally(() =>
      setIsServerProcessing(false)
    );
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
            autoCorrect={false}
            autoCapitalize="none"
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
            autoCorrect={false}
            autoCapitalize="none"
          />
        </FormControl>
        <Button onPress={onSubmit} mt={5} isLoading={isServerProcessing}>
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
