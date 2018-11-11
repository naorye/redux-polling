import { actionTypes, createAction } from './actions';
import { getPollingState } from './reducer';

const timeouts = {};

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

    const { callbacks: { onStop }, pollingName } = action.meta;
    if (typeof onStop === 'function') {
        onStop();
    }
    
    clearTimeout(timeouts[pollingName]);

    return true;
}

export function reset(_, action, next) {
    next(action);

    const { callbacks: { onReset }, pollingName } = action.meta;
    if (typeof onReset === 'function') {
        onReset();
    }

    clearTimeout(timeouts[pollingName]);

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
    const pollingFunc = callbacks.polling;
    return Promise.resolve(pollingFunc(...requestPayload, getState))
        .then(
            (data) => {
                let entries;
                if (data.multipleEntries === true) {
                    if (Array.isArray(data.entries) === true) {
                        ({ entries } = data);
                    } else {
                        throw new Error('Entries must be an array when providing multiple entries');
                    }
                } else {
                    entries = [ data ];
                }
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
            timeouts[pollingName] = setTimeout(() => {
                const requestAction = createAction(actionTypes.request, action.meta);
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
        entries = entries.filter(entry => shouldAddEntry(entry, getState));
    }

    if (entries.length > 0) {
        next({
            ...action,
            payload: entries,
        });
    }

    return entries.length;
}
