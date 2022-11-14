import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  ArrowForwardIcon,
  Center,
  HStack,
  Image,
  Text,
  VStack,
} from 'native-base';
import React from 'react';
import { PropMap } from '../../utils/routes/routes';

type Props = NativeStackScreenProps<PropMap, 'RouteRow'>;
const RouteRow = ({ route }: Props) => {
  let description = route.params.grade;
  route.params.tags.forEach((tag) => {
    description = description + ', ' + tag;
  });

  return (
    <HStack h={20} pl={2} my={3} backgroundColor="white">
      <Center w="20%">
        <Image
          size={16}
          borderRadius={5}
          source={{ uri: route.params.thumbnail }}
          alt={route.params.name}
        />
      </Center>
      <Center w="65%">
        <VStack w="full" h="full" pl={2} pt={2}>
          <Text fontSize="xl" fontWeight="bold">
            {route.params.name}
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
