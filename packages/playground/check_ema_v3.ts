import pkg from '../core/dist/index.js';
const { Dataset } = pkg;
import fs from 'fs';

const dailyCsv = fs.readFileSync('nvda_stooq.csv', 'utf8').split('\n');
const dailyData = [{ timestamp: 1739836800000, close: 189 }]; // Manual test
const ds = new Dataset(dailyData);
console.log('DS Length:', ds.length);
const q = ds.at(0);
console.log('Quote:', q);
console.log('Timestamp:', q.timestamp);
