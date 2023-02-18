export type ParamList = {
  Profile: {
    userDocRefId?: string;
  };
  Sends: {
    userDocRefId: string;
  };
  Follows: {
    userDocRefId: string;
  };
  RouteView: {
    routeDocRefId: string;
  };
  CreatePost: {
    routeDocRefId?: string;
  };
  Comments: {
    postDocRefId: string;
  };
};
