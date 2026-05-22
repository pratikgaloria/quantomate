const fs = require('fs');
const data = JSON.parse(fs.readFileSync('nvda_1h.json', 'utf8'));

const result = data.chart.result[0];
const timestamps = result.timestamp;
const q = result.indicators.quote[0];

console.log('Date,Open,High,Low,Close,Volume');
timestamps.forEach((ts, i) => {
    if (q.open[i] === null) return;
    const date = new Date(ts * 1000).toISOString();
    console.log(`${date},${q.open[i]},${q.high[i]},${q.low[i]},${q.close[i]},${q.volume[i]}`);
});
