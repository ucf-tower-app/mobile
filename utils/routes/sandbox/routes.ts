// Route metadata for the sandbox tab
import { Name } from './names';
import Sandbox from '../../../pages/sandbox/Sandbox';
import Avatar from '../../../components/user/Avatar';

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
    name: 'Avatar',
    component: Avatar,
  },
];
