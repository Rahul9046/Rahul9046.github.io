var jasmine  = require('jasmine');
var jasmineMockDate = require('./lib');
var MockDate = require('./lib/mock-date');

exports = module.exports = jasmineMockDate;

exports.MockDate = MockDate;

jasmine.Clock.useMockDate = function() {
  if (jasmineMockDate.isInstalled()) return;

  var spec = jasmine.getEnv().currentSpec;
  spec.after(jasmineMockDate.uninstall);
  jasmineMockDate.install();
};
