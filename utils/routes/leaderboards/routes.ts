// Route metadata for the likes tab
import AllTimeLeaderboard from '../../../screens/leaderboards/AllTimeLeaderboard';
import FriendsLeaderboard from '../../../screens/leaderboards/FriendsLeaderboard';
import Leaderboards from '../../../screens/leaderboards/Leaderboards';
import LeaderboardUserProfile from '../../../screens/leaderboards/LeaderboardUserProfile';
import MonthlyLeaderboard from '../../../screens/leaderboards/MonthlyLeaderboard';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'Leaderboards',
    component: Leaderboards,
  },
  {
    name: 'AllTimeLeaderboard',
    component: AllTimeLeaderboard,
  },
  {
    name: 'MonthlyLeaderboard',
    component: MonthlyLeaderboard,
  },
  {
    name: 'FriendsLeaderboard',
    component: FriendsLeaderboard,
  },
  {
    name: 'LeaderboardUserProfile',
    component: LeaderboardUserProfile,
  },
];
