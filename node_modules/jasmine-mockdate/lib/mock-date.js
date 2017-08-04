/**
 * Adopted from Sinon.JS
 * https://github.com/cjohansen/Sinon.JS
 * Copyright (c) 2010-2013 Christian Johansen
 */

var jasmine = require('jasmine');

// keep the native Date
var Date = global.Date;

module.exports = MockDate;

function MockDate(year, month, day, hour, minute, second, millisecond) {
  // called without new operator
  if (!(this instanceof MockDate)) {
    return Date();
  }

  switch (arguments.length) {
  case 0:
    // create mocked date
    return new Date(now());
  case 1:
    return new Date(year);
  case 2:
    return new Date(year, month);
  case 3:
    return new Date(year, month, day);
  case 4:
    return new Date(year, month, day, hour);
  case 5:
    return new Date(year, month, day, hour, minute);
  case 6:
    return new Date(year, month, day, hour, minute, second);
  default:
    return new Date(year, month, day, hour, minute, second, millisecond);
  }
}

MockDate.baseTime = 0;

function now() {
  return MockDate.baseTime + jasmine.Clock.defaultFakeTimer.nowMillis;
}

if (Date.now) {
  MockDate.now = now;
} else {
  delete MockDate.now;
}

if (Date.toSource) {
  MockDate.toSource = function toSource() {
    return Date.toSource();
  };
} else {
  delete MockDate.toSource;
}

MockDate.toString = function toString() {
  return Date.toString();
};

MockDate.prototype = Date.prototype;
MockDate.parse = Date.parse;
MockDate.UTC = Date.UTC;
MockDate.prototype.toUTCString = Date.prototype.toUTCString;

for (var prop in Date) {
  if (Date.hasOwnProperty(prop)) {
    MockDate[prop] = Date[prop];
  }
}
