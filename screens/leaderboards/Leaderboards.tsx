import { Center, Pressable, VStack } from 'native-base';
import LeaderboardCard from '../../components/leaderboard/LeaderboardCard';
import type { LeaderboardsScreenProps } from '../../utils/types';

const Leaderboards = ({
  navigation,
}: LeaderboardsScreenProps<'Leaderboards'>) => {
  return (
    <Center>
      <VStack space={3}>
        <Pressable onPress={() => navigation.navigate('AllTimeLeaderboard')}>
          <LeaderboardCard
            leaderboardTitle="All Time"
            topNumOfSends={20}
            avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('MonthlyLeaderboard')}>
          <LeaderboardCard
            leaderboardTitle="Monthly"
            topNumOfSends={20}
            avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('FriendsLeaderboard')}>
          <LeaderboardCard
            leaderboardTitle="Friends"
            topNumOfSends={20}
            avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
        </Pressable>
      </VStack>
    </Center>
  );
};

export default Leaderboards;
