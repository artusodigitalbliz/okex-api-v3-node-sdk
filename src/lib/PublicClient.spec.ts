// tslint:disable:no-expression-statement
import test from 'ava';
import { PublicClient } from './PublicClient';

test('first', async t => {
  const publicClient = PublicClient();
  const data = await publicClient.getSpotInstruments();
  t.log(data);
});
