import { actionTypes, createAction, isPollingAction /* , createPollingActions */ } from './actions';

describe('./actions', () => {
    test('it should contains the following action types: start, stop, request and addEntries', () => {
        expect(actionTypes).toMatchObject({
            start: '@POLLING_STATE/START',
            stop: '@POLLING_STATE/STOP',
            request: '@POLLING_STATE/REQUEST',
            addEntries: '@POLLING_STATE/ADD_ENTRIES',
        });
    });

    test('it should create a flux standart action', () => {
        expect(createAction('type', 'meta', 'payload')).toMatchObject({
            type: 'type',
            meta: 'meta',
            payload: 'payload',
        });
    });

    test('it should detect action as polling action', () => {
        expect(isPollingAction({ type: '@POLLING_STATE/START', meta: { pollingName: 'polling' } })).toEqual(true);
        expect(isPollingAction({ type: '@POLLING_STATE/STOP', meta: { pollingName: 'polling' } })).toEqual(true);
        expect(isPollingAction({ type: '@POLLING_STATE/REQUEST', meta: { pollingName: 'polling' } })).toEqual(true);
        expect(isPollingAction({ type: '@POLLING_STATE/ADD_ENTRIES', meta: { pollingName: 'polling' } })).toEqual(true);
    });

    test('it should detect action as not a polling action', () => {
        expect(isPollingAction({ type: '@POLLING_STATE/ACTION', meta: { pollingName: 'polling' } })).toEqual(false);
        expect(isPollingAction({ type: '@POLLING_STATE/STOP', meta: { pollingName: null } })).toEqual(false);
        expect(isPollingAction({ type: '@POLLING_STATE/REQUEST', meta: { } })).toEqual(false);
        expect(isPollingAction({ type: '@POLLING_STATE/ADD_ENTRIES' })).toEqual(false);
    });
});
