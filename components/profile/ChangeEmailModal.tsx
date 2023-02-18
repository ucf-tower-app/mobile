import { Button, Modal, KeyboardAvoidingView } from 'native-base';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import { userPermissionLevelAtom } from '../../utils/atoms';
import { useSetRecoilState } from 'recoil';
import { UserActionError, UserStatus } from '../../xplat/types';
import { Center, FormControl, Input, useToast, Box } from 'native-base';
import { useState } from 'react';
import { isKnightsEmail } from '../../xplat/api';

type ChangeEmailFormData = {
  password: string;
  oldEmail: string;
  newEmail: string;
};

type ChangeEmailErrorData = {
  password?: string;
  oldEmail?: string;
  newEmail?: string;
};

const checkOldEmail = (oldEmail: string, errorData: ChangeEmailErrorData) => {
  if (oldEmail === '') errorData.oldEmail = 'Cannot be empty';
};

const checkNewEmail = (newEmail: string, errorData: ChangeEmailErrorData) => {
  if (newEmail === '') errorData.newEmail = 'Cannot be empty';
};

const checkPassword = (password: string, errorData: ChangeEmailErrorData) => {
  if (password === '') errorData.password = 'Cannot be empty';
};

type Props = {
  isConfirming: boolean;
  close: () => void;
  closeAllModals?: () => void;
};
const ChangeEmailModal = ({ isConfirming, close, closeAllModals }: Props) => {
  const toast = useToast();

  const setUserPermissionLevel = useSetRecoilState(userPermissionLevelAtom);
  const signedInUser = useRecoilValue(userAtom);
  const [confirmChangeEmail, setConfirmChangeEmail] = useState<boolean>(false);

  const [formData, setData] = useState<ChangeEmailFormData>({
    password: '',
    oldEmail: '',
    newEmail: '',
  });
  const [errorData, setErrorData] = useState<ChangeEmailErrorData>({});
  const [isServerProcessing, setIsServerProcessing] = useState<boolean>(false);

  const onSubmit = () => {
    setConfirmChangeEmail(false);
    const newErrorData: ChangeEmailErrorData = {};
    checkNewEmail(formData.newEmail, newErrorData);
    checkOldEmail(formData.oldEmail, newErrorData);
    checkPassword(formData.password, newErrorData);

    setErrorData(newErrorData);

    if (Object.values(newErrorData).every((value) => !value)) {
      if (!isKnightsEmail(formData.newEmail)) {
        toast.show({
          description: 'New email must be a knights email',
          placement: 'top',
        });
        return;
      }
      setIsServerProcessing(true);
      signedInUser
        ?.changeEmail(formData.oldEmail, formData.newEmail, formData.password)
        .then(
          () => {
            onClose();
            if (closeAllModals !== undefined) {
              closeAllModals();
            }
            setUserPermissionLevel(UserStatus.Unverified);
          },
          (error) => {
            if (
              error === UserActionError.AlreadyKnights ||
              error === UserActionError.IncorrectOldEmail ||
              error === UserActionError.MusntBeManager
            ) {
              toast.show({
                description: error,
                placement: 'top',
              });
            } else {
              toast.show({
                description: 'Password or old email is incorrect',
                placement: 'top',
              });
            }
          }
        )
        .finally(() => setIsServerProcessing(false));
    }
  };

  const onClose = () => {
    if (confirmChangeEmail) {
      setConfirmChangeEmail(false);
    } else {
      setData({ password: '', oldEmail: '', newEmail: '' });
      setErrorData({});
      setConfirmChangeEmail(false);
      close();
    }
  };

  return (
    <Box>
      <Modal isOpen={isConfirming} onClose={onClose}>
        {confirmChangeEmail ? (
          <Modal.Content maxWidth="lg">
            <Modal.CloseButton />
            <Modal.Header>Confirm Change Email</Modal.Header>
            <Modal.Body>
              This will lock you out of your account until you verify the new
              email. Are you sure you want to do this?
            </Modal.Body>
            <Modal.Footer>
              <Button
                onPress={() => setConfirmChangeEmail(false)}
                variant="unstyled"
                colorScheme="coolGray"
              >
                Cancel
              </Button>
              <Button onPress={onSubmit} colorScheme="danger">
                Confirm
              </Button>
            </Modal.Footer>
          </Modal.Content>
        ) : (
          <KeyboardAvoidingView w="full" behavior="padding" alignItems="center">
            <Modal.Content>
              <Modal.CloseButton />
              <Modal.Header>Change Email</Modal.Header>
              <Modal.Body>
                <Center>
                  <FormControl isRequired isInvalid={'password' in errorData}>
                    <FormControl.Label
                      _text={{
                        bold: true,
                      }}
                    >
                      Password
                    </FormControl.Label>
                    <Input
                      placeholder="myPassword"
                      type="password"
                      onChangeText={(password) =>
                        setData({ ...formData, password })
                      }
                      autoCorrect={false}
                      autoCapitalize="none"
                    />
                    {'password' in errorData ? (
                      <FormControl.ErrorMessage>
                        {errorData.password}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl isRequired isInvalid={'oldEmail' in errorData}>
                    <FormControl.Label
                      _text={{
                        bold: true,
                      }}
                    >
                      Old Email
                    </FormControl.Label>
                    <Input
                      placeholder="myemail@mail.com"
                      onChangeText={(oldEmail) =>
                        setData({ ...formData, oldEmail })
                      }
                      autoCorrect={false}
                      autoCapitalize="none"
                    />
                    {'oldEmail' in errorData ? (
                      <FormControl.ErrorMessage>
                        {errorData.oldEmail}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                  <FormControl isRequired isInvalid={'newEmail' in errorData}>
                    <FormControl.Label
                      _text={{
                        bold: true,
                      }}
                    >
                      Knights Email
                    </FormControl.Label>
                    <Input
                      placeholder="myemail@knights.ucf.edu"
                      onChangeText={(newEmail) =>
                        setData({ ...formData, newEmail })
                      }
                      autoCorrect={false}
                      autoCapitalize="none"
                    />

                    {'newEmail' in errorData ? (
                      <FormControl.ErrorMessage>
                        {errorData.newEmail}
                      </FormControl.ErrorMessage>
                    ) : null}
                  </FormControl>
                </Center>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  onPress={onClose}
                  variant="unstyled"
                  colorScheme="coolGray"
                >
                  Cancel
                </Button>
                <Button
                  onPress={() => setConfirmChangeEmail(true)}
                  isLoading={isServerProcessing}
                  colorScheme="danger"
                >
                  Change Email
                </Button>
              </Modal.Footer>
            </Modal.Content>
          </KeyboardAvoidingView>
        )}
      </Modal>
    </Box>
  );
};

export default ChangeEmailModal;
