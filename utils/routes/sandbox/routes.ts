// Route metadata for the sandbox tab
import { Name } from './names';
import Sandbox from '../../../screens/sandbox/Sandbox';
import RouteRowWrapper from '../../../screens/sandbox/RouteRowWrapper';
import ProfileBannerWrapper from '../../../screens/sandbox/ProfileBannerWrapper';
import StatBoxWrapper from '../../../screens/sandbox/StatBoxWrapper';
import LostAndFoundCardWrapper from '../../../screens/sandbox/LostAndFoundCardWrapper';
import SearchBarWrapper from '../../../screens/sandbox/SearchBarWrapper';
import LeaderboardCardWrapper from '../../../screens/sandbox/LeaderboardCardWrapper';
import UserRowWrapper from '../../../screens/sandbox/UserRowWrapper';
import LeaderboardRankingWrapper from '../../../screens/sandbox/LeaderboardRankingWrapper';
import UserTagWrapper from '../../../screens/sandbox/UserTagWrapper';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Array<Route> = [
  {
    name: 'Sandbox',
    component: Sandbox,
  },
  {
    name: 'RouteRow',
    component: RouteRowWrapper,
  },
  {
    name: 'ProfileBanner',
    component: ProfileBannerWrapper,
  },
  {
    name: 'StatBox',
    component: StatBoxWrapper,
  },
  {
    name: 'LostAndFoundCard',
    component: LostAndFoundCardWrapper,
  },
  {
    name: 'SearchBar',
    component: SearchBarWrapper,
  },
  {
    name: 'LeaderboardCard',
    component: LeaderboardCardWrapper,
  },
  {
    name: 'UserRow',
    component: UserRowWrapper,
  },
  {
    name: 'LeaderboardRanking',
    component: LeaderboardRankingWrapper,
  },
  {
    name: 'UserTag',
    component: UserTagWrapper,
  },
];
