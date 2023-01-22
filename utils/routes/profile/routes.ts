// Route metadata for the profile tab
import Followers from '../../../screens/profile/Followers';
import ProfileWrapper from '../../../screens/profile/ProfileWrapper';
import Sends from '../../../screens/profile/Sends';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'Profile',
    component: ProfileWrapper,
  },
  {
    name: 'Sends',
    component: Sends,
  },
  {
    name: 'Followers',
    component: Followers,
  },
];
