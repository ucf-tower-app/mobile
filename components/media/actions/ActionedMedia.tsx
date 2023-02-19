import { Box, Text, useColorModeValue } from 'native-base';

type Action = 'hidden' | 'deleted';
type Props = {
  action: Action;
};
const ActionedMedia = ({ action }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <Box w="full" bg={baseBgColor} pl={2}>
      <Text italic>This media has been {action}</Text>
    </Box>
  );
};

export default ActionedMedia;
