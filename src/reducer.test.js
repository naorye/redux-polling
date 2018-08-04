import reducer, { getPollingState, initialPollingState, reduxPollingNamespace } from './reducer';
import { actionTypes, isPollingAction } from './actions';


describe('./reducer', () => {
    test('reducer should be a function', () => {
        expect(typeof reducer).toBe('function');
    });

    test('getPollingState return value should be initial state in case', () => {
        expect(getPollingState({})).toBe(initialPollingState)
    });

    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual({});
    });

    it('should handle start polling', () => {
        const startAction = {
          type: actionTypes.start,
          meta: { pollingName: 'REDUX_POLLING' }
        };


        expect(reducer({}, startAction)).toEqual({
            REDUX_POLLING: {
                history: [],
                isActive: true,
                lastEntry: undefined,
                requestPayload: undefined
            }
        })
    });

    it('should handle stop polling', () => {
        const stopAction = {
            type: actionTypes.stop,
            meta: { pollingName: 'REDUX_POLLING' }
        };

        expect(reducer({}, stopAction)).toEqual({
            REDUX_POLLING: {
                isActive: false
            }
        })
    })

    it('should handle add entry action', () => {
        const startAction = {
            type: actionTypes.start,
            meta: { pollingName: 'REDUX_POLLING' }
        };

        const addEntryAction = {
            type: actionTypes.addEntry,
            meta: { pollingName: 'REDUX_POLLING', historyLimit: 1 }
        };
        
        expect(reducer(reducer({}, startAction), addEntryAction)).toEqual({
            REDUX_POLLING: {
                isActive: false,
                history: [ undefined ],
                isActive: true,
                lastEntry: undefined,
                requestPayload: undefined
            }
        })
    })
})
