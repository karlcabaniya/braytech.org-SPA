import { createStore, combineReducers } from 'redux';

import viewport from './reducers/viewport.js';
import theme from './reducers/theme.js';
import tips from './reducers/tips.js';
import auth from './reducers/auth.js';
import member from './reducers/member.js';
import refresh from './reducers/refresh.js';
import groupMembers from './reducers/groupMembers.js';
import reports from './reducers/reports.js';
import notifications from './reducers/notifications.js';
import tooltips from './reducers/tooltips.js';
import triumphs from './reducers/triumphs.js';
import layouts from './reducers/layouts.js';
import lists from './reducers/lists.js';
import settings from './reducers/settings.js';

const rootReducer = combineReducers({
  settings,
  auth,
  member,
  theme,
  viewport,
  notifications,
  tooltips,
  refresh,
  groupMembers,
  reports,
  tips,
  triumphs,
  layouts,
  lists,
});

const store = createStore(
  rootReducer,
  // window.__REDUX_DEVTOOLS_EXTENSION__ &&
  //   window.__REDUX_DEVTOOLS_EXTENSION__({
  //     //actionsBlacklist: ['PGCR_LOADED', 'PGCR_LOADING'],
  //     trace: true
  //   })
);

export default store;
