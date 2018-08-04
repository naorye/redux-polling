import React, { Component } from 'react';
import { connect } from 'react-redux';
import { pricePollingActions, pricePollingSelectors } from './state/price-polling'; 
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    const { isPricePollingActive, lastPrice, lastChange, priceHistory, startPollingPrice, stopPollingPrice } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Redux Polling Example</h1>
        </header>
        <p className="App-intro">
          Click on start and stop buttons to controll polling
        </p>
        <button onClick={ () => startPollingPrice() }>Start</button>
        <button onClick={ () => stopPollingPrice() }>Stop</button>
        <div>Status: { isPricePollingActive ? 'Active' : 'Not Active' }</div>
        <div>Last Price: { lastPrice } ({ lastChange })</div>
        <div>Price History: { priceHistory.join(', ') }</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isPricePollingActive: pricePollingSelectors.isPricePollingActive(state),
  priceHistory: pricePollingSelectors.getPriceHistory(state),
  lastPrice: pricePollingSelectors.getLastPrice(state),
  lastChange: pricePollingSelectors.getLastChange(state),
})

const mapDispatchToProps = {
  startPollingPrice: pricePollingActions.start,
  stopPollingPrice: pricePollingActions.stop,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)