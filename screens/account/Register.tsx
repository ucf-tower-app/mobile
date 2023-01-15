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
import { createUser, sendAuthEmail, signIn } from '../../xplat/api';

type RegisterFormData = {
  email: string;
  username: string;
  displayName: string;
  password: string;
};
const emptyFormData: RegisterFormData = {
  email: '',
  username: '',
  displayName: '',
  password: '',
};

type RegisterErrorData = {
  email?: string;
  username?: string;
  displayName?: string;
  password?: string;
};

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const checkEmail = (email: string, errorData: RegisterErrorData) => {
  if (!emailRegex.test(email)) errorData.email = 'Invalid email';
};

const usernameRegex = /^[a-zA-Z0-9]+[._-]?[a-zA-Z0-9]*$/;
const checkUsername = (username: string, errorData: RegisterErrorData) => {
  if (username.length < 5) errorData.username = 'Must be at least 5 characters';
  else if (username.length > 15)
    errorData.username = 'Must be at most 15 characters';
  else if (!usernameRegex.test(username))
    errorData.username =
      'Must begin with a letter and contain at most one dot, underscore, or dash';
};

const checkDisplayName = (
  displayName: string,
  errorData: RegisterErrorData
) => {
  if (displayName.length < 5)
    errorData.displayName = 'Must be at least 5 characters';
};

const checkPassword = (password: string, errorData: RegisterErrorData) => {
  if (password.length < 8) errorData.password = 'Must be at least 8 characers';
};

type Props = {
  setIsRegistering: (isRegistering: boolean) => void;
};
const Register = ({ setIsRegistering }: Props) => {
  const toast = useToast();

  const [formData, setData] = useState<RegisterFormData>(emptyFormData);
  const [errorData, setErrorData] = useState<RegisterErrorData>({});
  const [isServerProcessing, setIsServerProcessing] = useState<boolean>(false);

  const onSubmit = async () => {
    const newErrorData: RegisterErrorData = {};
    checkEmail(formData.email, newErrorData);
    checkUsername(formData.username, newErrorData);
    checkDisplayName(formData.displayName, newErrorData);
    checkPassword(formData.password, newErrorData);

    setErrorData(newErrorData);

    // If there are no errors, then we would like to create a user and sign them in
    if (Object.values(newErrorData).every((value) => !value)) {
      setIsServerProcessing(true);

      try {
        await createUser(
          formData.email,
          formData.password,
          formData.username,
          formData.displayName
        );

        await signIn(formData.email, formData.password);
        await sendAuthEmail();
      } catch {
        toast.show({
          description: 'Oops, this email already exists. Please try again.',
          placement: 'top',
        });
      } finally {
        setIsServerProcessing(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Center>
        <VStack w="90%" h="full" mx="3" maxW="300px" justifyContent="center">
          <Heading size="xl">Register</Heading>
          <FormControl isRequired isInvalid={'email' in errorData}>
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Email
            </FormControl.Label>
            <Input
              placeholder="CrimpMaster@knights.ucf.edu"
              onChangeText={(email) => setData({ ...formData, email })}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {'email' in errorData ? (
              <FormControl.ErrorMessage>
                {errorData.email}
              </FormControl.ErrorMessage>
            ) : null}
          </FormControl>
          <FormControl isRequired isInvalid={'username' in errorData}>
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Username
            </FormControl.Label>
            <Input
              placeholder="SendyMcSendIt"
              onChangeText={(username) => setData({ ...formData, username })}
              autoCorrect={false}
              autoCapitalize="none"
            />
            {'username' in errorData ? (
              <FormControl.ErrorMessage>
                {errorData.username}
              </FormControl.ErrorMessage>
            ) : null}
          </FormControl>
          <FormControl isRequired isInvalid={'displayName' in errorData}>
            <FormControl.Label
              _text={{
                bold: true,
              }}
            >
              Display Name
            </FormControl.Label>
            <Input
              placeholder="Senderson Ranx"
              onChangeText={(displayName) =>
                setData({ ...formData, displayName })
              }
              autoCorrect={false}
              autoCapitalize="none"
            />
            {'displayName' in errorData ? (
              <FormControl.ErrorMessage>
                {errorData.displayName}
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
            Register
          </Button>
          <Button variant="link" onPress={() => setIsRegistering(false)}>
            Already have an account?
          </Button>
        </VStack>
      </Center>
    </KeyboardAvoidingView>
  );
};

export default Register;