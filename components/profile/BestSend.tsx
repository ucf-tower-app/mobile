import { useNavigation } from '@react-navigation/native';
import { useArchivedSet } from '../../utils/queries';
import { getBestSendByType } from '../../xplat/api';
import { FetchedUser, RouteType } from '../../xplat/types';
import StatBox from './StatBox';

type Props = {
  type: RouteType.Toprope | RouteType.Boulder;
  fetchedUser: FetchedUser;
};
const BestSend = ({ type, fetchedUser }: Props) => {
  const navigation = useNavigation();
  const archivedRoutes = useArchivedSet();

  const navigate = async () => {
    if (archivedRoutes.data === undefined) return;
    try {
      const send = await getBestSendByType(fetchedUser.userObject, type).then(
        (res) => res.fetch()
      );

      const screen = archivedRoutes.data.has(send.routeName)
        ? 'SearchTab'
        : 'ActiveRoutesTab';

      navigation.navigate('Tabs', {
        screen,
        params: {
          screen: 'Route View',
          params: {
            routeDocRefId: send.route.getId(),
          },
          initial: false,
        },
      });
    } catch (error: any) {
      console.error(error);
    }
  };

  const value =
    type === RouteType.Toprope
      ? fetchedUser.bestToprope !== undefined
        ? fetchedUser.bestToprope.displayString
        : 'None'
      : fetchedUser.bestBoulder !== undefined
      ? fetchedUser.bestBoulder.displayString
      : 'None';

  return <StatBox stat={type} value={value} onPress={navigate} />;
};

export default BestSend;
