import { Button, Center, Divider, HStack } from 'native-base';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useRecoilValue } from 'recoil';
import Leaderboard from '../../components/leaderboard/Leaderboard';
import { userAtom } from '../../utils/atoms';
import {
  LeaderboardEntry,
  getRQParams_MonthlyLeaderboard,
  getRQParams_SemesterLeaderboard,
} from '../../xplat/queries/leaderboard';
import { containsRef } from '../../xplat/types';

type LeaderboardTab = 'Monthly' | 'Semesterly';
type FilterType = 'Anyone' | 'Following';

const Leaderboards = () => {
  const signedInUser = useRecoilValue(userAtom);
  const [data, setData] = useState<LeaderboardEntry[]>([]);
  const [tabViewed, setTabViewed] = useState<LeaderboardTab>('Monthly');
  const [filter, setFilter] = useState<FilterType>('Anyone');
  const monthlyRQResult = useQuery(getRQParams_MonthlyLeaderboard(new Date()));
  const semesterRQResult = useQuery(
    getRQParams_SemesterLeaderboard(new Date())
  );
  const curUserRQResult = useQuery(
    [signedInUser?.getId()],
    signedInUser!.buildFetcher(),
    { enabled: signedInUser !== undefined }
  );

  useEffect(() => {
    var newData =
      tabViewed === 'Monthly'
        ? monthlyRQResult.data ?? []
        : semesterRQResult.data ?? [];
    if (filter === 'Following' && curUserRQResult.data !== undefined) {
      newData = newData.filter(
        (entry) =>
          entry.user.getId() === signedInUser?.getId() ||
          containsRef(curUserRQResult.data.followingList, entry.user)
      );
    }
    newData.sort((a, b) =>
      a.points === b.points ? b.sends - a.sends : b.points - a.points
    );
    setData(newData);
  }, [
    curUserRQResult.data,
    filter,
    monthlyRQResult.data,
    semesterRQResult.data,
    signedInUser,
    tabViewed,
  ]);

  return (
    <Center>
      <HStack space="1" p={1} mt={1}>
        <Button
          onPress={() => setTabViewed('Monthly')}
          variant={tabViewed === 'Monthly' ? 'solid' : 'outline'}
          rounded="full"
        >
          Monthly
        </Button>
        <Button
          onPress={() => setTabViewed('Semesterly')}
          variant={tabViewed === 'Semesterly' ? 'solid' : 'outline'}
          rounded="full"
        >
          Semesterly
        </Button>
        <Divider orientation="vertical" />
        <Button
          onPress={() => setFilter('Anyone')}
          variant={filter === 'Anyone' ? 'solid' : 'outline'}
          rounded="full"
        >
          Anyone
        </Button>
        <Button
          onPress={() => setFilter('Following')}
          variant={filter === 'Following' ? 'solid' : 'outline'}
          rounded="full"
        >
          Following
        </Button>
      </HStack>
      <Leaderboard data={data} />
    </Center>
  );
};

export default Leaderboards;
