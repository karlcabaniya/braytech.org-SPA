import * as entities from 'entities';

export const profileScrubber = (profile, sortBy = false) => {
  // convert character response to an array
  if (sortBy === 'activity') {
    profile.characters.data = Object.values(profile.characters.data).sort(function (a, b) {
      return new Date(b.dateLastPlayed).getTime() - new Date(a.dateLastPlayed).getTime();
    });
  } else {
    profile.characters.data = Object.values(profile.characters.data).sort(function (a, b) {
      return parseInt(b.minutesPlayedTotal) - parseInt(a.minutesPlayedTotal);
    });
  }

  // remove dud ghost scans
  if (profile.profileProgression) {
    delete profile.profileProgression.data.checklists[2360931290][1116662180];
    delete profile.profileProgression.data.checklists[2360931290][3856710545];
    delete profile.profileProgression.data.checklists[2360931290][508025838];
  }

  return profile;
};

export const groupScrubber = (data) => {
  if (data.results && data.results.length) {
    data.results[0].group.clanInfo.clanCallsign = entities.decodeHTML(data.results[0].group.clanInfo.clanCallsign);
    data.results[0].group.motto = entities.decodeHTML(data.results[0].group.motto);
    data.results[0].group.name = entities.decodeHTML(data.results[0].group.name);
  } else if (data.detail) {
    data.detail.clanInfo.clanCallsign = entities.decodeHTML(data.detail.clanInfo.clanCallsign);
    data.detail.motto = entities.decodeHTML(data.detail.motto);
    data.detail.name = entities.decodeHTML(data.detail.name);
  }

  return data;
};
