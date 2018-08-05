import { createPollingActions, getPollingState} from 'redux-polling';
import jsonp from 'jsonp';
import { createSelector } from 'reselect';

const pollingInterval = 1000;
const historyLength = 30;

export const pointPollingSelectors = {
    isPointPollingActive: state => getPollingState(state, 'pointPolling').isActive,
    getPointHistory: state => getPollingState(state, 'pointPolling').history,
    getLastEntry: state => getPollingState(state, 'pointPolling').lastEntry,
    getLastPoint: createSelector(
        state => getPollingState(state, 'pointPolling').lastEntry,
        lastEntry => lastEntry ? lastEntry.point : undefined,
    ),
    getLastChange: createSelector(
        state => getPollingState(state, 'pointPolling').history,
        history => {
            if (history.length < 2) {
                return undefined;
            }

            const [ { point: current } ] = history.slice(-1);
            const [ { point: prev } ] = history.slice(-2);

            return current - prev;
        },
    ),
};

function polling(getState) {
    return new Promise((resolve, reject) => {
        jsonp('https://canvasjs.com/services/data/datapoints.php?length=1&type=jsonp', null, (err, data) => {
            if (err) {
                reject(err.message);
            } else {
                const lastEntry = pointPollingSelectors.getLastEntry(getState());
                const index = lastEntry ? lastEntry.index + 1 : 1;
                const [ [ , point ] ] = data;

                resolve({ point, index });
            }
        });
    });
}

// Add only even points
function shouldAddEntry(getState, value) {
    return value.point % 2 === 0;
}

export const pointPollingActions = createPollingActions('pointPolling', { polling, shouldAddEntry }, pollingInterval, historyLength);
