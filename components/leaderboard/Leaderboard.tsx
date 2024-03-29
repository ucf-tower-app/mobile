import { Box, Divider, FlatList } from 'native-base';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
import { useSignedInUserQuery } from '../../utils/hooks';
import { LeaderboardEntry } from '../../xplat/queries';
import LeaderboardRanking from './LeaderboardRanking';
import LeaderboardRow from './LeaderboardRow';

/**
 * A list of leaderboard rankings with the signed in user's big card at the top
 */
type Props = {
  data: LeaderboardEntry[];
};
const Leaderboard = ({ data }: Props) => {
  const signedInUser = useRecoilValue(userAtom);
  const userQuery = useSignedInUserQuery();
  const [topComponent, setTopComponent] = useState<JSX.Element>(<></>);

  useEffect(() => {
    if (userQuery.data) {
      const idx = data.findIndex(
        (entry) => entry.user.getId() === signedInUser?.getId()
      );
      setTopComponent(
        <Box margin={2}>
          <LeaderboardRanking
            ranking={idx !== -1 ? idx + 1 : undefined}
            fetchedUser={userQuery.data}
            numOfSends={idx !== -1 ? data[idx].sends : undefined}
          />
        </Box>
      );
    }
  }, [userQuery.data, data, signedInUser]);

  return (
    <FlatList
      data={data}
      ListHeaderComponent={topComponent}
      renderItem={({ item, index }) => (
        <Box py={4}>
          <LeaderboardRow data={item} ranking={index + 1} />
        </Box>
      )}
      ItemSeparatorComponent={Divider}
      keyExtractor={(item) => item.user.getId()}
    />
  );
};

export default Leaderboard;
