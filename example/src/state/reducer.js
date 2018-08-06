import { combineReducers } from 'redux';
import { reduxPollingNamespace, reduxPollingReducer } from 'dist'; /* eslint-disable-line import/no-unresolved */

export default combineReducers({
    [reduxPollingNamespace]: reduxPollingReducer,
});
