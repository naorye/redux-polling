import { actionTypes, createAction } from './actions';
import { getPollingState } from './reducer';

export function start({ getState, dispatch }, action, next) {
    const state = getState();
    const { pollingName } = action.meta;
    const { isActive } = getPollingState(state, pollingName);

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
    const { pollingName } = action.meta;
    const { isActive, requestPayload } = getPollingState(state, pollingName);

    if (!isActive) {
        return false;
    }

    const { callbacks, pollingInterval } = action.meta;
    return Promise.resolve(callbacks.polling(...requestPayload, getState))
        .then(
            (value) => {
                const addEntryAction = createAction(actionTypes.addEntry, action.meta, value);
                dispatch(addEntryAction);
            },
            err => err, // If exception during polling - do nothing
        )
        .then(() => {
            setTimeout(() => {
                const requestAction = createAction(actionTypes.request, action.meta);
                dispatch(requestAction);
            }, pollingInterval);
        });
}

export function addEntry({ getState }, action, next) {
    const { callbacks } = action.meta;
    const value = action.payload;

    let shouldAddEntry = true;
    if (typeof callbacks.shouldAddEntry === 'function') {
        shouldAddEntry = callbacks.shouldAddEntry(getState, value);
    }

    if (shouldAddEntry) {
        next(action);
    }

    return shouldAddEntry;
}
