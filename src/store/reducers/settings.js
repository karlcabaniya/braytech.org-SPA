import { merge } from 'lodash';
import * as ls from '../../utils/localStorage';

const history = ls.get('settings') || {
  visual: {
    passiveAnimations: true,
    three: false,
    threeDebug: false,
    threeShadows: false,
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
  },
  developer: {
    lists: false,
  }
};

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
