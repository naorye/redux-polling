import { actionTypes, createAction, isPollAction /* , createPollActions */ } from './actions';

describe('./actions', () => {
    test('it should contains the following action types: start, stop, request and addEntry', () => {
        expect(actionTypes).toMatchObject({
            start: '@POLL_STATE/START',
            stop: '@POLL_STATE/STOP',
            request: '@POLL_STATE/REQUEST',
            addEntry: '@POLL_STATE/ADD_ENTRY',
        });
    });

    test('it should create a flux standart action', () => {
        expect(createAction('type', 'meta', 'payload')).toMatchObject({
            type: 'type',
            meta: 'meta',
            payload: 'payload',
        });
    });

    test('it should detect action as poll action', () => {
        expect(isPollAction({ type: '@POLL_STATE/START', meta: { pollName: 'poll' } })).toEqual(true);
        expect(isPollAction({ type: '@POLL_STATE/STOP', meta: { pollName: 'poll' } })).toEqual(true);
        expect(isPollAction({ type: '@POLL_STATE/REQUEST', meta: { pollName: 'poll' } })).toEqual(true);
        expect(isPollAction({ type: '@POLL_STATE/ADD_ENTRY', meta: { pollName: 'poll' } })).toEqual(true);
    });

    test('it should detect action as not a poll action', () => {
        expect(isPollAction({ type: '@POLL_STATE/ACTION', meta: { pollName: 'poll' } })).toEqual(false);
        expect(isPollAction({ type: '@POLL_STATE/STOP', meta: { pollName: null } })).toEqual(false);
        expect(isPollAction({ type: '@POLL_STATE/REQUEST', meta: { } })).toEqual(false);
        expect(isPollAction({ type: '@POLL_STATE/ADD_ENTRY' })).toEqual(false);
    });
});
