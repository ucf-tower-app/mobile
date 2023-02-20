import { Box, Button, Modal, Text } from 'native-base';

type Props = {
  isConfirming: boolean;
  onClose: () => void;
  onConfirm: () => void;
};
const ConfirmEmailModal = ({ isConfirming, onClose, onConfirm }: Props) => {
  return (
    <Box>
      <Modal isOpen={isConfirming} onClose={onClose}>
        <Modal.Content maxWidth="lg">
          <Modal.CloseButton />
          <Modal.Header>Confirm Non-Knights Email</Modal.Header>
          <Modal.Body>
            <Text>
              You are about to create an account with an email that isn't a
              knights email. This is allowed, but you will only be able to view
              other people's posts.
            </Text>
            <Text />
            <Text>
              If you wish to make posts, follow people, make sends, join the
              leaderboard, etc., you must register using your knights email.
              This is for the security of the app and yourself!
            </Text>
          </Modal.Body>
          <Modal.Footer>
            <Button onPress={onClose}>Cancel</Button>
            <Button marginLeft={2} onPress={onConfirm} colorScheme="danger">
              Confirm
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

export default ConfirmEmailModal;
