import { useNavigation } from '@react-navigation/native';
import {
  ArrowForwardIcon,
  Center,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VStack,
  Pressable,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { focusedRouteAtom } from '../../utils/atoms';
import { Route } from '../../xplat/types/route';

type Props = {
  route: Route;
};
const RouteRow = ({ route }: Props) => {
  const navigation = useNavigation();
  const setFocusedRoute = useSetRecoilState(focusedRouteAtom);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(
    'https://wallpaperaccess.com/full/317501.jpg'
  );
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const navigateToRoute = () => {
    setFocusedRoute(route);
    navigation.navigate('Tabs', {
      screen: 'ActiveRoutesTab',
      params: {
        screen: 'RouteView',
      },
    });
  };

  // Fetch all relevant data and update the state accordingly.
  useEffect(() => {
    const fetchData = async () => {
      await route.getData();

      route.getName().then(setName);
      route.hasThumbnail().then((hasThumbnail) => {
        if (hasThumbnail) {
          route.getThumbnailUrl().then(setThumbnailUrl);
        }
      });
      route.getGradeDisplayString().then((grade) => {
        let descriptionBuilder = grade;
        route.getTags().then(async (tags) => {
          for (const tag of tags) {
            const tagName = await tag.getName();
            descriptionBuilder = descriptionBuilder + ', ' + tagName;
          }
          setDescription(descriptionBuilder);
        });
      });
    };

    fetchData();
  }, [route]);

  return (
    <Pressable onPress={navigateToRoute}>
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
    </Pressable>
  );
};

export default RouteRow;
