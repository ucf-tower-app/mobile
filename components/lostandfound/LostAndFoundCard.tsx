import { Box, VStack, Text, ChevronDownIcon, Pressable } from 'native-base';
import { useState } from 'react';

type Props = {
  title: string;
  description: string;
};
const LostAndFoundCard = ({ title, description }: Props) => {
  const [seeMore, setSeeMore] = useState(false);

  return (
    <Box width="95%" rounded="10px" bg="muted.50" p="2">
      <VStack space="2">
        <Box px="1">
          <Text fontSize="2xl">{title}</Text>
        </Box>
        <Box
          pt="2"
          px="2"
          bg="muted.200"
          borderWidth="1"
          borderColor="muted.300"
          rounded="5px"
        >
          <Text noOfLines={!seeMore ? 5 : undefined}>{description}</Text>
          <Box width="100%" alignItems="flex-end">
            <Pressable onPress={() => setSeeMore(!seeMore)}>
              {({ isHovered, isPressed }) => {
                return (
                  <Box
                    bg={
                      isPressed
                        ? 'coolGray.100'
                        : isHovered
                        ? 'coolGray.100'
                        : 'muted.200'
                    }
                    rounded="5px"
                    m="1"
                  >
                    <ChevronDownIcon />
                  </Box>
                );
              }}
            </Pressable>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

export default LostAndFoundCard;
