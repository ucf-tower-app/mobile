import { useNavigation } from '@react-navigation/native';
import {
  ArrowForwardIcon,
  HStack,
  Pressable,
  Text,
  VStack,
  useColorModeValue,
  Box,
} from 'native-base';
import { TabGlobalNavigationProp } from '../../utils/types';
import { getRouteByName } from '../../xplat/api';
import Tintable from '../util/Tintable';

type Props = {
  title: string;
};
const ArchivedRouteRow = ({ title }: Props) => {
  const navigation = useNavigation<TabGlobalNavigationProp>();
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <Pressable
      onPress={async () => {
        const route = await getRouteByName(title);
        const id = route?.getId();
        if (id)
          navigation.push('RouteView', {
            routeDocRefId: id,
          });
      }}
    >
      {({ isHovered, isPressed }) => {
        return (
          <Box>
            <Tintable tinted={isHovered || isPressed} />
            <HStack
              p={2}
              backgroundColor={baseBgColor}
              justifyContent="flex-start"
              alignItems="center"
            >
              <VStack pl={2} pt={2} maxW="70%">
                <Text fontSize="xl" fontWeight="bold">
                  {title}
                </Text>
              </VStack>
              <ArrowForwardIcon size="5" ml="auto" mr={3} />
            </HStack>
          </Box>
        );
      }}
    </Pressable>
  );
};

export default ArchivedRouteRow;
