import ls from '../../utils/localStorage';
import staticNotifications from '../../data/notifications';

const history = ls.get('history.notifications') || [];
const timeAtInit = new Date().getTime();

const defaultState = {
  objects:
    staticNotifications
      ?.filter((notification) => {
        const t = new Date(notification.date).getTime();

        if (t < timeAtInit) {
          return true;
        } else {
          return false;
        }
      })
      .filter((notification) => (notification.showOnce ? !history.includes(notification.id) : true)) || [],
  trash: history || [],
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case 'PUSH_NOTIFICATION':
      // console.log(`PUSH_NOTIFICATION`, action, state);

      action.payload.id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      return {
        ...state,
        objects: [...state.objects, action.payload],
      };
    case 'POP_NOTIFICATION':
      // console.log(`POP_NOTIFICATION`, action, state);

      const trash = [...state.trash];

      if (state.objects.find((n) => n.id === action.payload)?.showOnce) {
        trash.push(action.payload);

        ls.set('history.notifications', trash);
      }

      return {
        ...state,
        objects: state.objects.filter((n) => n.id !== action.payload),
        trash,
      };
    default:
      return state;
  }
}
