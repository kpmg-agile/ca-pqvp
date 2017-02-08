import './vendor';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/async-test';
import 'zone.js/dist/fake-async-test';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/proxy';
import 'zone.js/dist/jasmine-patch';

//require all source files for proper coverage inspection
const src = require.context('./', true, /[^spec|e2e]\.(js|jsx)$/);
src.keys().forEach(src);

//require all spec files for tests
const test = require.context('./', true, /spec\.(js|jsx)$/);
test.keys().forEach(test);

import html from './index.html';

/**
 * Simple dummy test
 */
describe('test', () => {
   it('should not fail', () => {
        expect(typeof html).toBe('string');
   });
});
