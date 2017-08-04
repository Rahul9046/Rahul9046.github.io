var MockDate = require('./mock-date');
var Date = global.Date

var jasmineMockDate = module.exports;

jasmineMockDate.real = Date;

jasmineMockDate.install = function() {
  MockDate.baseTime = new Date().getTime();
  global.Date = MockDate;
};

jasmineMockDate.uninstall = function() {
  jasmineMockDate.assertInstalled();
  MockDate.baseTime = 0;
  global.Date = jasmineMockDate.real;
};

jasmineMockDate.isInstalled = function() {
  return global.Date === MockDate;
};

jasmineMockDate.assertInstalled = function() {
  if (!jasmineMockDate.isInstalled()) {
    throw new Error("MockDate is not installed, use jasmine.Clock.useMockDate()");
  }
};

