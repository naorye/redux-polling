import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as Recharts from 'recharts';
import { pointPollingActions, pointPollingSelectors } from './state/point-polling';
import logo from './logo.svg';
import './App.css';

function App(props) {
    const {
        isPointPollingActive, lastPoint, lastChange, history, startPollingPoint, stopPollingPoint,
    } = props;
    return (
        <div className="App">
            <header className="App-header">
                <img src={ logo } className="App-logo" alt="logo" />
                <h1 className="App-title">
                    Redux Polling Example
                </h1>
            </header>
            <p className="App-intro">
                Click on start and stop buttons to controll polling
            </p>
            <button type="button" onClick={ () => startPollingPoint() }>
                Start
            </button>
            <button type="button" onClick={ () => stopPollingPoint() }>
                Stop
            </button>
            <div>
                { `Status: ${isPointPollingActive ? 'Active' : 'Not Active'}` }
            </div>
            <div>
                { `Last Point: ${lastPoint} (${lastChange})` }
            </div>
            <div>
                { `Point History: ${history.map(h => h.point).join(', ')}` }
            </div>

            <Recharts.LineChart width={ 600 } height={ 300 } data={ history }>
                <Recharts.Line type="monotone" dataKey="point" stroke="#8884d8" isAnimationActive={ false } />
                <Recharts.CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Recharts.XAxis dataKey="index" />
                <Recharts.YAxis />
            </Recharts.LineChart>
        </div>
    );
}

App.propTypes = {
    isPointPollingActive: PropTypes.bool,
    lastPoint: PropTypes.number,
    lastChange: PropTypes.number,
    history: PropTypes.arrayOf(PropTypes.shape({
        point: PropTypes.number.isRequired,
        index: PropTypes.number.isRequired,
    })),
    startPollingPoint: PropTypes.func,
    stopPollingPoint: PropTypes.func,
};

App.defaultProps = {
    isPointPollingActive: false,
    lastPoint: 0,
    lastChange: 0,
    history: [],
    startPollingPoint: () => {},
    stopPollingPoint: () => {},
};

const mapStateToProps = state => ({
    isPointPollingActive: pointPollingSelectors.isPointPollingActive(state),
    history: pointPollingSelectors.getPointHistory(state),
    lastPoint: pointPollingSelectors.getLastPoint(state),
    lastChange: pointPollingSelectors.getLastChange(state),
});

const mapDispatchToProps = {
    startPollingPoint: pointPollingActions.start,
    stopPollingPoint: pointPollingActions.stop,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(App);
