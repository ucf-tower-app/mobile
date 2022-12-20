import { Box } from 'native-base';
import { LAYERS } from '../../utils/style';

type Props = {
  tinted: boolean;
  rounded?: boolean;
};
const Tintable = ({ tinted, rounded = false }: Props) => {
  return (
    <Box
      position="absolute"
      left={0}
      top={0}
      w="full"
      h="full"
      bg="black"
      rounded={rounded ? 'full' : 0}
      zIndex={LAYERS.TINT}
      opacity={tinted ? 0.2 : 0}
    />
  );
};

export default Tintable;
