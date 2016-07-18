# Suitape
A tiny wrapper for Tape to allow grouping tests in suites, promises support and extend Tape with new assertions.

### Example of use:

```javascript
import { suite, tape, addAssertions } from 'suitape';
import myComponent from 'path/to/my/component';

suite('/path/to/my/component', (test) => {
  test('My component should do its job', (assert) => {
    const actual = myComponent.returnOne();
    const expected = 1;

    assert('equal', actual, expected);
  });
});
```
Instead of using tape's assetions directly as methods, they should be passed as first parameter of `assert` function. If an invalid assertion name is provided an error will be thrown.

### Extending Tape assertions:
Assertions can be extended using `addAssertions` function provided by [extend-tape](https://github.com/atabel/extend-tape) module:

```javascript
import React from 'react';
import { createRenderer } from 'react-addons-test-utils';
import createComponent from 'react-unit';

import {suite, addAssertions } from 'suitape'
import jsxEquals from 'tape-jsx-equals';

addAssertions({ jsxEquals })

import Button from './Button';

suite('path/to/Button', (test) => {
  test('Button should set default className if no one is passed as property', (assert) => {
    const component = createComponent.shallow(<Button/>);

    const actual = component.props.className;
    const expected = 'default-class';

    assert('equal', actual, expected);
  });
});
```

### Promises support:
Similar to [blue-tape](https://github.com/spion/blue-tape), if some test returns a promise it's suite won't be finished until all remaining promises are resolved:

```javascript
import { suite } from 'suitape';
import component from 'component/path';

suite('async/component', (test) => {
  test('This async operation should return expected value', assert => new Promise((resolve) => {
    component.doAsyncOp().then((result) => {
      const actual = result;
      const expected = { id: 1, name: 'Someone' };
      
      assert('deepEqual', actual, expected);
      resolve(); //If resolve isn't called, the suite will never end
    });
  }));
```

Finally, original Tape can be imported directly from suitape for any purpose:
```javascript
import { tape } from 'suitape';
```
