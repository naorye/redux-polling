# Redux Polling
> Convenient way to support polling in your Redux app so you can focus on the business logic

[![NPM Version][npm-image]][npm-url]
<!-- [![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url] -->
<!-- [![Downloads Stats][npm-downloads]][npm-url] -->

Almost every app contains charts, progress bars or components that consist on repeated data sampling. This is done by Polling. Support polling in React-Redux application can be frustrating. Each polling scenario requires to write a dedicated reducer and actions, implement the polling (all the setTimeout / setInterval stuff), deal with history and this is even before writing the business logic of polling itself. 
Redux Polling provides a convenient way to support polling in React-Redux application so you will be able to focus on the business logic right away instead of dealing with all the boilerplate code. The setup is done by adding a middleware and you are ready to go.

You can see a demo [here](https://naorye.github.io/redux-polling/) or read the demo source code [here](https://github.com/naorye/redux-polling/tree/master/example).

## Installation

```sh
npm install --save redux-polling
```
Or
```sh
yarn add redux-polling
```

## Setup

1. <a name="middleware-setup"></a>Add `reduxPollingMiddleware` middleware to your Redux store:
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

2. <a name="reducer-setup"></a>Add `reduxPollingReducer` reducer to your root reducer:
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
1. Action panel component that contains two buttons: "Start Polling", "Stop Polling" and "Reset Polling".
2. Chart component that shows the data.
   
Redux Polling provides everything for those components: start and stop actions for the buttons and selectors for receiving the results and history. All we left to do is to implement the polling logic that fetches the data once (Redux Polling will call it on each interval):

```javascript point-polling.js
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

This module exports two items: `actions` and `selectors`.   
`actions` is an object that contains three action creators: `start()`, `stop()` and `reset()`.   
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
            <button type="button" onClick={ () => resetPolling() }>
                Reset Polling
            </button>
        </div>
    );
}

ActionsPanel.propTypes = {
    startPolling: PropTypes.func,
    stopPolling: PropTypes.func,
    resetPolling: PropTypes.func,
};

ActionsPanel.defaultProps = {
    startPolling: () => {},
    stopPolling: () => {},
    resetPolling: () => {},
};

const mapDispatchToProps = dispatch => ({
    startPolling: () => dispatch(pointPollingActions.start()),
    stopPolling: () => dispatch(pointPollingActions.stop()),
    resetPolling: () => dispatch(pointPollingActions.reset()),
});

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

## Documentation

`redux-polling` module exports several modules:
* `reduxPollingMiddleware`, `reduxPollingReducer` and `reduxPollingNamespace` which are required for setup.
* `createPollingActions` and `getPollingState` which are required for polling creation and usage.

### `reduxPollingMiddleware`

`reduxPollingMiddleware` is the middleware that should be added to the store. You can see an example [here](#middleware-setup). This middleware is used for intercepting polling actions and operate the polling logic.

### `reduxPollingReducer`

`reduxPollingReducer` is the reducer that should be added to the root reducer and `reduxPollingNamespace` is the name for that reducer. You can see an example [here](#reducer-setup). This reducer operate the polling state.

### `createPollingActions(pollingName, callbacks, pollingInterval, historyLimit)`

`createPollingActions()` is the method that creates for you the polling redux actions. It expects the following arguments:
* `pollingName` **[String](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**, **required** Is a name for this polling operation. You may name your polling operation in any name you like.
* `callbacks` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** or **[Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)**, **required** Is an object that contains callbacks for managing the polling cycle. The most important and the only required callback is the polling function which should do the polling logic. You can find all the available callbacks [here](#available-callbacks). Passing a function `func` instead of an object is equal to passing a callbacks object that contains only the polling function: `{ polling: func }`.
* `pollingInterval` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**, **optional**, **default is 5000ms** Is the polling interval in milliseconds. Each interval starts when polling cycle ends and trigger a new polling cycle. 
* `historyLimit` **[Number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)**, **optional**, **default is 1** Is the number of entries you wish to store for this polling operation. Use `0` (zero) to not store any history, and -1 for unlimited history.

`createPollingActions()` returns an object with three action creators: `start()`, `stop()` and `reset()`. Dispatching them will start, stop and reset the polling operation.   
**Important**: Any argument that will be supplied to `start()` will be passed to the polling callback:
```javascript
async function polling(accountId) {
    const point = await fetchNextPoint(accountId);
    return point;
}

const actions = createPollingActions('pointPolling', { polling }, 1000, 30);

...
...
const accountId = 428;
dispatch(actions.start(accountId));
...
...
dispatch(actions.stop());
...
...
// When required to reset the polling state
dispatch(actions.reset());
```
In this example polling started with account id as an argument (`actions.start(accountId);`). When the `polling(accountId)` method will be called, the `accountId` argument that was provided to `start()` will also be provided to `polling()`. There is no limitation on the arguments `start()` can get. They simply will be passed to `polling()`. 

### `getPollingState(state, pollingName)`

`getPollingState(pollingName)` is a helper selector to retrieve the state of the polling operation named by `pollingName` argument. Like any other selector it gets the global state (`state`) and the name of the required polling operation state (`pollingName`). The returned polling state is an object that looks like:
```javascript Polling state example
{
    isActive: false,            // Indicates whther the polling is activated or not
    history: [],                // History entries
    lastEntry: undefined,       // The last fetched entry
}
```

### <a name="available-callbacks"></a>Available Callbacks

The second argument `createPollingActions()` expected is an object with callbacks. Those callbacks are called during a polling cycle. The available callbacks are:
* `polling(...args, getState)` **required** Each interval starts with calling to the `polling` callback that should do a single fetch / calculation and return a single entry. `...args` are the arguments that was provided to the `start(args)` action. `getState()` method is also provided as the last argument so you can query your state. This method can be asynchronous and can return a promise. The returned / resolved value is store as an entry in the polling history.   
Sometimes you may want to return and store multiple items in the history for single polling. You can do that by returning the following `{ multipleEntries: true, entries: [ ...entries ] }`.   
Example:
```javascript Return multiple entriens
async function polling(accountId, getState) { // accountId was provided by start() action
    const state = getState();
    const pointsCount = selectors.getPointsCount();
    const points = await fetchMultiplePoints(accountId, pointsCount);
    // points is an array
    return { multipleEntries: true, entries: points};
}
```
* `shouldAddEntry(entry, getState)` **optional** This callback is called right before adding an entry to the state. It gets a single entry (which is the response of the `polling` callback) and `getState()` method. It should return a boolean that indicates whether to add the entry to the state. 

<!-- 
## Tests

Tests are written with [jest](https://facebook.github.io/jest/). In order to run it, clone this repository and:

```sh
npm test
``` -->

## Release History

* 1.1.1
    * Support returning multiple entries in the polling callback
    * Support reset action to reset the state
    * Remove initialPolling callback (can be handled in the polling callback by the user)
* 1.0.0
    * First stable version

## Meta

Naor Ye – naorye@gmail.com

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/naorye/redux-polling](https://github.com/naorye/redux-polling/)

## Contributing

1. Fork it (<https://github.com/naorye/redux-polling/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/redux-polling.svg?style=flat-square
[npm-url]: https://npmjs.org/package/redux-polling
[npm-downloads]: https://img.shields.io/npm/dm/redux-polling.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/naorye/redux-polling/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/naorye/redux-polling
[coveralls-image]: https://img.shields.io/coveralls/naorye/redux-polling.svg?style=flat-square
[coveralls-url]: https://coveralls.io/github/naorye/redux-polling?branch=master
