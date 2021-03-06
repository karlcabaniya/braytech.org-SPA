import ls from './localStorage';
import * as bungie from './bungie';
import * as responseUtils from './responseUtils';
import manifest from './manifest';

export default async function getMember(membershipType, membershipId, silent = false) {
  // https://bungie-net.github.io/multi/schema_Destiny-DestinyComponentType.html

  const components = [
    100, // Profiles
    102, // ProfileInventories
    103, // ProfileCurrencies
    104, // ProfileProgression
    200, // Characters
    201, // CharacterInventories
    202, // CharacterProgressions
    204, // CharacterActivities
    205, // CharacterEquipment
    300, // ItemInstances
    301, // ItemObjectives
    302, // ItemPerks
    303, // ItemRenderData
    304, // ItemStats
    305, // ItemSockets
    306, // ItemTalentGrids
    307, // ItemCommonData
    308, // ItemPlugStates
    309, // ItemPlugObjectives
    310, // ItemReusablePlugs
    700, // PresentationNodes
    800, // Collectibles
    900, // Records
    1100, // Metrics
  ];

  let withAuth = false;

  try {
    const tokens = ls.get('setting.auth');

    if (tokens && tokens.destinyMemberships.find((member) => member.membershipId === membershipId)) {
      if (manifest.settings && !manifest.settings.systems.Authentication.enabled) {
        return;
      }

      withAuth = true;
    }
  } catch (e) {
    console.log(e);
  }

  try {
    const requests = [
      bungie.GetProfile({
        params: {
          membershipType,
          membershipId,
          components: components.join(','),
        },
        withAuth,
        errors: {
          hide: silent,
        },
      }),
      bungie.GetGroupsForMember({
        params: {
          membershipType,
          membershipId,
        },
        errors: {
          hide: silent,
        },
      }),
      bungie.GetPublicMilestones({
        errors: {
          hide: true,
        },
      }),
    ];

    const [profile, groups, milestones] = await Promise.all(requests);

    if (profile?.ErrorCode === 1 && profile.Response?.profileProgression?.data) {
      return {
        profile: {
          ...profile,
          Response: responseUtils.profileScrubber(profile.Response, 'activity'),
        },
        groups: groups?.ErrorCode === 1 && {
          ...groups,
          Response: responseUtils.groupScrubber(groups.Response),
        },
        milestones,
      };
    } else {
      return {
        profile,
        groups,
        milestones,
      };
    }
  } catch (e) {
    console.log(e);

    return false;
  }
}
