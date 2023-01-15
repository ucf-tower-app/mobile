import { Box, Center, HStack, useColorModeValue, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Dimensions, Image as ImageRN } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Media, { MediaType } from './Media';

type Props = {
  mediaList: Array<MediaType>;
};
const MediaCarousel = ({ mediaList }: Props) => {
  const primaryColor = useColorModeValue(
    'lightMode.primary',
    'darkMode.primary'
  );
  const accentColor = useColorModeValue(
    'lightMode.secondary',
    'darkMode.secondary'
  );

  const width = Dimensions.get('window').width;
  const [height, setHeight] = useState<number>(200);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [data, setData] = useState<Array<number>>([]);

  useEffect(() => {
    setData([...mediaList.keys()]);
    if (mediaList.length === 0) return;
    ImageRN.getSize(mediaList[0].imageUrl, (imageWidth, imageHeight) => {
      const aspectRatio = imageWidth / imageHeight;
      const calculatedHeight = width / aspectRatio;
      setHeight(calculatedHeight);
    });
  }, [mediaList, width]);

  if (mediaList.length === 0) return null;
  if (mediaList.length === 1)
    return <Media media={mediaList[0]} width={width} height={height} />;

  return (
    <VStack space={2} width={width}>
      <Carousel
        loop={false}
        data={data}
        width={width}
        height={height}
        renderItem={({ index }) => (
          <Media media={mediaList[index]} width={width} height={height} />
        )}
        onProgressChange={(_, absoluteProgress) =>
          setFocusedIndex(Math.round(absoluteProgress))
        }
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
      />
      <Center>
        <HStack space={1.5}>
          {data.map((index) => (
            <Box
              key={index}
              bg={index === focusedIndex ? accentColor : primaryColor}
              w={2}
              h={2}
              rounded="full"
            />
          ))}
        </HStack>
      </Center>
    </VStack>
  );
};

export default MediaCarousel;
