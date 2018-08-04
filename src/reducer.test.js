import reducer from './reducer';

describe('./reducer', () => {
    test('reducer should be a function', () => {
        expect(typeof reducer).toBe('function');
    });
})