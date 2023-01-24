// Route metadata for the sandbox tab
import LeaderboardCardWrapper from '../../../screens/sandbox/LeaderboardCardWrapper';
import LeaderboardRankingWrapper from '../../../screens/sandbox/LeaderboardRankingWrapper';
import LostAndFoundCardWrapper from '../../../screens/sandbox/LostAndFoundCardWrapper';
import PostWrapper from '../../../screens/sandbox/PostWrapper';
import ProfileBannerWrapper from '../../../screens/sandbox/ProfileBannerWrapper';
import RouteRowWrapper from '../../../screens/sandbox/RouteRowWrapper';
import RouteViewWrapper from '../../../screens/sandbox/RouteViewWrapper';
import Sandbox from '../../../screens/sandbox/Sandbox';
import SearchableRoutesWrapper from '../../../screens/sandbox/SearchableRoutesWrapper';
import SearchBarWrapper from '../../../screens/sandbox/SearchBarWrapper';
import StatBoxWrapper from '../../../screens/sandbox/StatBoxWrapper';
import UserRowWrapper from '../../../screens/sandbox/UserRowWrapper';
import UserTagWrapper from '../../../screens/sandbox/UserTagWrapper';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
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
  {
    name: 'Post',
    component: PostWrapper,
  },
  {
    name: 'SearchableRoutes',
    component: SearchableRoutesWrapper,
  },
  {
    name: 'RouteView',
    component: RouteViewWrapper,
  },
];
