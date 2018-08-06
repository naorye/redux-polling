import { reduxPollingNamespace, reduxPollingReducer } from 'dist'; /* eslint-disable-line import/no-unresolved */
import { combineReducers } from 'redux';

export default combineReducers({
    [reduxPollingNamespace]: reduxPollingReducer,
});
