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

let isInitial = true;

async function polling(getState) {
    const [ ...points ] = await fetchPoints(isInitial ? historyLength : 1);
    isInitial = false;

    const lastEntry = pointPollingSelectors.getLastEntry(getState());
    const lastEntryIndex = lastEntry ? lastEntry.index + 1 : 1;

    const entries = points.map(([ , point ], index) => ({ point, index: index + lastEntryIndex }));
    return { multipleEntries: true, entries };
}

function shouldAddEntry(/* value, getState */) {
    // const isEven = value.point % 2 === 0;
    // if (!isEven) {
    //     console.log(`Filter odd point ${value.point}`);
    // }
    // return isEven;
    return true;
}

function onReset() {
    isInitial = true;
}

const callbacks = { polling, shouldAddEntry, onReset };

export const pointPollingActions = createPollingActions('pointPolling', callbacks, pollingInterval, historyLength);
