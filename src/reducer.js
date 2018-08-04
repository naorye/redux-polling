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

            case actionTypes.addEntry:
                nextHistory = [ ...prevPollingState.history, action.payload ]
                    .slice(-historyLimit);

                nextPollingState = {
                    ...prevPollingState,
                    history: nextHistory,
                    lastEntry: action.payload,
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
