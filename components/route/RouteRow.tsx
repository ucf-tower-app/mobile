import { useNavigation } from '@react-navigation/native';
import {
  ArrowForwardIcon,
  Box,
  HStack,
  Pressable,
  Skeleton,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { TabGlobalNavigationProp } from '../../utils/types';
import { Route, RouteColor } from '../../xplat/types';

type Props = {
  route: Route;
};

function getTapeColors(routeColor: RouteColor | undefined) {
  switch (routeColor) {
    case RouteColor.Red:
      return { tint: 'rgba(255,0,0,0.8)', text: 'black' };
    case RouteColor.Pink:
      return { tint: 'rgba(255,148,242,0.8)', text: 'black' };
    case RouteColor.Orange:
      return { tint: 'rgba(255,168,9,0.8)', text: 'black' };
    case RouteColor.Yellow:
      return { tint: 'rgba(255,245,0,1)', text: 'black' };
    case RouteColor.Green:
      return { tint: 'rgba(13,200,0,0.8)', text: 'black' };
    case RouteColor.Blue:
      return { tint: 'rgba(53,69,255,0.8)', text: 'white' };
    case RouteColor.Purple:
      return { tint: 'rgba(202,35,225,0.8)', text: 'white' };
    case RouteColor.Brown:
      return { tint: 'rgba(166,107,0,0.8)', text: 'white' };
    case RouteColor.Grey:
      return { tint: 'rgba(170,170,170,0.8)', text: 'black' };
    default:
      return { tint: 'black', text: 'white' };
  }
}

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
    if (data.rope) newDescriptors += ' on rope ' + data.rope;
    if (data.naturalRules) newDescriptors += ', ' + data.naturalRules;
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

  const tapeTint = getTapeColors(data.color as RouteColor | undefined).tint;

  return (
    <Pressable
      onPress={() =>
        navigation.push('RouteView', { routeDocRefId: route.getId() })
      }
    >
      <HStack
        p={2}
        backgroundColor={baseBgColor}
        justifyContent="flex-start"
        alignItems="center"
      >
        <Box
          height={'17px'}
          style={{ aspectRatio: 1 }}
          bgColor={tapeTint}
          borderRadius={'50%'}
          shadow={4}
        />
        <VStack pl={2} pt={2} width="85%">
          <Text
            ml={2}
            numberOfLines={1}
            width="full"
            fontSize="xl"
            fontWeight="bold"
          >
            {data.name}
          </Text>

          <Text
            pl={5}
            numberOfLines={1}
            width="full"
            fontSize="lg"
            color="gray.700"
          >
            {descriptors}
          </Text>
        </VStack>
        <ArrowForwardIcon size="5" ml="auto" mr={3} />
      </HStack>
    </Pressable>
  );
};

export default RouteRow;
