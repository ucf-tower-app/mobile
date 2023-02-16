import { FlatList, Spacer, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../utils/atoms';
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
  const userQuery = useQuery(
    signedInUser !== undefined ? signedInUser.getId() : 'nullQuery',
    signedInUser === undefined ? () => undefined : signedInUser.buildFetcher(),
    { enabled: signedInUser !== undefined }
  );
  const [topComponent, setTopComponent] = useState<JSX.Element>(<></>);

  useEffect(() => {
    if (userQuery.data) {
      const idx = data.findIndex(
        (entry) => entry.user.getId() === signedInUser?.getId()
      );
      console.log(idx);
      setTopComponent(
        <LeaderboardRanking
          ranking={idx !== -1 ? idx + 1 : undefined}
          fetchedUser={userQuery.data}
          numOfSends={idx !== -1 ? data[idx].sends : undefined}
        />
      );
    }
  }, [userQuery.data, data, signedInUser]);

  return (
    <FlatList
      h="full"
      // bgColor={baseBgColor}
      ListHeaderComponent={topComponent}
      data={data}
      // ItemSeparatorComponent={Divider}
      renderItem={({ item, index }) => (
        <VStack pt={4}>
          <LeaderboardRow data={item} ranking={index + 1} />
          {index < data.length - 1 ? <Spacer /> : null}
        </VStack>
      )}
      keyExtractor={(item) => item.user.getId()}
    />
  );
};

export default Leaderboard;
