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
    suppressVaultWarnings: false
  },
  maps: {
    debug: false,
    noScreenshotHighlight: false,
    logDetails: false,
    checklists: {
      2137293116: true,
      530600409: true,
      1697465175: true,
      3142056444: true,
      4178338182: true,
      2360931290: true,
      365218222: true,
      2955980198: true,
      2609997025: true,
      1297424116: true,
      2726513366: true,
      1912364094: true,
      1420597821: true,
      3305936921: true,
      655926402: true,
      4285512244: true,
      2474271317: true
    }
  },
  developer: {
    lists: false,
  }
};
const history = merge({...initial}, ls.get('settings'));

export default function reducer(state = history, action) {
  switch (action.type) {
    case 'SET_SETTING':

      const adjusted = merge({...state}, action.payload);
      
      ls.set('settings', adjusted);

      return adjusted;
    default:
      return state;
  }
}
