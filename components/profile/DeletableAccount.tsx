import { Button, Text, Modal, useToast, Input } from 'native-base';
import { useState } from 'react';
import { User as UserObj } from '../../xplat/types';
import { auth } from '../../xplat/Firebase';

type AreYouSureProps = {
  isConfirming: boolean;
  yes: () => void;
  no: () => void;
};
const AreYouSure = ({ isConfirming, yes, no }: AreYouSureProps) => {
  return (
    <Modal isOpen={isConfirming} onClose={no}>
      <Modal.Content maxWidth="lg">
        <Modal.CloseButton />
        <Modal.Header>Delete Account</Modal.Header>
        <Modal.Body>
          Are you sure you would like to permanently delete your account? This
          cannot be undone
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={no} variant="unstyled" colorScheme="coolGray">
            Cancel
          </Button>
          <Button onPress={yes} colorScheme="danger">
            Yes
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

type Props = {
  isConfirming: boolean;
  user: UserObj;
  close: () => void;
};
const DeletableAccount = ({ isConfirming, user, close }: Props) => {
  const toast = useToast();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSure, setIsSure] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

  if (!isSure)
    return (
      <AreYouSure
        isConfirming={isConfirming}
        yes={() => setIsSure(true)}
        no={close}
      />
    );

  const deleteAndClose = () => {
    setIsLoading(true);
    user
      .delete(password)
      .then(() => {
        toast.show({
          title: 'Account deleted',
          placement: 'top',
        });
        close();
        auth.signOut();
      })
      .catch((error) => {
        console.error(error);
        toast.show({
          title: 'Something went wrong, please try again',
          placement: 'top',
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Modal isOpen={isConfirming} onClose={close}>
      <Modal.Content maxWidth="lg">
        <Modal.CloseButton />
        <Modal.Header>Delete Account</Modal.Header>
        <Modal.Body>
          <Text>Enter your password to permanently delete your account.</Text>
          <Input
            type="password"
            onChangeText={(_password) => setPassword(_password)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={close} variant="unstyled" colorScheme="coolGray">
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            onPress={deleteAndClose}
            colorScheme="danger"
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default DeletableAccount;
