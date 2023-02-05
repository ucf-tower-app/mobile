export type ParamList = {
  Profile: {
    userDocRefId?: string;
  };
  Sends: undefined;
  Follows: {
    userDocRefId: string;
  };
  RouteView: {
    routeDocRefId: string;
  };
  CreatePost: {
    routeName?: string;
  };
  Comments: {
    postDocRefId: string;
  };
};
