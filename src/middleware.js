import { actionTypes, isPollingAction } from './actions';
import * as logic from './logic';

export default store => next => (action) => {
    if (!isPollingAction(action)) {
        return next(action);
    }

    switch (action.type) {
        case actionTypes.start: return logic.start(store, action, next);
        case actionTypes.stop: return logic.stop(store, action, next);
        case actionTypes.reset: return logic.reset(store, action, next);
        case actionTypes.request: return logic.request(store, action, next);
        case actionTypes.addEntries: return logic.addEntries(store, action, next);
        default: return false;
    }
};
