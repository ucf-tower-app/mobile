import { Button, Modal, useToast } from 'native-base';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../../../App';
import { userAtom } from '../../../utils/atoms';
import { useGenericErrorToast } from '../../../utils/hooks';
import { User as UserObj } from '../../../xplat/types';

type Props = {
  isConfirming: boolean;
  user: UserObj;
  close: () => void;
};
const Blockable = ({ isConfirming, user, close }: Props) => {
  const toast = useToast();
  const genericToast = useGenericErrorToast();

  const signedInUser = useRecoilValue(userAtom);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const blockAndClose = () => {
    if (signedInUser === undefined) return;
    setIsLoading(true);
    signedInUser
      .blockUser(user)
      .then(() => {
        toast.show({
          title: 'Blocked user.',
          placement: 'top',
        });
        queryClient.invalidateQueries({ queryKey: [signedInUser.getId()] });
      })
      .catch((error) => {
        console.error(error);
        genericToast();
      })
      .finally(() => {
        setIsLoading(false);
        close();
      });
  };

  return (
    <Modal isOpen={isConfirming} onClose={close}>
      <Modal.Content maxWidth="lg">
        <Modal.CloseButton />
        <Modal.Header>Block</Modal.Header>
        <Modal.Body>Are you sure you want to block this user?</Modal.Body>
        <Modal.Footer>
          <Button onPress={close} variant="unstyled" colorScheme="coolGray">
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            onPress={blockAndClose}
            colorScheme="danger"
          >
            Block
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default Blockable;
