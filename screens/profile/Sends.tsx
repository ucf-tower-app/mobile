import {
  Center,
  Divider,
  FlatList,
  Icon,
  Spinner,
  Text,
  useColorModeValue,
  VStack,
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { TabGlobalScreenProps } from '../../utils/types';
import { constructPageData, getIQParams_UserSends } from '../../xplat/queries';
import { Send as SendObj } from '../../xplat/types';
import Send from '../../components/media/Send';
import { SendSkeleton } from '../../components/media/Send';

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

const Sends = ({ route }: TabGlobalScreenProps<'Sends'>) => {
  const userDocRefId = route.params.userDocRefId;
  const [sends, setSends] = useState<SendObj[]>([]);
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const [displayName, setDisplayName] = useState<string>();
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
    const getDisplayName = async () => {
      if (sends.length !== 0) {
        setDisplayName(await sends[0].user?.getDisplayName());
      }
    };
    getDisplayName();
  }, [sends]);

  const loadNextSends = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderSpinner = () => {
    if (isFetchingNextPage) return <Spinner size="lg" />;
    else return null;
  };

  if (isLoading || displayName === undefined) return <LoadingSends />;

  const renderEmptyList = () => {
    return (
      <Center w="full" mt="1/2">
        <VStack>
          <Center>
            <Icon as={<Ionicons name="trending-up" />} size="6xl" />
          </Center>
          <Text fontSize="lg">No sends.</Text>
        </VStack>
      </Center>
    );
  };

  const headerComponent = () => {
    if (sends.length !== 0) {
      return (
        <Center>
          <Text fontSize="2xl">{displayName} Sends</Text>
          <Divider />
        </Center>
      );
    }
    return null;
  };

  return (
    <FlatList
      bgColor={baseBgColor}
      data={sends}
      ListHeaderComponent={headerComponent}
      ListEmptyComponent={renderEmptyList}
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
