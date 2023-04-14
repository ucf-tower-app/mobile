import {
  Center,
  Divider,
  FlatList,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { TabGlobalScreenProps } from '../../utils/types';
import { constructPageData, getIQParams_UserSends } from '../../xplat/queries';
import { Send as SendObj } from '../../xplat/types';
import Send from '../../components/media/Send';
import { SendSkeleton } from '../../components/media/Send';
import LightDarkIcon from '../../components/util/LightDarkIcon';
import { useNavigation } from '@react-navigation/native';

const LoadingSends = () => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <Center w="full" bg={baseBgColor}>
      <VStack space="4" pt="7">
        <SendSkeleton />
        <SendSkeleton />
        <SendSkeleton />
        <SendSkeleton />
        <SendSkeleton />
        <SendSkeleton />
        <SendSkeleton />
        <SendSkeleton />
        <SendSkeleton />
      </VStack>
    </Center>
  );
};

const EmptyList = () => {
  return (
    <Center w="full" mt="1/2">
      <VStack>
        <Center>
          <LightDarkIcon name="trending-up" size="6xl" />
        </Center>
        <Text fontSize="lg">No sends.</Text>
      </VStack>
    </Center>
  );
};

const Sends = ({ route }: TabGlobalScreenProps<'Sends'>) => {
  const navigation = useNavigation();

  const userDocRefId = route.params.userDocRefId;
  const [sends, setSends] = useState<SendObj[]>([]);
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(getIQParams_UserSends(userDocRefId));

  useEffect(() => {
    if (data) {
      setSends(data.pages.flatMap((page) => constructPageData(SendObj, page)));
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (sends.length > 0)
      sends[0].user?.getUsername().then((name) =>
        navigation.setOptions({
          headerTitle: name + "'s Sends",
        })
      );
  }, [sends, navigation]);

  const loadNextSends = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderSpinner = () => {
    if (isFetchingNextPage) return <Spinner size="lg" />;
    else return null;
  };

  if (isLoading) return <LoadingSends />;

  return (
    <FlatList
      bgColor={baseBgColor}
      data={sends}
      ListEmptyComponent={EmptyList}
      onEndReachedThreshold={0.01}
      onEndReached={() => loadNextSends()}
      ItemSeparatorComponent={Divider}
      scrollEventThrottle={1000}
      renderItem={({ item }) => <Send send={item} />}
      keyExtractor={(item) => item.getId()}
      ListFooterComponent={renderSpinner}
    />
  );
};

export default Sends;
