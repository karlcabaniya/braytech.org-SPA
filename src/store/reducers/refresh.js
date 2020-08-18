export default function reducer(
  state = {
    loading: false,
    stale: false,
  },
  action
) {
  if (action.type === 'REFRESH_STATE') {
    return {
      ...state,
      ...action.payload,
    };
  } else {
    return state;
  }
}
