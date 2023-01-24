import {
  HStack,
  Skeleton,
  Center,
  VStack,
  useColorModeValue,
} from 'native-base';

const LoadingProfile = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <Center w="full" bg={baseBgColor}>
      <VStack w="90%" space="4" pt="7">
        <Center>
          <Skeleton size="20" rounded="full" />
        </Center>
        <Skeleton.Text lines={2} alignItems="center" px="12" />
        <Center>
          <HStack space="4">
            <Skeleton size="7" rounded="full" />
            <Skeleton size="7" rounded="full" />
            <Skeleton size="7" rounded="full" />
          </HStack>
        </Center>
        <VStack w="full" alignItems="flex-start">
          <Skeleton.Text p={2} lines={2} />
          <Skeleton w="full" pt={2} h={40} />
        </VStack>
        <VStack w="full" alignItems="flex-start">
          <Skeleton.Text p={2} lines={2} />
          <Skeleton w="full" pt={2} h={40} />
        </VStack>
      </VStack>
    </Center>
  );
};

export default LoadingProfile;
