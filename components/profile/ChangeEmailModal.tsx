import { Button, Modal } from 'native-base';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import { userPermissionLevelAtom } from '../../utils/atoms';
import { useSetRecoilState } from 'recoil';
import { UserStatus } from '../../xplat/types';

type Props = {
  isConfirming: boolean;
  close: () => void;
};
const ChangeEmailModal = ({ isConfirming, close }: Props) => {
  const setUserPermissionLevel = useSetRecoilState(userPermissionLevelAtom);
  const signedInUser = useRecoilValue(userAtom);

  const verify = () => {
    if (signedInUser === undefined) return;
    setUserPermissionLevel(UserStatus.Unverified);
    close();
  };

  return (
    <Modal isOpen={isConfirming} onClose={close}>
      <Modal.Content maxWidth="lg">
        <Modal.CloseButton />
        <Modal.Header>Change Email</Modal.Header>
        <Modal.Body>
          This will lock you out of your account until you verify the new email.
          Are you sure you want to do this?
        </Modal.Body>
        <Modal.Footer>
          <Button onPress={close} variant="unstyled" colorScheme="coolGray">
            Cancel
          </Button>
          <Button onPress={verify} colorScheme="danger">
            Change Email
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ChangeEmailModal;
