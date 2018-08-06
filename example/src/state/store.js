import { createStore, applyMiddleware, compose } from 'redux';
import { reduxPollingMiddleware } from 'dist'; /* eslint-disable-line import/no-unresolved */
import rootReducer from './reducer';

const initialState = {};
const enhancers = [];
const middleware = [
    reduxPollingMiddleware,
];

if (process.env.NODE_ENV === 'development') {
    /* eslint-disable-next-line no-underscore-dangle */
    const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

    if (typeof devToolsExtension === 'function') {
        enhancers.push(devToolsExtension());
    }
}

const composedEnhancers = compose(
    applyMiddleware(...middleware),
    ...enhancers,
);

const store = createStore(
    rootReducer,
    initialState,
    composedEnhancers,
);

export default store;
