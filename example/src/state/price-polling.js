import { createPollingActions, getPollingState} from 'redux-polling';
import { createResource } from 'plain-api';

export const pricePollingSelectors = {
    isPricePollingActive: state => getPollingState(state, 'pricePolling').isActive,
    getPriceHistory: state => getPollingState(state, 'pricePolling').history,
    getLastPrice: state => getPollingState(state, 'pricePolling').lastEntry,
    getLastChange: state => {
        const { history } = getPollingState(state, 'pricePolling');

        if (history.length < 2) {
            return undefined;
        }

        const [ current ] = history.slice(-1);
        const [ prev ] = history.slice(-2);

        return ((current - prev) / prev).toFixed(2);
    },
};

const fetchLastPrice = createResource('get', 'https://blockchain.info/ticker', {
    parsers: [
        data => Math.round(data.USD.last * 1e2) / 1e2,
    ],
});

async function polling() {
    const lastPrice = await fetchLastPrice.call();
    return lastPrice;
}

function shouldAddEntry(getState, value) {
    const lastPrice = pricePollingSelectors.getLastPrice(getState());
    return lastPrice !== value;
}

const callbacks = { polling, shouldAddEntry };

export const pricePollingActions = createPollingActions('pricePolling', callbacks, 5000, 10);
