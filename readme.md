# Redux Polling
> Convenient way to support polling in your Redux app so you can focus on the business logic

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
<!-- [![Downloads Stats][npm-downloads]][npm-url] -->

Almost every app contains charts, progress bars or components that consist on repeated data sampling. This is done by Polling. Support polling in React-Redux application can be frustrating. Each polling scenario requires to write a dedicated reducer and actions, implement the polling (all the setTimeout / setInterval stuff), deal with history and this is even before writing the business logic of polling itself. 
Redux Polling provides a convenient way to support polling in React-Redux application so you will be able to focus on the business logic right away instead of dealing with all the boilerplate code. The setup is done by adding a middleware and you are ready to go.

## Installation

```sh
npm install --save redux-polling
```
Or
```sh
yarn add redux-polling
```

## Setup

1. Add `reduxPollingMiddleware` middleware to your Redux store:
```javascript store.js
import { createStore, applyMiddleware, compose } from 'redux';
import { reduxPollingMiddleware } from 'redux-polling';
import rootReducer from './path/to/your/root/reducer';

const initialState = {};
const middleware = [
    reduxPollingMiddleware,
];

const composedEnhancers = compose(
    applyMiddleware(...middleware),
);

const store = createStore(
    rootReducer,
    initialState,
    composedEnhancers,
);

export default store;
```

2. Add `reduxPollingReducer` reducer to your root reducer:
```javascript reducers.js
import { combineReducers } from 'redux';
import { reduxPollingNamespace, reduxPollingReducer } from 'redux-polling';

export default combineReducers({
    .....
    .....
    [reduxPollingNamespace]: reduxPollingReducer,
});

```

3. Your application is ready to use Redux Polling everywhere.

## Usage example

Let's say we want to implement a chart page that consist on data polling. The page has two components:
1. Action panel component that contains two buttons: "Start Polling" and "Stop Polling".
2. Chart component that shows the data.
Redux Polling provides everything for those components: start and stop actions for the buttons and selectors for receiving the results and history. All we left to do is to implement the polling logic that fetches the data once. It will be called on each interval:
````javascript point-polling.js
import { createPollingActions, getPollingState } from 'redux-polling';
import { createSelector } from 'reselect';
import fetchNextPoint from './path/to/your/points/service';

/* Actions */
const pollingInterval = 1000;
const historyLength = 30;

async function polling() {
    const point = await fetchNextPoint();
    return point;
}

export const actions = createPollingActions('pointPolling', polling, pollingInterval, historyLength);

/* Selectors */
const isPollingActive = state => getPollingState(state, 'pointPolling').isActive;
const getPointHistory = state => getPollingState(state, 'pointPolling').history;
const getLastPoint = state => getPollingState(state, 'pointPolling').lastEntry;

export const selectors = {
    isPollingActive, getPointHistory, getLastPoint,
};
```
This module exported two items: `actions` and `selectors`.   
`actions` is an object that contains two action creators: `start()` and `stop()`.   
`selectors` is an object with selectors that our app needs.   
Please notice the use of `createPollingActions()` and `getPollingState()`.

That's all for the polling implementation. Now we can create the components.
1. Actions Panel:
```javascript actions-panel.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { actions as pointPollingActions } from './state/point-polling';

function ActionsPanel(props) {
    const { startPolling, stopPolling } = props;
    return (
        <div>
            <button type="button" onClick={ () => startPolling() }>
                Start Polling
            </button>
            <button type="button" onClick={ () => stopPolling() }>
                Stop Polling
            </button>
        </div>
    );
}

ActionsPanel.propTypes = {
    startPolling: PropTypes.func,
    stopPolling: PropTypes.func,
};

ActionsPanel.defaultProps = {
    startPolling: () => {},
    stopPolling: () => {},
};

const mapDispatchToProps = {
    startPolling: pointPollingActions.start,
    stopPolling: pointPollingActions.stop,
};

export default connect(
    undefined,
    mapDispatchToProps,
)(ActionsPanel);
```
2. Chart (I will not get into implementation details of the chart since this is not the topic here):
```javascript chart.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import LineChart from 'my-favorite-charts-library';
import { selectors as pointPollingSelectors } from './state/point-polling';

function Chart(props) {
    const { isPollingActive, lastPoint, history } = props;
    return (
        <div>
            <div>
                { isPollingActive ? 'Polling Active' : 'Polling Inactive' }
            </div>
            <div>
                { `Last fetched point is ${lastPoint}` }
            </div>

            <LineChart data={ history } />
        </div>
    );
}

Chart.propTypes = {
    isPollingActive: PropTypes.bool,
    lastPoint: PropTypes.number,
    history: PropTypes.arrayOf(PropTypes.number),
};

Chart.defaultProps = {
    isPollingActive: false,
    lastPoint: undefined,
    history: [],
};

const mapStateToProps = state => ({
    isPollingActive: pointPollingSelectors.isPollingActive(state),
    lastPoint: pointPollingSelectors.getLastPoint(state),
    history: pointPollingSelectors.getPointHistory(state),
});

export default connect(
    mapStateToProps,
)(Chart);
```

Cool.



Example: https://naorye.github.io/redux-polling/
