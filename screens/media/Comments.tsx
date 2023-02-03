import { useQuery } from 'react-query';
import { buildPostFetcherFromDocRefId } from '../../utils/queries';
import { TabGlobalScreenProps } from '../../utils/types';
import { Box, Text, Center, Spinner, VStack } from 'native-base';
import { ScrollView } from 'react-native';
import SearchBar from '../../components/searchbar/SearchBar';

const Comments = ({ route }: TabGlobalScreenProps<'Comments'>) => {
  const postDocRefId = route.params.postDocRefId;

  const { isLoading, isError, data, error } = useQuery(
    postDocRefId,
    buildPostFetcherFromDocRefId(postDocRefId)
  );

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (isError || data === undefined) {
    console.error(error);
    return null;
  }

  return (
    <VStack w="full" h="full">
      <ScrollView>
        <Text> test </Text>
        <Text> test </Text>
        <Text> test </Text>
        <Text> test </Text>
      </ScrollView>
      <Box mt="auto" p={2}>
        <SearchBar />
      </Box>
    </VStack>
  );
};

export default Comments;
