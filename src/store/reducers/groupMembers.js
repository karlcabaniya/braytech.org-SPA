const defaultState = {
  loading: false,
  error: false,
  groupId: false,
  members: [],
  pending: [],
  online: 0,
  lastUpdated: 0
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'GROUP_MEMBERS_LOADING':
      return {
        ...state,
        loading: true
      };
    case 'GROUP_MEMBERS_ERROR':
      return {
        ...state,
        error: true,
        loading: false,
        lastUpdated: new Date().getTime()
      };
    case 'GROUP_MEMBERS_LOADED':
      return {
        ...state,
        ...action.payload,
        loading: false
      };
    default:
      return state;
  }
}
