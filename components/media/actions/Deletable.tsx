import { Button, Modal, useToast } from 'native-base';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../../utils/atoms';
import { Post as PostObj, Comment as CommentObj } from '../../../xplat/types';

type Props = {
  isConfirming: boolean;
  media: PostObj | CommentObj;
  close: () => void;
};
const Deletable = ({ isConfirming, media, close }: Props) => {
  const toast = useToast();

  const signedInUser = useRecoilValue(userAtom);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const deleteAndClose = () => {
    if (signedInUser === undefined) return;
    setIsLoading(true);
    media
      .delete()
      .then(
        () =>
          toast.show({
            title: 'Content deleted',
            placement: 'top',
          })
        // TODO: Invalidate places that this shows up? How do we do this...
        // idea, flag the content as shouldBeHidden and then invalidate the content itself.
        // the content won't be shown on any surfaces anymore! We
      )
      .catch((error) => {
        console.error(error);
        toast.show({
          title: 'Something went wrong, please try again',
          placement: 'top',
        });
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
        <Modal.Header>Report</Modal.Header>
        <Modal.Body>Are you sure you want to delete this content?</Modal.Body>
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

export default Deletable;
