import { Divider, FlatList, Spinner, useColorModeValue } from 'native-base';
import { useCallback, useEffect, useState } from 'react';
import { useInfiniteQuery } from 'react-query';
import { TabGlobalScreenProps } from '../../utils/types';
import { constructPageData, getIQParams_UserSends } from '../../xplat/queries';
import { Send as SendObj } from '../../xplat/types';
import Send from '../../components/media/Send';

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

  const loadNextSends = useCallback(async () => {
    if (hasNextPage && !isFetchingNextPage) {
      await fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const renderSpinner = () => {
    if (isFetchingNextPage) return <Spinner size="lg" />;
    else return null;
  };

  return (
    <FlatList
      bgColor={baseBgColor}
      data={sends}
      extraData={sends}
      onEndReached={loadNextSends}
      onEndReachedThreshold={0.8}
      ItemSeparatorComponent={Divider}
      renderItem={({ item }) => <Send send={item} />}
      keyExtractor={(item) => item.getId()}
      ListFooterComponent={renderSpinner}
    />
  );
};

export default Sends;
