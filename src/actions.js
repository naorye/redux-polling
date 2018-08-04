export const actionTypes = {
    start: '@POLLING_STATE/START',
    stop: '@POLLING_STATE/STOP',
    request: '@POLLING_STATE/REQUEST',
    addEntry: '@POLLING_STATE/ADD_ENTRY',
};

export const createAction = (type, meta, payload) => ({ type, meta, payload });
const createActionCreator = (type, meta) => (...args) => createAction(type, meta, [ ...args ]);

export function isPollingAction(action) {
    return !!(
        Object.values(actionTypes).indexOf(action.type) > -1
        && action.meta && action.meta.pollingName
    );
}

export function createPollingActions(
    pollingName, callbacks, pollingInterval = 5000, historyLimit = 1,
) {
    if (!(callbacks instanceof Object)) {
        /* eslint-disable-next-line no-param-reassign */
        callbacks = { polling: callbacks };
    }

    if (typeof pollingName !== 'string') {
        throw new Error('pollingName is required and must be a string');
    }

    if (typeof callbacks.polling !== 'function') {
        throw new Error('polling method is required and must be a function');
    }

    const meta = {
        pollingName,
        callbacks,
        pollingInterval,
        historyLimit,
    };

    return {
        start: createActionCreator(actionTypes.start, meta),
        stop: createActionCreator(actionTypes.stop, meta),
    };
}
