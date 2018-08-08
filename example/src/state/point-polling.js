import { createPollingActions, getPollingState } from 'dist'; /* eslint-disable-line import/no-unresolved */
import jsonp from 'jsonp';
import { createSelector } from 'reselect';

const pollingInterval = 1000;
const historyLength = 10;

function fetchPoints(length) {
    return new Promise((resolve, reject) => {
        jsonp(`https://canvasjs.com/services/data/datapoints.php?length=${length}&type=jsonp`, null, (err, data) => {
            if (err) {
                reject(err.message);
            } else {
                resolve(data);
            }
        });
    });
}

export const pointPollingSelectors = {
    isPointPollingActive: state => getPollingState(state, 'pointPolling').isActive,
    getPointHistory: state => getPollingState(state, 'pointPolling').history,
    getLastEntry: state => getPollingState(state, 'pointPolling').lastEntry,
    getLastPoint: createSelector(
        state => getPollingState(state, 'pointPolling').lastEntry,
        lastEntry => (lastEntry ? lastEntry.point : undefined),
    ),
    getLastChange: createSelector(
        state => getPollingState(state, 'pointPolling').history,
        (history) => {
            if (history.length < 2) {
                return undefined;
            }

            const [ { point: current } ] = history.slice(-1);
            const [ { point: prev } ] = history.slice(-2);

            return current - prev;
        },
    ),
};

async function polling(getState) {
    const [ [ , point ] ] = await fetchPoints(1);

    const lastEntry = pointPollingSelectors.getLastEntry(getState());
    const index = lastEntry ? lastEntry.index + 1 : 1;

    return { point, index };
}

function shouldAddEntry(/* getState, value */) {
    // const isEven = value.point % 2 === 0;
    // if (!isEven) {
    //     console.log(`Filter odd point ${value.point}`);
    // }
    // return isEven;
    return true;
}

async function initialPolling() {
    const [ ...points ] = await fetchPoints(historyLength);

    return points.map(([ , point ], index) => ({ point, index: index + 1 }));
}

const callbacks = { polling, shouldAddEntry, initialPolling };

export const pointPollingActions = createPollingActions('pointPolling', callbacks, pollingInterval, historyLength);
