// tslint:disable:no-expression-statement
import test from 'ava';
import { PublicClient } from './PublicClient';

test('first', async t => {
  const publicClient = PublicClient();
  publicClient.getSpotInstruments();
  t.is(0, 0);
});
