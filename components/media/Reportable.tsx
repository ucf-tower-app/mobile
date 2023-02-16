import { Button, Modal, useToast } from 'native-base';
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import {
  Post as PostObj,
  Comment as CommentObj,
  User as UserObj,
} from '../../xplat/types';

type Props = {
  isConfirming: boolean;
  media: PostObj | CommentObj | UserObj;
  close: () => void;
  children: React.ReactNode;
};
const Reportable = ({ isConfirming, media, close, children }: Props) => {
  const toast = useToast();

  const signedInUser = useRecoilValue(userAtom);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const reportAndClose = () => {
    if (signedInUser === undefined) return;
    setIsLoading(true);
    signedInUser
      .addReport(media)
      .then(() =>
        toast.show({
          title: 'Report submitted',
          placement: 'top',
        })
      )
      .catch((error) => {
        console.error(error);
        toast.show({
          title: 'Something went wrong, please try again.',
          placement: 'top',
        });
      })
      .finally(() => {
        setIsLoading(false);
        close();
      });
  };

  return (
    <>
      <Modal isOpen={isConfirming} onClose={close}>
        <Modal.Content maxWidth="lg">
          <Modal.CloseButton />
          <Modal.Header>Report</Modal.Header>
          <Modal.Body>Are you sure you want to report this content?</Modal.Body>
          <Modal.Footer>
            <Button onPress={close} variant="unstyled" colorScheme="coolGray">
              Cancel
            </Button>
            <Button
              isLoading={isLoading}
              onPress={reportAndClose}
              colorScheme="danger"
            >
              Report
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>
      {children}
    </>
  );
};

export default Reportable;
