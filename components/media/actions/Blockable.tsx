import { Button, Modal, useToast } from 'native-base';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { queryClient } from '../../../App';
import { userAtom } from '../../../utils/atoms';
import { useGenericErrorToast } from '../../../utils/hooks';
import { User as UserObj, invalidateDocRefId } from '../../../xplat/types';

type Props = {
  isConfirming: boolean;
  user: UserObj;
  isBlocked: boolean;
  close: () => void;
};
const Blockable = ({ isConfirming, user, isBlocked, close }: Props) => {
  const toast = useToast();
  const genericToast = useGenericErrorToast();
  const action = isBlocked ? 'Unblock' : 'Block';

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
        invalidateDocRefId(signedInUser.getId());
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

  const unblockAndClose = () => {
    if (signedInUser === undefined) return;
    setIsLoading(true);
    signedInUser
      .unblockUser(user)
      .then(() => {
        toast.show({
          title: 'Unblocked user.',
          placement: 'top',
        });
        invalidateDocRefId(signedInUser.getId());
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
        <Modal.Header>{action}</Modal.Header>
        <Modal.Body>
          Are you sure you want to {action.toLowerCase()} this user?
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={close} variant="unstyled" colorScheme="coolGray">
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            onPress={() => (isBlocked ? unblockAndClose() : blockAndClose())}
            colorScheme="danger"
          >
            {action}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default Blockable;
