import { useNavigation } from '@react-navigation/native';
import {
  ArrowForwardIcon,
  HStack,
  Image,
  Pressable,
  Skeleton,
  Text,
  VStack,
  useColorModeValue,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { TabGlobalNavigationProp } from '../../utils/types';
import { Route } from '../../xplat/types';

type Props = {
  route: Route;
};
const RouteRow = ({ route }: Props) => {
  const navigation = useNavigation<TabGlobalNavigationProp>();

  const [descriptors, setDescriptors] = useState<string>('');

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const { isLoading, isError, data, error } = useQuery(
    route.getId(),
    route.buildFetcher()
  );

  // Fetch all relevant data and update the state accordingly.
  useEffect(() => {
    if (data === undefined) return;
    let newDescriptors = data.gradeDisplayString;
    if (data.stringifiedTags !== '')
      newDescriptors += ', ' + data.stringifiedTags;
    setDescriptors(newDescriptors);
  }, [data]);

  if (isLoading) {
    return (
      <HStack
        p={2}
        backgroundColor={baseBgColor}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Skeleton size={16} borderRadius={5} />
        <Skeleton.Text pl={2} pt={2} lines={2} />
      </HStack>
    );
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  return (
    <Pressable
      onPress={() =>
        navigation.push('Route View', { routeDocRefId: route.getId() })
      }
    >
      <HStack
        p={2}
        backgroundColor={baseBgColor}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Image
          size={16}
          borderRadius={5}
          source={{ uri: data.thumbnailUrl }}
          alt={data.name}
        />
        <VStack pl={2} pt={2} maxW="70%">
          <Text fontSize="xl" fontWeight="bold">
            {data.name}
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
