import {
  Box,
  Center,
  HStack,
  Image,
  useColorModeValue,
  VStack,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Dimensions, Image as ImageRN } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

type Props = {
  imageUrls: Array<string>;
};
const ImageCarousel = ({ imageUrls }: Props) => {
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
    if (imageUrls.length === 0) return;
    setData([...imageUrls.keys()]);
    ImageRN.getSize(imageUrls[0], (imageWidth, imageHeight) => {
      const aspectRatio = imageWidth / imageHeight;
      const calculatedHeight = width / aspectRatio;
      setHeight(calculatedHeight);
    });
  }, [imageUrls, width]);

  if (imageUrls.length === 0) return null;
  if (imageUrls.length === 1)
    return (
      <Image
        source={{ uri: imageUrls[0] }}
        alt="Post image content"
        width={width}
        height={height}
      />
    );

  return (
    <VStack space={2} width={width}>
      <Carousel
        loop={false}
        data={data}
        width={width}
        height={height}
        renderItem={({ index }) => (
          <Image
            source={{ uri: imageUrls[index] }}
            alt="Post image content"
            width={width}
            height={height}
          />
        )}
        onProgressChange={(_, absoluteProgress) =>
          setFocusedIndex(Math.round(absoluteProgress))
        }
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

export default ImageCarousel;
