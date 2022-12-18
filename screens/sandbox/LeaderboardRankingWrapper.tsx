import LeaderboardRanking from '../../components/leaderboard/LeaderboardRanking';
import { Center, VStack, Box } from 'native-base';

const mockNavigate = () => {
  console.log('Navigate');
};

const LeaderboardRankingWrapper = () => {
  return (
    <VStack>
      <Center>
        <Box w="95%">
          <LeaderboardRanking
            navigate={mockNavigate}
            ranking={1}
            numOfSends={20}
            username="bobby"
            avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
        </Box>
      </Center>
      <Center>
        <Box w="95%">
          <LeaderboardRanking
            navigate={mockNavigate}
            ranking={2}
            numOfSends={20}
            username="bobby"
            avatarUrl="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
          />
        </Box>
      </Center>
    </VStack>
  );
};

export default LeaderboardRankingWrapper;
