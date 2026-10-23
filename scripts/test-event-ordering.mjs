import assert from 'node:assert/strict';
import { eventsForDate, validDayOrder } from '../components/eventOrdering.ts';
const events=[
  {id:1,startDate:'2026-11-20',endDate:'2026-11-23'},
  {id:2,startDate:'2026-11-20',endDate:'2026-11-23',dayOrder:{'2026-11-21':2}},
  {id:3,startDate:'2026-11-21',dayOrder:{'2026-11-21':1}},
];
assert.deepEqual(eventsForDate(events,'2026-11-21').map(e=>e.id),[3,2,1]);
assert.deepEqual(eventsForDate(events,'2026-11-22').map(e=>e.id),[1,2]);
assert.deepEqual(events.map(e=>e.id),[1,2,3]);
assert.ok(validDayOrder(undefined));
assert.ok(validDayOrder({'2026-11-21':1}));
for(const invalid of [null,[],{'2026-11-21':0},{'2026-11-21':'1'},{'bad':1},{'2026-11-21':1001}]) assert.equal(validDayOrder(invalid),false);
console.log('PASS: public event ordering is independent per date, stable, non-mutating and validated.');
