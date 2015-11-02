var $req;
(function(d, w) {
   "use strict";
   var _config = {};
   var _store = {};

   $req = function(deps, cb) {
      var dynamics = [];
      var deps = new DependencyManager(deps, _config);
      var names = [];
      deps.forEach(function(dep) {
         names.push(dep.name);
         if(!utils.inObject(dep.name, _store)) {
            dynamics.push(_storeDeps(dep.name, dep.url));
         }
      });
      new BasicDeferred().when.apply(null, dynamics)
         .then(function() {
            var toSend = [];
            names.forEach(function(name) {
               toSend.push(_store[name]);
            });
            cb.apply(this, toSend);
         })
         .fail(function(e) {
            console.log(e);
         });
   };

   $req.setConfig = function(config) {
      _config = config;
   };

   var _createScript = function() {
      var script = d.createElement('script');
      script.type = 'text/javascript'; // TODO if HTML?
      script.charset = 'utf-8';
      script.async = true;
      return script;
   };

   var _storeDeps = function(name, url) {
      var deferred = new BasicDeferred();
      var script = _createScript();
      script.src = url;
      var prevWindow = utils.shallowClone(w);
      script.addEventListener('load', function(e) {
         var node = e.currentTarget;
         var names = _windowDiffStore(prevWindow, w, name);
         if(!utils.isEmptyArray(names)) {
            names.forEach(function(n) {
               delete w[n];
            });
            deferred.resolve();
         }
         node.parentNode.removeChild(node);
      });
      script.addEventListener('error', function(e) {
         var node = e.currentTarget;
         node.parentNode.removeChild(node);
         deferred.reject("Error: " + name + " could not be loaded");
      });
      d.getElementsByTagName('head')[0].appendChild(script);
      return deferred.promise();
   };

   var _windowDiffStore = function(old, current, name) {
      var res = [];
      current = utils.shallowClone(current);
      for(var i in current) {
         if(!old[i] && !_store[name]) {
            _store[name] = current[i];
            res.push(i);
         }
      }
      return res;
   }
})(document, window);

var DependencyManager = function(arr, config) {
   "use strict";
   var queue = {};
   var executed = [];
   var data = [];
   config = config || {};

   var _addCode = function(url, name, deps, pos) {
      if(!utils.isEmptyArray(deps)) {
         deps.forEach(function(v) {
            if(executed.indexOf(v) > -1) {
               deps.slice(deps.indexOf(v), 1);
            }
         });
      }
      !utils.isEmptyArray(deps) ? _enqueue(url, name, deps, pos) : _execute(url, name, pos);
   };

   var _enqueue = function(url, name, deps, pos) {
      if(!queue[name]) {
         queue[name] = {};
         queue[name].url = url;
         queue[name].pos = pos;
         queue[name].deps = deps;
      }
   };

   var _wasDependency = function(name) {
      for(var key in queue) {
         if(queue.hasOwnProperty(key)) {
            var value = queue[key];
            var num = value.deps.indexOf(name);
            if(num > -1) {
               queue[key].deps.splice(num, 1);
               if(!queue[key].deps.length) {
                  _execute(value.url, key, value.pos);
               }
            }
         }
      }
   };

   var _execute = function(url, name, pos) {
      var d = {};
      d.name = name;
      d.url = url;
      d.pos = pos;
      data.push(d);
      if(executed.indexOf(name) == -1) executed.push(name);
      _wasDependency(name);
   };

   var originalPos = 0;
   arr.forEach(function(name) {
      var url = name;
      var deps = [];
      if(config[name]) {
         url = config[name].url || url;
         deps = config[name].deps || deps;
      }
      _addCode(url, name, deps, originalPos);
      originalPos += 1;
   });

   if(!utils.isEmptyObject(queue)) {
      executed.forEach(function(name) {
         _wasDependency(name);
      });
   }

   return data;
};

/**
 * Basic utils
 * @type {{isArray: utils.isArray, isObject: utils.isObject, isString: utils.isString, isNumber: utils.isNumber, isFunction: utils.isFunction, isEmptyObject: utils.isEmptyObject, isEmptyArray: utils.isEmptyArray, objectLen: utils.objectLen}}
 */
var utils = {
   isArray: function(x) {
      return Object.prototype.toString.call(x) == "[object Array]";
   },
   isObject: function(x) {
      return Object.prototype.toString.call(x) == "[object Object]";
   },
   isString: function(x) {
      return Object.prototype.toString.call(x) == "[object String]";
   },
   isNumber: function(x) {
      return Object.prototype.toString.call(x) == "[object Number]";
   },
   isFunction: function(x) {
      return Object.prototype.toString.call(x) == "[object Function]";
   },
   isEmptyObject: function(x) {
      return !Object.keys(x).length;
   },
   isEmptyArray: function(x) {
      return !x.length;
   },
   objectLen: function(x) {
      return Object.keys(x).length;
   },
   inObject: function(prop, obj) {
      var res = false;
      for(var key in obj) {
         if(obj.hasOwnProperty(key)) {
            if(key == prop) res = true;
            break;
         }
      }
      return res;
   },
   shallowClone: function(obj) { // bettar than deepClone if your concern is performance
      var clone = {};
      for(var i in obj) {
         clone[i] = obj[i];
      }
      return clone;
   },
   deepClone: function(obj) {
      return JSON.parse(JSON.stringify(obj));
   },
   anotherClone: function(obj) {
      return new Object(obj);
   }
};

var BasicDeferred = function(options) {
   options = options || {
         verbose: false,
         processOnFail: false
      };
   var _successStoreArr = [];
   var _failStoreArr = [];
   var _thenCount = null;
   var _doneCb;
   var _failCb;

   var _executeWhen = function(isSuccess, args, pos) {
      _thenCount--;
      if(isSuccess) {
         _successStoreArr[pos] = args[0];
      } else {
         _failStoreArr[pos] = args[0];
         if(!options.processOnFail) {
            _thenCount = false;
            _successStoreArr = [];
         }
         if(options.verbose) console.log("The argument in the position number: " + pos + " has failed");
      }

      if(!_thenCount) {
         if(_failStoreArr.length) {
            _failStoreArr = Array.prototype.slice.call(_failStoreArr);
            _failCb.apply(null, _failStoreArr);
         }
         if(_successStoreArr.length) {
            _successStoreArr = Array.prototype.slice.call(_successStoreArr);
            _doneCb.apply(null, _successStoreArr);
         }
      }
   };

   var _execute = function(callback, args) {
      args = Array.prototype.slice.call(args);
      callback.apply(null, args);
   };

   var _done = function(callback) {
      _doneCb = callback;
      return this;
   };

   var _then = function(callback) {
      _doneCb = callback;
      return this;
   };

   var _fail = function(callback) {
      _failCb = callback;
      return this;
   };

   return {
      when: function() {
         var i = _thenCount = arguments.length;
         while(i--) {
            arguments[i].self.pos = i;
            arguments[i].self.resolve = function() {
               _executeWhen(true, arguments, this.pos);
            };
            arguments[i].self.reject = function() {
               _executeWhen(false, arguments, this.pos);
            };
         }
         return {then: _then, fail: _fail, done: _done};
      },
      resolve: function() {
         _execute(_doneCb, arguments);
      },
      reject: function() {
         _execute(_failCb, arguments);
      },
      promise: function() {
         return {done: _done, fail: _fail, self: this};
      }
   };
};