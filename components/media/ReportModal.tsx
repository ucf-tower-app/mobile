import { Button, Modal } from 'native-base';

type ModalProps = {
  isOpen: boolean;
  close: () => void;
  onConfirm: () => void;
};
const ReportModal = ({ isOpen, close, onConfirm }: ModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={close}>
      <Modal.Content maxWidth="lg">
        <Modal.CloseButton />
        <Modal.Header>Report</Modal.Header>
        <Modal.Body>Are you sure you want to report this content?</Modal.Body>
        <Modal.Footer>
          <Button onPress={close} variant="unstyled" colorScheme="coolGray">
            Cancel
          </Button>
          <Button
            onPress={() => {
              onConfirm();
              close();
            }}
            colorScheme="danger"
          >
            Report
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default ReportModal;
