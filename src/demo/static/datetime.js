const today = new Date();
const NCOV_DATE_TIMES = "_ncov_date_times";
const ordinalStr = ["fir", "sec", "thr"];
const _ncovDateTimes = localStorage.getItem(NCOV_DATE_TIMES) || "[]";
const ncovDateTimes = JSON.parse(_ncovDateTimes).map(e => new Date(e));

const decreaseTimeRandomly = date => 
    new Date(date.getTime() - (18 - 6 * Math.random()) * 60 * 60 * 1000);

const increaseTimeRandomly = date =>
    new Date(date.getTime() + (18 + 6 * Math.random()) * 60 * 60 * 1000);

const getDateStr = date => 
    `${date.getFullYear()}-${("00" + (date.getMonth() + 1)).slice(-2)}-${("00" + date.getDate()).slice(-2)} ${("00" + date.getHours()).slice(-2)}:${("00" + date.getMinutes()).slice(-2)}:${("00" + date.getSeconds()).slice(-2)}`;

function dayPassed(howmany = 0) {
    if(howmany <= 0) {
        return;
    }
    const _d = ncovDateTimes.length && howmany < 2? increaseTimeRandomly(ncovDateTimes[0]): decreaseTimeRandomly(today);
    ncovDateTimes.unshift(_d);
    if(ncovDateTimes.length > 3) {
        ncovDateTimes.pop();
    }
    localStorage.setItem(NCOV_DATE_TIMES, JSON.stringify(ncovDateTimes.map(e => e.getTime())));
}

function pushADay() {
    const _d = ncovDateTimes.length? decreaseTimeRandomly(ncovDateTimes[ncovDateTimes.length - 1]): decreaseTimeRandomly(today);
    ncovDateTimes.push(_d);
    if(ncovDateTimes.length > 3) {
        ncovDateTimes.pop();
    }
    localStorage.setItem(NCOV_DATE_TIMES, JSON.stringify(ncovDateTimes.map(e => e.getTime())));
}

let howManyDaysPassed = 0;
if(!ncovDateTimes.length) {
    dayPassed(1);
}
if(howManyDaysPassed = Math.floor(
        (today.getTime() - ncovDateTimes[0].getTime()) / (24 * 60 * 60000)
    ) >= 1) {
    dayPassed(howManyDaysPassed);
}

// for(let i in ncovDateTimes) {
//     ncovDateTimes[i] = new Date(ncovDateTimes[i]);
// }
