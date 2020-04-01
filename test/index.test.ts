import { debugWrapper, clearDebug, waitDebug } from '../src';
import { resolve } from 'path';
import * as assert from 'assert';
describe('/test/index.test.ts', () => {
  it('not debug', async () => {
    const fun = debugWrapper({
      file: resolve(__dirname, './test.ts'),
      export: 'xxx',
      debug: false
    });
    const result = await fun('name', '123');
    assert(result === 'name123');
  });

  it('debug', async () => {
    const fun = debugWrapper({
      file: resolve(__dirname, './test.ts'),
      export: 'xxx',
      debug: true
    });
    const result = await fun('name', '123');
    const send = await waitDebug(9229);
    assert(typeof send === 'function');
    try {
      const send = await waitDebug(9230);
      console.log('send', send);
    } catch (e) {
      console.log('e', e);
    }
    const result2 = await fun('name', '1234');
    assert(result === 'name123' && result2 === 'name1234');
    clearDebug();
  });


  it('debug error', async () => {
    const fun = debugWrapper({
      file: resolve(__dirname, './test.error.ts'),
      export: 'xxx',
      debug: true
    });
    try {
      await fun('name:', 'error');
      assert(false);
    } catch(e) {
      assert(e === 'name:error');
    }
    clearDebug();
  });
});