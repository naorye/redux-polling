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

    const meta = { ...action.meta, initialPolling: true };
    const requestAction = createAction(actionTypes.request, meta);
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

    const { callbacks, pollingInterval, initialPolling } = action.meta;
    const isInitialPolling = initialPolling === true && typeof callbacks.initialPolling === 'function';
    const pollingFunc = isInitialPolling ? callbacks.initialPolling : callbacks.polling;
    return Promise.resolve(pollingFunc(...requestPayload, getState))
        .then(
            (data) => {
                const entries = isInitialPolling ? data : [ data ];
                const addEntriesAction = createAction(
                    actionTypes.addEntries,
                    action.meta,
                    entries,
                );
                dispatch(addEntriesAction);
            },
            err => err, // If exception during polling - do nothing
        )
        .then(() => {
            setTimeout(() => {
                const meta = { ...action.meta, initialPolling: false };
                const requestAction = createAction(actionTypes.request, meta);
                dispatch(requestAction);
            }, pollingInterval);
        });
}

export function addEntries({ getState }, action, next) {
    const { callbacks: { shouldAddEntry } } = action.meta;
    let entries = action.payload;

    if (!Array.isArray(entries)) {
        throw new Error(`Payload for ${actionTypes.addEntries} must be array of entries`);
    }

    if (typeof shouldAddEntry === 'function') {
        entries = entries.filter(entry => shouldAddEntry(getState, entry));
    }

    if (entries.length > 0) {
        next({
            ...action,
            payload: entries,
        });
    }

    return entries.length;
}
