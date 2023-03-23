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
  'Route View': {
    routeDocRefId: string;
  };
  'Create Post': {
    routeDocRefId?: string;
  };
  Comments: {
    postDocRefId: string;
  };
};
