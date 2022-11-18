// Route metadata for the sandbox tab
import { Name } from './names';
import Sandbox from '../../../pages/sandbox/Sandbox';
import RouteRow from '../../../components/route/RouteRow';
import StatBox from '../../../components/route/profile/stats/StatBox';

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
    name: 'StatBox',
    component: StatBox,
  },
];

// Verbose props may be swapped for middleware lazy-objects down the line
export type PropMap = {
  Sandbox: undefined;

  RouteRow: {
    thumbnail: string;
    name: string;
    grade: string;
    tags: Array<string>;
  };

  StatBox: {
    stat: string;
    value: string;
  };
};
