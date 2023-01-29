import { TabGlobalNavigationProp } from './types';

/**
 * Navigates the current Screen navigator to the target profile,
 * rendering MyProfile if it is their own
 */
export const navigateToUserProfile = async (
  signedInUsername: string,
  targetProfileUsername: string,
  navigation: TabGlobalNavigationProp
) => {
  if (signedInUsername === targetProfileUsername) {
    navigation.push('MyProfile');
  } else {
    navigation.push('UserProfile', { username: targetProfileUsername });
  }
};
