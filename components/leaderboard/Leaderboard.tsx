import {
  Center,
  ScrollView,
  Spacer,
  VStack,
  useColorModeValue,
} from 'native-base';
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
  const curUserRQResult = useQuery(
    [signedInUser?.getId()],
    signedInUser!.buildFetcher(),
    { enabled: signedInUser !== undefined }
  );
  const [topComponent, setTopComponent] = useState<JSX.Element>(<></>);
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

  useEffect(() => {
    if (curUserRQResult.data) {
      const idx = data.findIndex(
        (entry) => entry.user.getId() === signedInUser?.getId()
      );
      setTopComponent(
        <LeaderboardRanking
          ranking={idx + 1}
          fetchedUser={curUserRQResult.data}
          numOfSends={data[idx].sends}
        />
      );
    }
  }, [curUserRQResult.data, data, signedInUser]);

  return (
    <ScrollView w="full" h="full" bg={baseBgColor}>
      <Center w="full">
        {topComponent}
        <VStack w="full">
          {data?.map((entry, index) => {
            return (
              <VStack key={entry.user.getId()} pt={4}>
                <LeaderboardRow data={entry} ranking={index + 1} />
                {index < data.length - 1 ? <Spacer /> : null}
              </VStack>
            );
          })}
        </VStack>
      </Center>
    </ScrollView>
  );
};

export default Leaderboard;