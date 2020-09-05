const defaults = {
  cache: 'no-cache',
  headers: {
    'Content-Type': 'application/json',
  },
};

// Destiny Tracker
export async function GetElo(options = { params: { mode: 84, membershipId: 0, season: 10 } }) {
  try {
    const request = await fetch(`https://api-insights.destinytracker.com/api/d2/elo/${options.params.mode}/${options.params.membershipId}?season=${options.params.season}`);

    if (request.ok) {
      const response = await request.json();

      return response;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export async function GetDIMCommonSettings() {
  try {
    const request = await fetch('https://api.destinyitemmanager.com/platform_info', defaults);

    if (request.ok) {
      const response = await request.json();

      return response;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

export async function GetDIMPlatformInfo2() {
  try {
    const request = await fetch('https://api.destinyitemmanager.com/platform_info', defaults);

    if (request.ok) {
      const response = await request.json();

      return response;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

