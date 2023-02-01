// Route metadata for tab-global routes
import Follows from '../../../screens/profile/Follows';
import MyProfile from '../../../screens/profile/MyProfile';
import Sends from '../../../screens/profile/Sends';
import UserProfile from '../../../screens/profile/UserProfile';
import RouteView from '../../../screens/route/RouteView';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'UserProfile',
    component: UserProfile,
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
    name: 'MyProfile',
    component: MyProfile,
  },
  {
    name: 'RouteView',
    component: RouteView,
  },
];
