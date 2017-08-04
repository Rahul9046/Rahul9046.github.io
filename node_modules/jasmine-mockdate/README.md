jasmine-mockdate
================

[![Build Status](https://travis-ci.org/dwango-js/jasmine-mockdate.svg)](https://travis-ci.org/dwango-js/jasmine-mockdate)

Mock Date for Jasmine v1.3. For v2.x, use `jasmine.clock().mockDate()` instead.

```js
jasmine.Clock.useMock();
// enable MockDate
jasmine.Clock.useMockDate();

var now = new Date().getTime();
jasmine.Clock.tick(100);
// MockDate works in conjunction with tick().
expect(new Date().getTime()).toEqual(now + 100);
```

## Installation

```sh
$ npm install jasmine-mockdate
```

## License

MIT
