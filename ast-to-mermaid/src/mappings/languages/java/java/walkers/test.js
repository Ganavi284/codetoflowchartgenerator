/**
 * Main test file
 */

import { simpleTest } from './simple-test.js';

function runTests() {
  console.log('Running tests...');
  const result = simpleTest();
  console.log('Tests completed:', result ? 'PASS' : 'FAIL');
}

runTests();