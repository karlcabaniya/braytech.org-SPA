import ls from '../../utils/localStorage';
import staticNotifications from '../../data/notifications';

const history = ls.get('history.notifications') || [];
const timeAtInit = new Date().getTime();

function defaultState() {
  return {
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
        .filter((notification) => (notification.showOnce ? !history.includes(notification.hash) : true)) || [],
    trash: history || [],
  };
}

export default function reducer(state = defaultState(), action) {
  if (action.type === 'NOTIFICATIONS_PUSH') {
    // assign a hash if there is none
    if (!action.payload.hash) {
      action.payload.hash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    // check for duplicates
    if (state.trash.includes(action.payload.hash) || state.objects.find((n) => n.hash === action.payload.hash)) {
      return state;
    }

    return {
      ...state,
      objects: [...state.objects, action.payload],
    };
  } else if (action.type === 'NOTIFICATIONS_POP') {
    const trash = [...state.trash];

    // only push to trash if showOnce === true
    if (state.objects.find((n) => n.hash === action.payload)?.showOnce) {
      trash.push(action.payload);

      // save trash to disk
      ls.set('history.notifications', trash);
    }

    return {
      ...state,
      objects: state.objects.filter((n) => n.hash !== action.payload),
      trash,
    };
  } else if (action.type === 'NOTIFICATIONS_RESET') {
    // fresh
    ls.set('history.notifications', []);

    return defaultState();
  } else {
    return state;
  }
}
