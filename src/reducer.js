import { actionTypes, isPollAction } from './actions';

export const pollStateNamespace = 'POLL_STATE';

export function getPollState(state, pollName) {
    return (state[pollStateNamespace] || {})[pollName] || {};
}

function createPollReducer() {
    const initialPollState = {
        isActive: false,
        requestPayload: undefined,
        history: [],
        lastEntry: undefined,
    };

    const initialState = {};

    return function (state = initialState, action) {
        if (!isPollAction(action)) {
            return state;
        }

        const { meta: { pollName, historyLimit } } = action;
        const prevPollState = state[pollName];
        let nextPollState;
        let nextHistory;

        switch (action.type) {
            case actionTypes.start:
                nextPollState = {
                    ...initialPollState,
                    ...prevPollState,
                    isActive: true,
                    requestPayload: action.payload,
                };
                break;

            case actionTypes.stop:
                nextPollState = {
                    ...prevPollState,
                    isActive: false,
                };
                break;

            case actionTypes.addEntry:
                nextHistory = [ ...prevPollState.history, action.payload ]
                    .slice(-historyLimit);

                nextPollState = {
                    ...prevPollState,
                    history: nextHistory,
                    lastEntry: action.payload,
                };
                break;

            default: nextPollState = undefined;
                break;
        }

        const nextState = !nextPollState ? state : {
            ...state,
            [pollName]: nextPollState,
        };

        return nextState;
    };
}

export default createPollReducer();
