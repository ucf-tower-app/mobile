import {
  Box,
  Center,
  HStack,
  Text,
  VStack,
  useColorModeValue,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Dimensions, Image as ImageRN } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Media, { MediaType } from './Media';

type Props = {
  mediaList: MediaType[];
  preview?: boolean;
};
const MediaCarousel = ({ mediaList, preview = false }: Props) => {
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
  const [data, setData] = useState<number[]>([]);

  useEffect(() => {
    setData([...mediaList.keys()]);
    if (mediaList.length === 0) return;
    ImageRN.getSize(mediaList[0].imageUrl, (imageWidth, imageHeight) => {
      const aspectRatio = imageWidth / imageHeight;
      const calculatedHeight = width / aspectRatio;
      setHeight(Math.min(calculatedHeight, 350));
    });
  }, [mediaList, width]);

  if (mediaList.length === 0) return null;
  if (mediaList.length === 1)
    return (
      <Center>
        <Text fontSize={'xs'} color={'gray.400'} textAlign={'center'}>
          (This is a preview; post images/videos will be full-size.)
        </Text>
        <Media
          media={mediaList[0]}
          width={width * (preview ? 0.5 : 1)}
          height={height * (preview ? 0.5 : 1)}
        />
      </Center>
    );

  return (
    <VStack space={2} width={width}>
      {preview && (
        <Center>
          <Text fontSize={'xs'} color={'gray.400'} textAlign={'center'}>
            (This is a preview; post images/videos will be full-size.)
          </Text>
        </Center>
      )}
      <Center>
        <Carousel
          loop={false}
          data={data}
          width={width * (preview ? 0.5 : 1)}
          height={height * (preview ? 0.5 : 1)}
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
      </Center>
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
