// Route metadata for the likes tab
import { Name } from './names';
import Leaderboards from '../../../screens/leaderboards/Leaderboards';
import AllTimeLeaderboard from '../../../screens/leaderboards/AllTimeLeaderboard';
import MonthlyLeaderboard from '../../../screens/leaderboards/MonthlyLeaderboard';
import FriendsLeaderboard from '../../../screens/leaderboards/FriendsLeaderboard';
import LeaderboardUserProfile from '../../../screens/leaderboards/LeaderboardUserProfile';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Array<Route> = [
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
