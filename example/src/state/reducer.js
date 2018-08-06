import { reduxPollingNamespace, reduxPollingReducer } from 'redux-polling'; /* eslint-disable-line import/no-unresolved */
import { combineReducers } from 'redux';

export default combineReducers({
    [reduxPollingNamespace]: reduxPollingReducer,
});
