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
import { Keyboard, Platform } from 'react-native';
import { useGenericErrorToast } from '../../utils/hooks';
import {
  createUser,
  CreateUserError,
  isKnightsEmail,
  signIn,
  validDisplayname,
  validUsername,
} from '../../xplat/api';
import ConfirmEmailModal from './ConfirmEmailModal';

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

const checkUsername = (username: string, errorData: RegisterErrorData) => {
  if (!validUsername(username))
    errorData.username = 'Must be 5-15 lowercase characters';
};

const checkDisplayName = (
  displayName: string,
  errorData: RegisterErrorData
) => {
  if (!validDisplayname(displayName))
    errorData.displayName =
      'Must be 5-30 letters or spaces and have no spaces in front or back';
};

const checkPassword = (password: string, errorData: RegisterErrorData) => {
  if (password.length < 8) errorData.password = 'Must be at least 8 characters';
};

type Props = {
  setIsRegistering: (isRegistering: boolean) => void;
};
const Register = ({ setIsRegistering }: Props) => {
  const toast = useToast();
  const genericToast = useGenericErrorToast();

  const [formData, setData] = useState<RegisterFormData>(emptyFormData);
  const [confirmingEmail, setConfirmingEmail] = useState(false);
  const [errorData, setErrorData] = useState<RegisterErrorData>({});
  const [isServerProcessing, setIsServerProcessing] = useState<boolean>(false);

  const register = async () => {
    setConfirmingEmail(false);
    // If there are no errors, then we would like to create a user and sign them in
    setIsServerProcessing(true);
    try {
      await createUser(
        formData.email,
        formData.password,
        formData.username,
        formData.displayName
      );
      await signIn(formData.email, formData.password);
    } catch (error: any) {
      var msg: string | undefined;
      if (error === CreateUserError.UsernameTaken) msg = error;
      else if (error === CreateUserError.InvalidDisplayName) msg = error;
      else if (error === CreateUserError.InvalidUsername) msg = error;
      else if (error.code !== undefined) {
        if (error.code === 'auth/email-already-in-use')
          msg = 'This email is already in use! Please try logging in instead.';
        else console.error(error.code);
      } else {
        console.error(error);
      }

      if (msg !== undefined)
        toast.show({
          description: msg,
          placement: 'top',
        });
      else genericToast();
    } finally {
      setIsServerProcessing(false);
    }
  };

  const onSubmit = async () => {
    Keyboard.dismiss();
    const newErrorData: RegisterErrorData = {};
    checkEmail(formData.email, newErrorData);
    checkUsername(formData.username, newErrorData);
    checkDisplayName(formData.displayName, newErrorData);
    checkPassword(formData.password, newErrorData);

    setErrorData(newErrorData);

    if (Object.values(newErrorData).every((value) => !value)) {
      if (isKnightsEmail(formData.email)) register();
      else setConfirmingEmail(true);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ConfirmEmailModal
        isConfirming={confirmingEmail}
        onClose={() => setConfirmingEmail(false)}
        onConfirm={register}
      />
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
