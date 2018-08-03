import { actionTypes, createAction } from './actions';
import { getPollState } from './reducer';

export function start({ getState, dispatch }, action, next) {
    const state = getState();
    const { pollName } = action.meta;
    const { isActive } = getPollState(state, pollName);

    if (isActive) {
        return false;
    }

    next(action);

    const requestAction = createAction(actionTypes.request, action.meta);
    dispatch(requestAction);

    return true;
}

export function stop(_, action, next) {
    next(action);
    return true;
}

export function request({ getState, dispatch }, action) {
    const state = getState();
    const { pollName } = action.meta;
    const { isActive, requestPayload } = getPollState(state, pollName);

    if (!isActive) {
        return false;
    }

    const { pollLogic, pollInterval } = action.meta;
    return Promise.resolve(pollLogic(...requestPayload))
        .then(
            (value) => {
                const addEntryAction = createAction(actionTypes.addEntry, action.meta, value);
                dispatch(addEntryAction);
            },
            err => err, // If exception during pollLogic - do nothing
        )
        .then(() => {
            setTimeout(() => {
                const requestAction = createAction(actionTypes.request, action.meta);
                dispatch(requestAction);
            }, pollInterval);
        });
}

export function addEntry(_, action, next) {
    next(action);
    return true;
}
