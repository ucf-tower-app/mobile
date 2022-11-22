// Route metadata for the sandbox tab
import { Name } from './names';
import Sandbox from '../../../pages/sandbox/Sandbox';
import RouteRow from '../../../components/route/RouteRow';
import UserRow from '../../../components/profile/UserRow';

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
    component: RouteRow,
  },
  {
    name: 'UserRow',
    component: UserRow,
  },
];

export type PropMap = {
  Sandbox: undefined;

  // Maybe replace this with RouteRef backend object down the line
  RouteRow: {
    thumbnail: string;
    name: string;
    grade: string;
    tags: Array<string>;
  };

  UserRow: {
    avatarUrl: string;
    userName: string;
    userHandle: string;
  };
};
