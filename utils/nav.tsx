import { TabGlobalNavigationProp } from './types';

/**
 * Navigates the current Screen navigator to the target profile.
 */
export const navigateToUserProfile = async (
  signedInUserId: string,
  targetProfileId: string,
  navigation: TabGlobalNavigationProp
) => {
  if (signedInUserId === targetProfileId) {
    navigation.push('Profile', {});
  } else {
    navigation.push('Profile', {
      userDocRefId: targetProfileId,
    });
  }
};
