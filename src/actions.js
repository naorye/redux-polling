export const actionTypes = {
    start: '@POLL_STATE/START',
    stop: '@POLL_STATE/STOP',
    request: '@POLL_STATE/REQUEST',
    addEntry: '@POLL_STATE/ADD_ENTRY',
};

export const createAction = (type, meta, payload) => ({ type, meta, payload });
const createActionCreator = (type, meta) => (...args) => createAction(type, meta, [ ...args ]);

export function isPollAction(action) {
    return !!(
        Object.values(actionTypes).indexOf(action.type) > -1
        && action.meta && action.meta.pollName
    );
}

export function createPollActions(pollName, pollLogic, pollInterval = 5000, historyLimit = 1) {
    if (typeof pollName !== 'string') {
        throw new Error('pollName is required and must be a string');
    }

    if (typeof pollLogic !== 'function') {
        throw new Error('pollLogic is required and must be a function');
    }

    const meta = {
        pollName,
        pollLogic,
        pollInterval,
        historyLimit,
    };

    return {
        start: createActionCreator(actionTypes.start, meta),
        stop: createActionCreator(actionTypes.stop, meta),
    };
}
