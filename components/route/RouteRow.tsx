import {
  ArrowForwardIcon,
  Center,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base';
import { useEffect, useState } from 'react';
import { Route } from '../../xplat/types/route';

type Props = {
  route: Route;
};
const RouteRow = ({ route }: Props) => {
  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(
    undefined
  );
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  // Fetch all relevant data and update the state accordingly.
  useEffect(() => {
    const fetchData = async () => {
      await route.getData();

      route.getName().then(setName);
      route.getRating().then((rating) => {
        let descriptionBuilder = rating;
        route.getTags().then(async (tags) => {
          for (const tag of tags) {
            const tagName = await tag.getName();
            descriptionBuilder = descriptionBuilder + ', ' + tagName;
          }
          setDescription(descriptionBuilder);
        });
      });

      setThumbnailUrl('https://wallpaperaccess.com/full/317501.jpg');
    };

    fetchData();
  }, [route]);

  return (
    <HStack h={20} pl={2} backgroundColor={baseBgColor}>
      <Center w="20%">
        <Image
          size={16}
          borderRadius={5}
          source={{ uri: thumbnailUrl }}
          alt={name}
        />
      </Center>
      <Center w="65%">
        <VStack w="full" h="full" pl={2} pt={2}>
          <Text fontSize="xl" fontWeight="bold">
            {name}
          </Text>
          <Text fontSize="lg" color="grey">
            {description}
          </Text>
        </VStack>
      </Center>
      <Center w="15%">
        <ArrowForwardIcon size="5" />
      </Center>
    </HStack>
  );
};

export default RouteRow;
