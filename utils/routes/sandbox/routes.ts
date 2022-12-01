// Route metadata for the sandbox tab
import { Name } from './names';
import Sandbox from '../../../screens/sandbox/Sandbox';
import RouteRowWrapper from '../../../screens/sandbox/RouteRowWrapper';

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
  /*
  {
    name: 'ProfileBanner',
    component: ProfileBanner,
  },
  {
    name: 'StatBox',
    component: StatBox,
  },
  {
    name: 'LostAndFoundCard',
    component: LostAndFoundCard,
  },
  */
];
