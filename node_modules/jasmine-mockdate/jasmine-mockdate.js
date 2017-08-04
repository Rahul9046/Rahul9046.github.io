(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("jasmine"));
	else if(typeof define === 'function' && define.amd)
		define(["jasmine"], factory);
	else if(typeof exports === 'object')
		exports["jasmineMockDate"] = factory(require("jasmine"));
	else
		root["jasmineMockDate"] = factory(root["jasmine"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var jasmine  = __webpack_require__(1);
	var jasmineMockDate = __webpack_require__(2);
	var MockDate = __webpack_require__(3);

	exports = module.exports = jasmineMockDate;

	exports.MockDate = MockDate;

	jasmine.Clock.useMockDate = function() {
	  if (jasmineMockDate.isInstalled()) return;

	  var spec = jasmine.getEnv().currentSpec;
	  spec.after(jasmineMockDate.uninstall);
	  jasmineMockDate.install();
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var MockDate = __webpack_require__(3);
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


	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/**
	 * Adopted from Sinon.JS
	 * https://github.com/cjohansen/Sinon.JS
	 * Copyright (c) 2010-2013 Christian Johansen
	 */

	var jasmine = __webpack_require__(1);

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

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
/******/ ])
});
;