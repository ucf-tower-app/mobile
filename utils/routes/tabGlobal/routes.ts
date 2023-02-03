// Route metadata for tab-global routes
import Follows from '../../../screens/profile/Follows';
import Profile from '../../../screens/profile/Profile';
import Sends from '../../../screens/profile/Sends';
import RouteView from '../../../screens/route/RouteView';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'Profile',
    component: Profile,
  },
  {
    name: 'Sends',
    component: Sends,
  },
  {
    name: 'Follows',
    component: Follows,
  },
  {
    name: 'RouteView',
    component: RouteView,
  },
];
