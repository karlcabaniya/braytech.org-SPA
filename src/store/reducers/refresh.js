export default function reducer(
  state = {
    loading: false,
    stale: false,
  },
  action
) {
  switch (action.type) {
    case 'SET_REFRESH_STATE':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}
