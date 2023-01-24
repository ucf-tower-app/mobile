import { Flex, Icon, Text } from 'native-base';
import { useState } from 'react';
import IconToggle from './IconToggle';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  isLiked: boolean;
  onToggleLike: () => void;
  numLikes: number;
};
const LikeButton = ({ isLiked, onToggleLike, numLikes }: Props) => {
  const [isLikedLocal, setIsLikedLocal] = useState<boolean>(isLiked);
  const [numLikesLocal, setNumLikesLocal] = useState<number>(numLikes);

  const toggleIsLikedLocal = () => {
    setIsLikedLocal(!isLikedLocal);
    if (!isLikedLocal) {
      setNumLikesLocal(numLikesLocal + 1);
    } else {
      setNumLikesLocal(numLikesLocal - 1);
    }
    onToggleLike();
  };

  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="center">
      <Text mr={1}>{numLikesLocal}</Text>
      <IconToggle
        status={isLikedLocal}
        onToggle={toggleIsLikedLocal}
        onIcon={<Icon as={Ionicons} name="heart" size={5} color="red.500" />}
        offIcon={
          <Icon as={Ionicons} name="heart-outline" size={5} color="black" />
        }
      />
    </Flex>
  );
};

export default LikeButton;
