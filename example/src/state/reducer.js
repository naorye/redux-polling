import { combineReducers } from 'redux';
import { reduxPollingNamespace, reduxPollingReducer } from 'redux-polling';

export default combineReducers({
    [reduxPollingNamespace]: reduxPollingReducer,
});
