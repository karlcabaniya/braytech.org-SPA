export default function reducer(
  state = {
    bindTime: new Date().getTime(),
  },
  action
) {
  switch (action.type) {
    case 'REBIND_TOOLTIPS':
      return {
        ...state,
        bindTime: action.payload,
      };
    default:
      return state;
  }
}
