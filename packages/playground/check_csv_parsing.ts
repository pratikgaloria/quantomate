import fs from 'fs';
const dailyCsv = fs.readFileSync('nvda_stooq.csv', 'utf8').split('\n');
console.log('Line 0:', dailyCsv[0]);
console.log('Line 1:', dailyCsv[1]);
console.log('Last Line:', dailyCsv[dailyCsv.length - 1]);
