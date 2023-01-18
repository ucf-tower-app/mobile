// Route metadata for the profile tab
import Profile from '../../../screens/profile/Profile';
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
];
