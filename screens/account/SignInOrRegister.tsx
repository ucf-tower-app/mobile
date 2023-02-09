import {
  Button,
  Center,
  FormControl,
  Heading,
  Input,
  KeyboardAvoidingView,
  useToast,
  VStack,
} from 'native-base';
import { useState } from 'react';
import { Platform } from 'react-native';
import { signIn } from '../../xplat/api';
import Register from './Register';

export type SignInFormData = {
  usernameOrEmail: string;
  password: string;
};

type SignInErrorData = {
  usernameOrEmail?: string;
  password?: string;
};

const checkUsernameOrEmail = (
  usernameOrEmail: string,
  errorData: SignInErrorData
) => {
  if (usernameOrEmail === '') errorData.usernameOrEmail = 'Cannot be empty';
};

const checkPassword = (password: string, errorData: SignInErrorData) => {
  if (password === '') errorData.password = 'Cannot be empty';
};

const SignInOrRegister = () => {
  const toast = useToast();

  const [formData, setData] = useState<SignInFormData>({
    usernameOrEmail: '',
    password: '',
  });
  const [errorData, setErrorData] = useState<SignInErrorData>({});
  const [isServerProcessing, setIsServerProcessing] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const onSubmit = () => {
    if (
      process.env.NODE_ENV === 'development' &&
      formData.usernameOrEmail === ''
    ) {
      signIn('lkf53414@xcoxc.com', 'newpassword');
      return;
    }

    const newErrorData: SignInErrorData = {};
    checkUsernameOrEmail(formData.usernameOrEmail, newErrorData);
    checkPassword(formData.password, newErrorData);

    setErrorData(newErrorData);

    // If there are no errors, then we would like to create a user and sign them in
    if (Object.values(newErrorData).every((value) => !value)) {
      setIsServerProcessing(true);
      signIn(formData.usernameOrEmail, formData.password)
        .catch(() =>
          toast.show({
            description:
              "Oops, that login doesn't match any records in our system. Please try again.",
            placement: 'top',
          })
        )
        .finally(() => setIsServerProcessing(false));
    }
  };

  return isRegistering ? (
    <Register setIsRegistering={setIsRegistering} />
  ) : (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Center>
        <VStack w="90%" h="full" mx="3" maxW="300px" justifyContent="center">
          <Heading size="xl">Sign in</Heading>
          <FormControl isRequired isInvalid={'usernameOrEmail' in errorData}>
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
            {'usernameOrEmail' in errorData ? (
              <FormControl.ErrorMessage>
                {errorData.usernameOrEmail}
              </FormControl.ErrorMessage>
            ) : null}
          </FormControl>
          <FormControl isRequired isInvalid={'password' in errorData}>
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
            {'password' in errorData ? (
              <FormControl.ErrorMessage>
                {errorData.password}
              </FormControl.ErrorMessage>
            ) : null}
          </FormControl>
          <Button onPress={onSubmit} mt={5} isLoading={isServerProcessing}>
            Submit
          </Button>
          <Button variant="link" onPress={() => setIsRegistering(true)}>
            Don't have an account?
          </Button>
        </VStack>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default SignInOrRegister;
