export type ParamList = {
  UserProfile: {
    userDocRefId: string;
  };
  Sends: undefined;
  Follows: {
    userDocRefId: string;
  };
  MyProfile: undefined;
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
