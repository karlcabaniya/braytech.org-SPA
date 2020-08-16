import store from '../store';
import { PostGameCarnageReport } from './bungie';

export async function getReport(instanceId) {
  // store.dispatch({ type: 'REPORTS_STATE', payload: true });

  try {
    const response = await PostGameCarnageReport(instanceId);

    if (response?.ErrorCode === 1) {
      store.dispatch({ type: 'REPORTS_STORE', payload: response.Response });
    } else {
      throw new Error(response);
    }
  } catch (e) {
    console.warn(`PGCR ${instanceId}`, e);
  }

  return true;
}
