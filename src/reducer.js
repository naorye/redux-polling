import { actionTypes, isPollingAction } from './actions';

const initialPollingState = {
    isActive: false,
    requestPayload: undefined,
    history: [],
    lastEntry: undefined,
};

export const reduxPollingNamespace = 'REDUX_POLLING';

export function getPollingState(state, pollingName) {
    return (state[reduxPollingNamespace] || {})[pollingName] || initialPollingState;
}

function createPollingReducer() {
    const initialState = {};

    return function (state = initialState, action) {
        if (!isPollingAction(action)) {
            return state;
        }

        const { meta: { pollingName, historyLimit } } = action;
        const prevPollingState = state[pollingName];
        let nextPollingState;
        let nextHistory;
        let lastEntry;

        switch (action.type) {
            case actionTypes.start:
                nextPollingState = {
                    ...initialPollingState,
                    ...prevPollingState,
                    isActive: true,
                    requestPayload: action.payload,
                };
                break;

            case actionTypes.stop:
                nextPollingState = {
                    ...prevPollingState,
                    isActive: false,
                };
                break;

            case actionTypes.reset:
                nextPollingState = initialPollingState;
                break;

            case actionTypes.addEntries:
                if (historyLimit === 0) {
                    nextHistory = prevPollingState.history;
                } else {
                    nextHistory = [ ...prevPollingState.history, ...action.payload ];

                    if (historyLimit > 0) {
                        nextHistory = nextHistory.slice(-historyLimit);
                    }
                }

                [ lastEntry ] = action.payload.slice(-1);

                nextPollingState = {
                    ...prevPollingState,
                    history: nextHistory,
                    lastEntry,
                };
                break;

            default: nextPollingState = undefined;
                break;
        }

        const nextState = !nextPollingState ? state : {
            ...state,
            [pollingName]: nextPollingState,
        };

        return nextState;
    };
}

export default createPollingReducer();
