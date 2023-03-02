import { Box, HStack, Text, VStack, useColorModeValue } from 'native-base';
import { useSignedInUserQuery } from '../../utils/hooks';
import UserTag from './UserTag';

type Props = {
  userDocRefId: string;
};
const UserRow = ({ userDocRefId }: Props) => {
  const userQuery = useSignedInUserQuery();

  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  return (
    <HStack
      alignItems="center"
      justifyContent={'space-between'}
      bg={baseBgColor}
    >
      <Box ml={2} minWidth={'60%'}>
        <UserTag userDocRefId={userDocRefId} size="lg" />
      </Box>
      {userQuery.data !== undefined && (
        <VStack justifyItems={'center'}>
          <Text>
            {userQuery.data.followersList.some(
              (user) => user.getId() === userDocRefId
            )
              ? 'Follows You'
              : ' '}
          </Text>
          <Text>
            {userQuery.data.followingList.some(
              (user) => user.getId() === userDocRefId
            )
              ? 'Following'
              : ' '}
          </Text>
        </VStack>
      )}

      <VStack />
    </HStack>
  );
};

export default UserRow;
