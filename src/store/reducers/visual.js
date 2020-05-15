import * as ls from '../../utils/localStorage';

const userState = ls.get('setting.three') ? ls.get('setting.visual') : {};
const defaultState = {
  passiveAnimations: true,
  three: false,
  threeDebug: false,
  threeShadows: false,
  ...userState,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'SET_VISUAL':
      state = {
        ...state,
        ...action.payload,
      };

      ls.set('setting.visual', state);

      return state;
    default:
      return state;
  }
}
