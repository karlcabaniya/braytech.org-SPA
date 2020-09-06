import { merge } from 'lodash';

import ls from '../../utils/localStorage';

const initial = {
  visual: {
    passiveAnimations: true,
    three: false,
    threeDebug: false,
    threeShadows: false,
    gay: false,
  },
  itemVisibility: {
    hideCompletedRecords: false,
    hideCompletedChecklistItems: false,
    hideCompletedCollectibles: false,
    hideInvisibleRecords: true,
    hideInvisibleCollectibles: true,
    hideDudRecords: true,
    hideUnobtainableRecords: true,
    suppressVaultWarnings: false,
  },
  maps: {
    debug: false,
    noScreenshotHighlight: false,
    logDetails: false,
    checklists: {
      1697465175: true, // Region Chests
      3142056444: true, // Lost Sectors
      4178338182: true, // Adventures
      2360931290: true, // Ghost Scans
      365218222: true, // Sleeper Nodes
      2955980198: true, // Latent Memory Fragments
      2609997025: true, // Corrupted Eggs
      1297424116: true, // Ahamkara Bones
      2726513366: true, // Cat Statues
      1912364094: true, // Jade Rabbits
      1420597821: true, // Lore: Ghost Stories
      3305936921: true, // Lore: The Awoken of the Reef
      655926402: true, // Lore: The Forsaken Prince
      4285512244: true, // Lore: Luna's Lost
      2474271317: true, // Lore: Inquisition of the Damned
      2137293116: true, // Savathûn's Eyes
      530600409: true, // Calcified fragments
    },
  },
  developer: {
    lists: false,
  },
  triumphs: {
    tracked: [1549003459, 2398356743, 1575460005, 2027886756, 221857936, 3985015094, 50106418, 3232635341, 2748367119, 2417378659, 1485121063, 122129118, 2157758001, 3949040536, 2422246607, 2422246593, 3819920005, 452100546, 2422246601, 2646738884, 1962727403, 3783249575, 1025917306, 2422246600, 2633814448, 3723768609, 2172518965, 3417737709],
  },
};

const defaults = merge({ ...initial }, ls.get('settings'));

function save(payload) {
  ls.set('settings', payload);
}

export default function reducer(state = defaults, action) {
  // accepts shapes
  if (action.type === 'SETTINGS_SET') {
    const settings = merge({ ...state }, action.payload);

    save(settings);

    return settings;
  }
  // accepts a hash
  else if (action.type === 'SETTINGS_TRIUMPHS_TRACKED_TOGGLE') {
    const settings = {
      ...state,
      triumphs: {
        ...state.triumphs,
        tracked: state.triumphs.tracked.includes(action.payload)
          ? // untrack triumph
            [...state.triumphs.tracked].filter((hash) => action.payload !== hash)
          : // track triumph
            [...state.triumphs.tracked, action.payload],
      },
    };

    save(settings);

    return settings;
  } else if (action.type === 'SETTINGS_TRIUMPHS_TRACKED_RESET') {
    const settings = {
      ...state,
      triumphs: {
        ...state.triumphs,
        tracked: [],
      },
    };

    save(settings);

    return settings;
  } else {
    return state;
  }
}
