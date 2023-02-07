import {
  Center,
  ScrollView,
  Spacer,
  VStack,
  useColorModeValue,
} from 'native-base';
import { LeaderboardEntry } from '../../xplat/queries';
import LeaderboardRow from './LeaderboardRow';

/**
 * A feed of posts. The posts are pulled in strides of POST_STRIDE from the
 * postsCursor, and the callee can provide an optional component to place on top.
 * New feed items are only loaded when the user is within 20 pixels of the bottom of
 * the screen.
 */
type Props = {
  topComponent?: JSX.Element;
  data: LeaderboardEntry[];
};
const Leaderboard = ({ topComponent, data }: Props) => {
  const baseBgColor = useColorModeValue('lightMode.base', 'darkMode.base');

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
