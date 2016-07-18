'use strict';

const tape = require('tape');
const _addAssertions = require('extend-tape');

let test = tape;

const _isPromise = val => typeof val === 'object' &&
                          typeof val.then === 'function' &&
                          typeof val.catch === 'function';

const _isEmpty = array => array.length === 0;

const _buildAssertFn = (description, context) => (assertionType, ...args) => {
  if(!context[assertionType]) return context.fail('Invalid ' + assertionType + ' assertion');
  context[assertionType].apply(context, [...args, description]);
};

function suite(suiteName, suiteFn) {
  test(suiteName, (t) => {
    const promises = [];

    const _testWrapper = (description, testFn) => {
      const testReturnVal = testFn(_buildAssertFn(description, t));
      if(_isPromise(testReturnVal)) promises.push(testReturnVal);
    };

    try {
      suiteFn(_testWrapper);
    } catch (err) {
      t.end(err);
    }

    if(_isEmpty(promises)) return t.end();

    Promise.all(promises)
      .then(() => t.end())
      .catch(err => t.fail(err));
  });
}

function addAssertions(assertionsObj) {
  test = _addAssertions(tape, assertionsObj);
}

module.exports = {suite, tape, addAssertions};
