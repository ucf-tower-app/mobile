import { Modal, Button } from 'native-base';
import { useState } from 'react';
import StarRating from 'react-native-star-rating-widget';

type Props = {
  isOpen: boolean;
  close: () => void;
};
const RatingModal = ({ isOpen, close }: Props) => {
  const [hasTouched, setHasTouched] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const submitRating = (rating: number) => {
    setIsLoading(true);
    // TODO: Submit the rating to xplat

    setTimeout(() => {
      setIsLoading(false);
      close();
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={close}>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header>Rate this route</Modal.Header>
        <Modal.Body>
          <StarRating
            rating={rating}
            onChange={setRating}
            onRatingStart={() => setHasTouched(true)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            onPress={() => submitRating(rating)}
            isLoading={isLoading}
            isDisabled={!hasTouched}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

export default RatingModal;
