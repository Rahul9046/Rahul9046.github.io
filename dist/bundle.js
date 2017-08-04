/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(2);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

(function(){
    var pallete1=["#9F0F18","#00A64B","#CDA609","#094A8E"],
        pallete2=["#ff3333","#00FF7F","#ffff66","#7B68EE"],
        sequence=[],checking=[],buttons=[],audios=[],button_flash_timeouts=[],count_text_timeout=[],game_tout,current_flash,game_state=0,count=1;

    function Button(element,number){
    this.element=element;
    this.initial_fill=pallete1[number];
    this.click_fill=pallete2[number];
    }
    Button.prototype.click=function(){
        if(this.dataset.clickable==="true"){ 
            if(this.dataset.number==checking.shift()){
            audios[this.dataset.number].play();
            this.style["background-color"]=buttons[this.dataset.number].click_fill;
            (function(that){
            setTimeout(function(){
            that.style["background-color"]=buttons[that.dataset.number].initial_fill;
            },300);
            })(this);    
            clearTimeout(game_tout);
            if(checking.length!==0){//sequence is still left.
                game_tout=setTimeout(function(){
                audios[4].play();
                start_again();  
                },5000);
            }
            else{ // sequence completed
                if(document.getElementById("count_disp").value===" 20"){//user wins when completed level 20.
                stopGame();
                setTimeout(function(){
                alert("Congo!!! You Have Won....Press Start to play again");
                game_state=0;
                },600);
                }
                else{
                buttons.forEach(function(button){
                    button.element.dataset.clickable=false; //setting the clickable attribute of the buttons to false during the next sequence.
                    }); 
                    startGame();//start new level of n buttons with the first (n-1) buttons similar to last sequence.
                }
            } 
            }  
            else{
                audios[4].play();
                start_again(); //shows error and starts again in the same level(non-strict) or 1st level(strict).
            }
        }        
    }

    for(var i=0;i<4;i++){
    audios[i]=document.getElementById("audio"+i);
    buttons[i]=new Button(document.getElementById("button"+i),i);
    buttons[i].element.addEventListener("click",buttons[i].click);
    }
    audios[4]=document.getElementById("audio4");

    function start_again(){ //called when the user does any error or when the timeout finishes
            buttons.forEach(function(button){
                            button.element.dataset.clickable=false; //user cannot click the buttons when the sequence is flashing
                            });
            clearTimeout(game_tout);
            count--;
            document.getElementById("count_disp").value=" ! !";
            setTimeout(function(){
            document.getElementById("count_disp").style.color="brown";
            },100);
            setTimeout(function(){
            document.getElementById("count_disp").style.color="red";
            },400);
            setTimeout(function(){
            document.getElementById("count_disp").style.color="brown";
            },700);
            setTimeout(function(){
            document.getElementById("count_disp").style.color="red";
            },1000);
            if(document.getElementById("strict").dataset.mode=="1"){//when in strict mode,reset the initial sequence and the timeout 
                setTimeout(function(){
                stopGame();
                document.getElementById("strict_indicator").style["background-color"]="red";
                document.getElementById("strict").dataset.mode=1; 
                },1200);
                document.getElementById("count_disp").style.color="red";
                setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },1300);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
                },1700);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },2100);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
                },2500);
                setTimeout(function(){
                startGame();
                },2700);
            }
            else{
                setTimeout(function(){
                startGame();//in non-strict mode,carry on the game with the recent sequence
                },1200);
            }
    }

    function startGame(){ // gets executed for every new sequence
        var r_btn_num;// stores the random button number generated 
        for(var i=0;i<count;i++){
        if(sequence[i]==null){//empty value at that index
            r_btn_num=Math.floor(Math.random()*4);
            sequence.push(r_btn_num);
        }
        else{ // contains value from the previous sequence
            r_btn_num=sequence[i];
        }
        (function(j,k,timeouts){                    
            button_flash_timeouts[k]=setTimeout(function(){
            if(document.getElementById("toggle_btn").dataset.mode==1){ 
            audios[j].play();
            document.getElementById("count_disp").value=count>9?" "+count:" 0"+count;
            if(k===(count-1)){
                var index=0;
                buttons.forEach(function(button){//setting clickable attribute of the button to true after the flashes.
                button.element.dataset.clickable=true; 
                });
                count++;
                sequence.forEach(function(elem){
                checking[index++]=elem;
                });
                game_tout=setTimeout(function(){ //creating timeout for a sequence.gets reseted after each correct click.
                audios[4].play();
                start_again();    
                },5000);
            }
            buttons[j].element.style["background-color"]=buttons[j].click_fill;
            setTimeout(function(){
            buttons[j].element.style["background-color"]=buttons[j].initial_fill;
            },600);
            }
            },1400+1500*k);//1200ms for the count display flash,200ms wait time after the buttons start flashing,   
                        //1500*k is the wait time for button in the sequence after which it flashes for 600ms(k=0 to 3).
        })(r_btn_num,i,button_flash_timeouts);
        }
    }

    function stopGame(){  //called when the game finishes or the user stops the game from the stop button
        document.getElementById("count_disp").value=" - -";
        document.getElementById("count_disp").style.color="brown"; 
        sequence=[];
        checking=[];
        count=1;
        clearTimeout(game_tout);
        buttons.forEach(function(button){
                        button.element.dataset.clickable=false; 
                    });
        button_flash_timeouts.forEach(function(timeout){
        clearTimeout(timeout);
        });
        document.getElementById("strict_indicator").style["background-color"]="black";
        document.getElementById("strict").dataset.mode=0; 
    }
    
    document.getElementById("toggle_bg").addEventListener("click",function(){ //toggles ON/OFF button
            if(document.getElementById("toggle_btn").dataset.mode==="0"){
                document.getElementById("toggle_btn").style.float="right";
                document.getElementById("toggle_btn").dataset.mode=1;
                document.getElementById("count_disp").style.color="red";
            }
            else{
                document.getElementById("toggle_btn").style.float="left";   
                document.getElementById("toggle_btn").dataset.mode=0;
                stopGame();
            }    
    }); 

    document.getElementById("start").addEventListener("click",function(){ //executed when the user clicks the start button and the game starts. 
        if(!game_state){//checks if the start button is clicked between gameplay 
            game_state=1;
            button_flash_timeouts.forEach(function(item){
                clearTimeout(item);
            });
            if(document.getElementById("toggle_btn").dataset.mode==1){ //execute only if the button start button is set to ON.
                document.getElementById("count_disp").style.color="red";
                setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },100);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
                },400);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },700);
                setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
                },1000);
                setTimeout(function(){
                startGame();
                },1200);
            }
        }
        else{  // start button is pressed one or more times between game play  
            if(document.getElementById("toggle_btn").dataset.mode==1){ 
                button_flash_timeouts.forEach(function(item){ //clears initial timeouts of the button flashes
                clearTimeout(item);
                });
                count_text_timeout.forEach(function(item){  //clears initial timeouts of the count text flashes
                clearTimeout(item);
                });
                
                stopGame();
                count_text_timeout[0]=setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },100);
                count_text_timeout[1]=setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
                },400);
                count_text_timeout[2]=setTimeout(function(){
                document.getElementById("count_disp").style.color="brown";
                },700);
                count_text_timeout[3]=setTimeout(function(){
                document.getElementById("count_disp").style.color="red";
                },1000);
                count_text_timeout[4]=setTimeout(function(){
                startGame();
                },1200);
            }
        }
    });

    document.getElementById("strict").addEventListener("click",function(){ //toggles the strict mode.
        if(document.getElementById("toggle_btn").dataset.mode==1){
            if(document.getElementById("strict").dataset.mode==="0"){
                document.getElementById("strict_indicator").style["background-color"]="red";
                document.getElementById("strict").dataset.mode=1;  
            }
            else{
                document.getElementById("strict_indicator").style["background-color"]="black";
                document.getElementById("strict").dataset.mode=0;
            }
        }
        });
})();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {const path = __webpack_require__(3);

module.exports = {
  entry: './scripts/game.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ })
/******/ ]);