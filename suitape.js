'use strict';

const tape = require('tape');
const _addAssertions = require('extend-tape');

let test = tape;

const _isPromise = val => typeof val === 'object' &&
                          typeof val.then === 'function' &&
                          typeof val === 'function';

const _isEmpty = array => array.length === 0;

const _buildAssertFn = (description, context) => (assertionType, ...args) => {
  context[assertionType].apply(context, [...args, description]);
};

function suite(suiteName, suiteFn) {
  test(suiteName, (t) => {
    const promises = [];

    const _testWrapper = (description, testFn) => {
      const testReturnVal = testFn(_buildAssertFn(description, t));
      if(_isPromise(testReturnVal)) promises.push(testReturnVal);
    };

    suiteFn(_testWrapper);

    if(_isEmpty(promises)) return t.end();

    Promise.all(promises)
      .then(() => t.end())
      .catch(err => t.fail(err));
  });
}

function addAssertions(assertionsObj) {
  test = addAssertions(tape, assertionsObj);
}

exports.suite = suite;
exports.addAssertions = addAssertions;
exports.tape = tape;

module.exports = suite;