import { useColorModeValue, Divider, FlatList } from 'native-base';

import { useSignedInUserQuery } from '../../utils/hooks';
import UserRow from '../../components/profile/UserRow';

const renderDivider = () => <Divider mt={2} mb={2} />;

const BlockedList = () => {
  const backgroundColor = useColorModeValue('lightMode.base', 'darkMode.base');
  const signedInUserQuery = useSignedInUserQuery();

  return (
    <FlatList
      bg={backgroundColor}
      data={signedInUserQuery.data?.blockedList}
      ItemSeparatorComponent={renderDivider}
      renderItem={({ item }) => <UserRow userDocRefId={item.getId()} />}
      keyExtractor={(item) => item.getId()}
    />
  );
};

export default BlockedList;
