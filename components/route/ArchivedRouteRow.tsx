import { useNavigation } from '@react-navigation/native';
import {
  ArrowForwardIcon,
  Box,
  HStack,
  Pressable,
  Text,
  VStack,
  useColorModeValue,
  useToast,
} from 'native-base';
import { useGenericErrorToast } from '../../utils/hooks';
import { TabGlobalNavigationProp } from '../../utils/types';
import { GetRouteByNameError, getRouteByName } from '../../xplat/api';
import Tintable from '../util/Tintable';

type Props = {
  title: string;
};
const ArchivedRouteRow = ({ title }: Props) => {
  const navigation = useNavigation<TabGlobalNavigationProp>();
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const toast = useToast();
  const genericToast = useGenericErrorToast();

  return (
    <Pressable
      onPress={async () => {
        try {
          const route = await getRouteByName(title);
          const id = route?.getId();
          if (id)
            navigation.push('RouteView', {
              routeDocRefId: id,
            });
        } catch (error: any) {
          var msg: string | undefined;
          if (error === GetRouteByNameError.NoSuchRoute) msg = error;
          else console.error(error);

          if (msg !== undefined)
            toast.show({
              description: msg,
              placement: 'top',
            });
          else genericToast();
        }
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
