import React, { Component } from 'react';
import { connect } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { pointPollingActions, pointPollingSelectors } from './state/point-polling'; 
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const { isPointPollingActive, lastPoint, lastChange, history, startPollingPoint, stopPollingPoint } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Redux Polling Example</h1>
        </header>
        <p className="App-intro">
          Click on start and stop buttons to controll polling
        </p>
        <button onClick={ () => startPollingPoint() }>Start</button>
        <button onClick={ () => stopPollingPoint() }>Stop</button>
        <div>Status: { isPointPollingActive ? 'Active' : 'Not Active' }</div>
        <div>Last Point: { lastPoint } ({ lastChange })</div>
        <div>Point History: { history.map(h => h.point).join(', ') }</div>

        <LineChart width={600} height={300} data={history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="point" stroke="#8884d8" isAnimationActive={ false } />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="index" />
          <YAxis />
        </LineChart>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isPointPollingActive: pointPollingSelectors.isPointPollingActive(state),
  history: pointPollingSelectors.getPointHistory(state),
  lastPoint: pointPollingSelectors.getLastPoint(state),
  lastChange: pointPollingSelectors.getLastChange(state),
})

const mapDispatchToProps = {
  startPollingPoint: pointPollingActions.start,
  stopPollingPoint: pointPollingActions.stop,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
