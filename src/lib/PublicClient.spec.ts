// tslint:disable:no-expression-statement
import test from 'ava';
import { PublicClient } from './PublicClient';

test('getSpotInstruments', async t => {
  const publicClient = PublicClient();
  const data = await publicClient.getSpotInstruments();
  t.true(data.length > 0);
});
