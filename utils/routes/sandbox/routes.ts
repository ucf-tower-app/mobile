// Route metadata for the sandbox tab
import { Name } from './names';
import Sandbox from '../../../screens/sandbox/Sandbox';
import RouteRowWrapper from '../../../screens/sandbox/RouteRowWrapper';
import ProfileBannerWrapper from '../../../screens/sandbox/ProfileBannerWrapper';
import StatBoxWrapper from '../../../screens/sandbox/StatBoxWrapper';

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
  /*
  {
    name: 'LostAndFoundCard',
    component: LostAndFoundCard,
  },
  */
];
