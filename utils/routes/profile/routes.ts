// Route metadata for the profile tab
import Follow from '../../../screens/profile/Follow';
import MyProfile from '../../../screens/profile/MyProfile';
import UserProfile from '../../../screens/profile/UserProfile';
import Sends from '../../../screens/profile/Sends';
import { Name } from './names';

export type Route = {
  name: Name;
  component: any;
};

export const routes: Route[] = [
  {
    name: 'MyProfile',
    component: MyProfile,
  },
  {
    name: 'Sends',
    component: Sends,
  },
  {
    name: 'Follow',
    component: Follow,
  },
  {
    name: 'UserProfile',
    component: UserProfile,
  },
];
