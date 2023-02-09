import {
  Center,
  Divider,
  ScrollView,
  Spinner,
  useColorModeValue,
  VStack,
} from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { NativeScrollEvent } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import { TabGlobalScreenProps } from '../../utils/types';
import { constructPageData, getIQParams_UserSends } from '../../xplat/queries';
import { Send as SendObj } from '../../xplat/types';
import Send from '../../components/media/Send';

const isCloseToBottom = ({
  layoutMeasurement,
  contentOffset,
  contentSize,
}: NativeScrollEvent) => {
  const paddingToBottom = 20;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

const Sends = ({ route }: TabGlobalScreenProps<'Sends'>) => {
  const userDocRefId = route.params.userDocRefId;
  const [sends, setSends] = useState<SendObj[]>([]);
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(getIQParams_UserSends(userDocRefId));

  useEffect(() => {
    if (data)
      setSends(data.pages.flatMap((page) => constructPageData(SendObj, page)));
  }, [data]);

  const loadNextPosts = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  console.log(sends);
  return (
    <ScrollView
      w="full"
      bg={baseBgColor}
      onScroll={({ nativeEvent }) => {
        if (hasNextPage && isCloseToBottom(nativeEvent)) {
          loadNextPosts();
        }
      }}
      scrollEventThrottle={1000}
    >
      <Center w="full">
        <VStack w="full">
          {sends?.map((send, index) => {
            return (
              <VStack key={send.getId()} pt={4}>
                <Send send={send} />
                {index < sends.length - 1 ? <Divider /> : null}
              </VStack>
            );
          })}
          {hasNextPage ? (
            <Center pt={4}>
              <Spinner size="lg" />
            </Center>
          ) : null}
        </VStack>
      </Center>
    </ScrollView>
  );
};

export default Sends;
