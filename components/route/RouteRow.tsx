import { useNavigation } from '@react-navigation/native';
import {
  ArrowForwardIcon,
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
  const [descriptors, setDescriptors] = useState<string>('');
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
        let descriptorsBuilder = grade;
        route.getTags().then(async (tags) => {
          for (const tag of tags) {
            const tagName = await tag.getName();
            descriptorsBuilder = descriptorsBuilder + ', ' + tagName;
          }
          setDescriptors(descriptorsBuilder);
        });
      });
    };

    fetchData();
  }, [route]);

  return (
    <Pressable onPress={navigateToRoute}>
      <HStack
        p={2}
        backgroundColor={baseBgColor}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Image
          size={16}
          borderRadius={5}
          source={{ uri: thumbnailUrl }}
          alt={name}
        />
        <VStack pl={2} pt={2} maxW="70%">
          <Text fontSize="xl" fontWeight="bold">
            {name}
          </Text>
          <Text fontSize="lg" color="grey">
            {descriptors}
          </Text>
        </VStack>
        <ArrowForwardIcon size="5" ml="auto" mr={3} />
      </HStack>
    </Pressable>
  );
};

export default RouteRow;
