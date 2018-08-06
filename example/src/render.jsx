import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from './state/store';
import './index.css';
import App from './App';

export default function render() {
    ReactDOM.render(
        <Provider store={ store }>
            <App />
        </Provider>,
        document.getElementById('root'),
    );
}
