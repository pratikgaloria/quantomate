import fs from 'fs';
const daily = fs.readFileSync('nvda_stooq.csv', 'utf8').split('\n').filter(l => l.trim().split(',').length >= 5).slice(1, 6);
const hourly = fs.readFileSync('nvda_1h.csv', 'utf8').split('\n').filter(l => l.trim().split(',').length >= 5).slice(1, 6);

console.log('Daily:');
daily.forEach(l => console.log(l.split(',')[0], '->', new Date(l.split(',')[0]).getTime()));
console.log('\nHourly:');
hourly.forEach(l => console.log(l.split(',')[0], '->', new Date(l.split(',')[0]).getTime()));
