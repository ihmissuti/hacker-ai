// Brain.js MIT License

// Copyright (c) 2010-2019 Heather Arthur

// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:

// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.brain = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var setGlobal = function (key, value) {
	  try {
	    createNonEnumerableProperty(global_1, key, value);
	  } catch (error) {
	    global_1[key] = value;
	  } return value;
	};

	var SHARED = '__core-js_shared__';
	var store = global_1[SHARED] || setGlobal(SHARED, {});

	var sharedStore = store;

	var functionToString = Function.toString;

	// this helper broken in `3.4.1-3.4.4`, so we can't use `shared` helper
	if (typeof sharedStore.inspectSource != 'function') {
	  sharedStore.inspectSource = function (it) {
	    return functionToString.call(it);
	  };
	}

	var inspectSource = sharedStore.inspectSource;

	var WeakMap = global_1.WeakMap;

	var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

	var shared = createCommonjsModule(function (module) {
	(module.exports = function (key, value) {
	  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
	})('versions', []).push({
	  version: '3.6.5',
	  mode:  'global',
	  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
	});
	});

	var id = 0;
	var postfix = Math.random();

	var uid = function (key) {
	  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
	};

	var keys = shared('keys');

	var sharedKey = function (key) {
	  return keys[key] || (keys[key] = uid(key));
	};

	var hiddenKeys = {};

	var WeakMap$1 = global_1.WeakMap;
	var set, get, has$1;

	var enforce = function (it) {
	  return has$1(it) ? get(it) : set(it, {});
	};

	var getterFor = function (TYPE) {
	  return function (it) {
	    var state;
	    if (!isObject(it) || (state = get(it)).type !== TYPE) {
	      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
	    } return state;
	  };
	};

	if (nativeWeakMap) {
	  var store$1 = new WeakMap$1();
	  var wmget = store$1.get;
	  var wmhas = store$1.has;
	  var wmset = store$1.set;
	  set = function (it, metadata) {
	    wmset.call(store$1, it, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return wmget.call(store$1, it) || {};
	  };
	  has$1 = function (it) {
	    return wmhas.call(store$1, it);
	  };
	} else {
	  var STATE = sharedKey('state');
	  hiddenKeys[STATE] = true;
	  set = function (it, metadata) {
	    createNonEnumerableProperty(it, STATE, metadata);
	    return metadata;
	  };
	  get = function (it) {
	    return has(it, STATE) ? it[STATE] : {};
	  };
	  has$1 = function (it) {
	    return has(it, STATE);
	  };
	}

	var internalState = {
	  set: set,
	  get: get,
	  has: has$1,
	  enforce: enforce,
	  getterFor: getterFor
	};

	var redefine = createCommonjsModule(function (module) {
	var getInternalState = internalState.get;
	var enforceInternalState = internalState.enforce;
	var TEMPLATE = String(String).split('String');

	(module.exports = function (O, key, value, options) {
	  var unsafe = options ? !!options.unsafe : false;
	  var simple = options ? !!options.enumerable : false;
	  var noTargetGet = options ? !!options.noTargetGet : false;
	  if (typeof value == 'function') {
	    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
	    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
	  }
	  if (O === global_1) {
	    if (simple) O[key] = value;
	    else setGlobal(key, value);
	    return;
	  } else if (!unsafe) {
	    delete O[key];
	  } else if (!noTargetGet && O[key]) {
	    simple = true;
	  }
	  if (simple) O[key] = value;
	  else createNonEnumerableProperty(O, key, value);
	// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
	})(Function.prototype, 'toString', function toString() {
	  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
	});
	});

	var path = global_1;

	var aFunction = function (variable) {
	  return typeof variable == 'function' ? variable : undefined;
	};

	var getBuiltIn = function (namespace, method) {
	  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
	    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
	};

	var ceil = Math.ceil;
	var floor = Math.floor;

	// `ToInteger` abstract operation
	// https://tc39.github.io/ecma262/#sec-tointeger
	var toInteger = function (argument) {
	  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
	};

	var min = Math.min;

	// `ToLength` abstract operation
	// https://tc39.github.io/ecma262/#sec-tolength
	var toLength = function (argument) {
	  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
	};

	var max = Math.max;
	var min$1 = Math.min;

	// Helper for a popular repeating case of the spec:
	// Let integer be ? ToInteger(index).
	// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
	var toAbsoluteIndex = function (index, length) {
	  var integer = toInteger(index);
	  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
	};

	// `Array.prototype.{ indexOf, includes }` methods implementation
	var createMethod = function (IS_INCLUDES) {
	  return function ($this, el, fromIndex) {
	    var O = toIndexedObject($this);
	    var length = toLength(O.length);
	    var index = toAbsoluteIndex(fromIndex, length);
	    var value;
	    // Array#includes uses SameValueZero equality algorithm
	    // eslint-disable-next-line no-self-compare
	    if (IS_INCLUDES && el != el) while (length > index) {
	      value = O[index++];
	      // eslint-disable-next-line no-self-compare
	      if (value != value) return true;
	    // Array#indexOf ignores holes, Array#includes - not
	    } else for (;length > index; index++) {
	      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

	var arrayIncludes = {
	  // `Array.prototype.includes` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.includes
	  includes: createMethod(true),
	  // `Array.prototype.indexOf` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.indexof
	  indexOf: createMethod(false)
	};

	var indexOf = arrayIncludes.indexOf;


	var objectKeysInternal = function (object, names) {
	  var O = toIndexedObject(object);
	  var i = 0;
	  var result = [];
	  var key;
	  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while (names.length > i) if (has(O, key = names[i++])) {
	    ~indexOf(result, key) || result.push(key);
	  }
	  return result;
	};

	// IE8- don't enum bug keys
	var enumBugKeys = [
	  'constructor',
	  'hasOwnProperty',
	  'isPrototypeOf',
	  'propertyIsEnumerable',
	  'toLocaleString',
	  'toString',
	  'valueOf'
	];

	var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');

	// `Object.getOwnPropertyNames` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertynames
	var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
	  return objectKeysInternal(O, hiddenKeys$1);
	};

	var objectGetOwnPropertyNames = {
		f: f$3
	};


	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
	  if (GLOBAL) {
	    target = global_1;
	  } else if (STATIC) {
	    target = global_1[TARGET] || setGlobal(TARGET, {});
	  } else {
	    target = (global_1[TARGET] || {}).prototype;
	  }
	  if (target) for (key in source) {
	    sourceProperty = source[key];
	    if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(target, key);
	      targetProperty = descriptor && descriptor.value;
	    } else targetProperty = target[key];
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contained in target
	    if (!FORCED && targetProperty !== undefined) {
	      if (typeof sourceProperty === typeof targetProperty) continue;
	      copyConstructorProperties(sourceProperty, targetProperty);
	    }
	    // add a flag to not completely full polyfills
	    if (options.sham || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(sourceProperty, 'sham', true);
	    }
	    // extend global
	    redefine(target, key, sourceProperty, options);
	  }
	};


	// `IsArray` abstract operation
	// https://tc39.github.io/ecma262/#sec-isarray
	var isArray = Array.isArray || function isArray(arg) {
	  return classofRaw(arg) == 'Array';
	};

	// `ToObject` abstract operation
	// https://tc39.github.io/ecma262/#sec-toobject
	var toObject = function (argument) {
	  return Object(requireObjectCoercible(argument));
	};

	var createProperty = function (object, key, value) {
	  var propertyKey = toPrimitive(key);
	  if (propertyKey in object) objectDefineProperty.f(object, propertyKey, createPropertyDescriptor(0, value));
	  else object[propertyKey] = value;
	};

	var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
	  // Chrome 38 Symbol has incorrect toString conversion
	  // eslint-disable-next-line no-undef
	  return !String(Symbol());
	});

	var useSymbolAsUid = nativeSymbol
	  // eslint-disable-next-line no-undef
	  && !Symbol.sham
	  // eslint-disable-next-line no-undef
	  && typeof Symbol.iterator == 'symbol';

	var WellKnownSymbolsStore = shared('wks');
	var Symbol$1 = global_1.Symbol;
	var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;

	var wellKnownSymbol = function (name) {
	  if (!has(WellKnownSymbolsStore, name)) {
	    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
	    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
	  } return WellKnownSymbolsStore[name];
	};

	var SPECIES = wellKnownSymbol('species');

	// `ArraySpeciesCreate` abstract operation
	// https://tc39.github.io/ecma262/#sec-arrayspeciescreate
	var arraySpeciesCreate = function (originalArray, length) {
	  var C;
	  if (isArray(originalArray)) {
	    C = originalArray.constructor;
	    // cross-realm fallback
	    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
	    else if (isObject(C)) {
	      C = C[SPECIES];
	      if (C === null) C = undefined;
	    }
	  } return new (C === undefined ? Array : C)(length === 0 ? 0 : length);
	};

	var engineUserAgent = getBuiltIn('navigator', 'userAgent') || '';

	var process = global_1.process;
	var versions = process && process.versions;
	var v8 = versions && versions.v8;
	var match, version;

	if (v8) {
	  match = v8.split('.');
	  version = match[0] + match[1];
	} else if (engineUserAgent) {
	  match = engineUserAgent.match(/Edge\/(\d+)/);
	  if (!match || match[1] >= 74) {
	    match = engineUserAgent.match(/Chrome\/(\d+)/);
	    if (match) version = match[1];
	  }
	}

	var engineV8Version = version && +version;

	var SPECIES$1 = wellKnownSymbol('species');

	var arrayMethodHasSpeciesSupport = function (METHOD_NAME) {
	  // We can't use this feature detection in V8 since it causes
	  // deoptimization and serious performance degradation
	  // https://github.com/zloirock/core-js/issues/677
	  return engineV8Version >= 51 || !fails(function () {
	    var array = [];
	    var constructor = array.constructor = {};
	    constructor[SPECIES$1] = function () {
	      return { foo: 1 };
	    };
	    return array[METHOD_NAME](Boolean).foo !== 1;
	  });
	};




	var aFunction$1 = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction$1(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var push = [].push;

	// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex }` methods implementation
	var createMethod$1 = function (TYPE) {
	  var IS_MAP = TYPE == 1;
	  var IS_FILTER = TYPE == 2;
	  var IS_SOME = TYPE == 3;
	  var IS_EVERY = TYPE == 4;
	  var IS_FIND_INDEX = TYPE == 6;
	  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
	  return function ($this, callbackfn, that, specificCreate) {
	    var O = toObject($this);
	    var self = indexedObject(O);
	    var boundFunction = functionBindContext(callbackfn, that, 3);
	    var length = toLength(self.length);
	    var index = 0;
	    var create = specificCreate || arraySpeciesCreate;
	    var target = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
	    var value, result;
	    for (;length > index; index++) if (NO_HOLES || index in self) {
	      value = self[index];
	      result = boundFunction(value, index, O);
	      if (TYPE) {
	        if (IS_MAP) target[index] = result; // map
	        else if (result) switch (TYPE) {
	          case 3: return true;              // some
	          case 5: return value;             // find
	          case 6: return index;             // findIndex
	          case 2: push.call(target, value); // filter
	        } else if (IS_EVERY) return false;  // every
	      }
	    }
	    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
	  };
	};

	var arrayIteration = {
	  // `Array.prototype.forEach` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	  forEach: createMethod$1(0),
	  // `Array.prototype.map` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.map
	  map: createMethod$1(1),
	  // `Array.prototype.filter` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.filter
	  filter: createMethod$1(2),
	  // `Array.prototype.some` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.some
	  some: createMethod$1(3),
	  // `Array.prototype.every` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.every
	  every: createMethod$1(4),
	  // `Array.prototype.find` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.find
	  find: createMethod$1(5),
	  // `Array.prototype.findIndex` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.findIndex
	  findIndex: createMethod$1(6)
	};

	var arrayMethodIsStrict = function (METHOD_NAME, argument) {
	  var method = [][METHOD_NAME];
	  return !!method && fails(function () {
	    // eslint-disable-next-line no-useless-call,no-throw-literal
	    method.call(null, argument || function () { throw 1; }, 1);
	  });
	};

	var defineProperty = Object.defineProperty;
	var cache = {};

	var thrower = function (it) { throw it; };

	var arrayMethodUsesToLength = function (METHOD_NAME, options) {
	  if (has(cache, METHOD_NAME)) return cache[METHOD_NAME];
	  if (!options) options = {};
	  var method = [][METHOD_NAME];
	  var ACCESSORS = has(options, 'ACCESSORS') ? options.ACCESSORS : false;
	  var argument0 = has(options, 0) ? options[0] : thrower;
	  var argument1 = has(options, 1) ? options[1] : undefined;

	  return cache[METHOD_NAME] = !!method && !fails(function () {
	    if (ACCESSORS && !descriptors) return true;
	    var O = { length: -1 };

	    if (ACCESSORS) defineProperty(O, 1, { enumerable: true, get: thrower });
	    else O[1] = 1;

	    method.call(O, argument0, argument1);
	  });
	};

	var $forEach = arrayIteration.forEach;



	var STRICT_METHOD = arrayMethodIsStrict('forEach');
	var USES_TO_LENGTH = arrayMethodUsesToLength('forEach');

	// `Array.prototype.forEach` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	var arrayForEach = (!STRICT_METHOD || !USES_TO_LENGTH) ? function forEach(callbackfn /* , thisArg */) {
	  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	} : [].forEach;

	// `Array.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.foreach
	_export({ target: 'Array', proto: true, forced: [].forEach != arrayForEach }, {
	  forEach: arrayForEach
	});

	// `Array.prototype.{ reduce, reduceRight }` methods implementation
	var createMethod$2 = function (IS_RIGHT) {
	  return function (that, callbackfn, argumentsLength, memo) {
	    aFunction$1(callbackfn);
	    var O = toObject(that);
	    var self = indexedObject(O);
	    var length = toLength(O.length);
	    var index = IS_RIGHT ? length - 1 : 0;
	    var i = IS_RIGHT ? -1 : 1;
	    if (argumentsLength < 2) while (true) {
	      if (index in self) {
	        memo = self[index];
	        index += i;
	        break;
	      }
	      index += i;
	      if (IS_RIGHT ? index < 0 : length <= index) {
	        throw TypeError('Reduce of empty array with no initial value');
	      }
	    }
	    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
	      memo = callbackfn(memo, self[index], index, O);
	    }
	    return memo;
	  };
	};

	var arrayReduce = {
	  // `Array.prototype.reduce` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduce
	  left: createMethod$2(false),
	  // `Array.prototype.reduceRight` method
	  // https://tc39.github.io/ecma262/#sec-array.prototype.reduceright
	  right: createMethod$2(true)
	};

	var $reduce = arrayReduce.left;



	

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	var objectKeys = Object.keys || function keys(O) {
	  return objectKeysInternal(O, enumBugKeys);
	};

	var nativeAssign = Object.assign;
	var defineProperty$1 = Object.defineProperty;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	var objectAssign = !nativeAssign || fails(function () {
	  // should have correct order of operations (Edge bug)
	  if (descriptors && nativeAssign({ b: 1 }, nativeAssign(defineProperty$1({}, 'a', {
	    enumerable: true,
	    get: function () {
	      defineProperty$1(this, 'b', {
	        value: 3,
	        enumerable: false
	      });
	    }
	  }), { b: 2 })).b !== 1) return true;
	  // should work with symbols and should have deterministic property order (V8 bug)
	  var A = {};
	  var B = {};
	  // eslint-disable-next-line no-undef
	  var symbol = Symbol();
	  var alphabet = 'abcdefghijklmnopqrst';
	  A[symbol] = 7;
	  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
	  return nativeAssign({}, A)[symbol] != 7 || objectKeys(nativeAssign({}, B)).join('') != alphabet;
	}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
	  var T = toObject(target);
	  var argumentsLength = arguments.length;
	  var index = 1;
	  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
	  var propertyIsEnumerable = objectPropertyIsEnumerable.f;
	  while (argumentsLength > index) {
	    var S = indexedObject(arguments[index++]);
	    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
	    var length = keys.length;
	    var j = 0;
	    var key;
	    while (length > j) {
	      key = keys[j++];
	      if (!descriptors || propertyIsEnumerable.call(S, key)) T[key] = S[key];
	    }
	  } return T;
	} : nativeAssign;

	// `Object.assign` method
	// https://tc39.github.io/ecma262/#sec-object.assign
	_export({ target: 'Object', stat: true, forced: Object.assign !== objectAssign }, {
	  assign: objectAssign
	});

	var FAILS_ON_PRIMITIVES = fails(function () { objectKeys(1); });

	// `Object.keys` method
	// https://tc39.github.io/ecma262/#sec-object.keys
	_export({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
	  keys: function keys(it) {
	    return objectKeys(toObject(it));
	  }
	});

	// iterable DOM collections
	// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
	var domIterables = {
	  CSSRuleList: 0,
	  CSSStyleDeclaration: 0,
	  CSSValueList: 0,
	  ClientRectList: 0,
	  DOMRectList: 0,
	  DOMStringList: 0,
	  DOMTokenList: 1,
	  DataTransferItemList: 0,
	  FileList: 0,
	  HTMLAllCollection: 0,
	  HTMLCollection: 0,
	  HTMLFormElement: 0,
	  HTMLSelectElement: 0,
	  MediaList: 0,
	  MimeTypeArray: 0,
	  NamedNodeMap: 0,
	  NodeList: 1,
	  PaintRequestList: 0,
	  Plugin: 0,
	  PluginArray: 0,
	  SVGLengthList: 0,
	  SVGNumberList: 0,
	  SVGPathSegList: 0,
	  SVGPointList: 0,
	  SVGStringList: 0,
	  SVGTransformList: 0,
	  SourceBufferList: 0,
	  StyleSheetList: 0,
	  TextTrackCueList: 0,
	  TextTrackList: 0,
	  TouchList: 0
	};

	for (var COLLECTION_NAME in domIterables) {
	  var Collection = global_1[COLLECTION_NAME];
	  var CollectionPrototype = Collection && Collection.prototype;
	  // some Chrome versions have non-configurable methods on DOMTokenList
	  if (CollectionPrototype && CollectionPrototype.forEach !== arrayForEach) try {
	    createNonEnumerableProperty(CollectionPrototype, 'forEach', arrayForEach);
	  } catch (error) {
	    CollectionPrototype.forEach = arrayForEach;
	  }
	}

	// `URL.prototype.toJSON` method
	// https://url.spec.whatwg.org/#dom-url-tojson
	_export({ target: 'URL', proto: true, enumerable: true }, {
	  toJSON: function toJSON() {
	    return URL.prototype.toString.call(this);
	  }
	});

	function _typeof(obj) {
	  "@babel/helpers - typeof";

	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _classCallCheck(instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	}

	function _defineProperties(target, props) {
	  for (var i = 0; i < props.length; i++) {
	    var descriptor = props[i];
	    descriptor.enumerable = descriptor.enumerable || false;
	    descriptor.configurable = true;
	    if ("value" in descriptor) descriptor.writable = true;
	    Object.defineProperty(target, descriptor.key, descriptor);
	  }
	}

	function _createClass(Constructor, protoProps, staticProps) {
	  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
	  if (staticProps) _defineProperties(Constructor, staticProps);
	  return Constructor;
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function ownKeys$1(object, enumerableOnly) {
	  var keys = Object.keys(object);

	  if (Object.getOwnPropertySymbols) {
	    var symbols = Object.getOwnPropertySymbols(object);
	    if (enumerableOnly) symbols = symbols.filter(function (sym) {
	      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
	    });
	    keys.push.apply(keys, symbols);
	  }

	  return keys;
	}

	function _objectSpread2(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};

	    if (i % 2) {
	      ownKeys$1(Object(source), true).forEach(function (key) {
	        _defineProperty(target, key, source[key]);
	      });
	    } else if (Object.getOwnPropertyDescriptors) {
	      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
	    } else {
	      ownKeys$1(Object(source)).forEach(function (key) {
	        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
	      });
	    }
	  }

	  return target;
	}

	function _inherits(subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function");
	  }

	  subClass.prototype = Object.create(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf(subClass, superClass);
	}

	function _getPrototypeOf(o) {
	  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
	    return o.__proto__ || Object.getPrototypeOf(o);
	  };
	  return _getPrototypeOf(o);
	}




	// `Array.prototype.fill` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.fill
	var arrayFill = function fill(value /* , start = 0, end = @length */) {
	  var O = toObject(this);
	  var length = toLength(O.length);
	  var argumentsLength = arguments.length;
	  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
	  var end = argumentsLength > 2 ? arguments[2] : undefined;
	  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
	  while (endPos > index) O[index++] = value;
	  return O;
	};

	// `Object.defineProperties` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperties
	var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
	  anObject(O);
	  var keys = objectKeys(Properties);
	  var length = keys.length;
	  var index = 0;
	  var key;
	  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
	  return O;
	};

	var html = getBuiltIn('document', 'documentElement');

	var GT = '>';
	var LT = '<';
	var PROTOTYPE = 'prototype';
	var SCRIPT = 'script';
	var IE_PROTO = sharedKey('IE_PROTO');

	var EmptyConstructor = function () { /* empty */ };

	var scriptTag = function (content) {
	  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
	};

	// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
	var NullProtoObjectViaActiveX = function (activeXDocument) {
	  activeXDocument.write(scriptTag(''));
	  activeXDocument.close();
	  var temp = activeXDocument.parentWindow.Object;
	  activeXDocument = null; // avoid memory leak
	  return temp;
	};

	
	// Check for document.domain and active x support
	// No need to use active x approach when document.domain is not set
	// see https://github.com/es-shims/es5-shim/issues/150
	// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
	// avoid IE GC bug
	var activeXDocument;
	var NullProtoObject = function () {
	  try {
	    /* global ActiveXObject */
	    activeXDocument = document.domain && new ActiveXObject('htmlfile');
	  } catch (error) { /* ignore */ }
	  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
	  var length = enumBugKeys.length;
	  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
	  return NullProtoObject();
	};

	hiddenKeys[IE_PROTO] = true;

	// `Object.create` method
	// https://tc39.github.io/ecma262/#sec-object.create
	var objectCreate = Object.create || function create(O, Properties) {
	  var result;
	  if (O !== null) {
	    EmptyConstructor[PROTOTYPE] = anObject(O);
	    result = new EmptyConstructor();
	    EmptyConstructor[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = NullProtoObject();
	  return Properties === undefined ? result : objectDefineProperties(result, Properties);
	};

	var UNSCOPABLES = wellKnownSymbol('unscopables');
	var ArrayPrototype = Array.prototype;

	// Array.prototype[@@unscopables]
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	if (ArrayPrototype[UNSCOPABLES] == undefined) {
	  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
	    configurable: true,
	    value: objectCreate(null)
	  });
	}

	// add a key to Array.prototype[@@unscopables]
	var addToUnscopables = function (key) {
	  ArrayPrototype[UNSCOPABLES][key] = true;
	};

	// `Array.prototype.fill` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.fill
	_export({ target: 'Array', proto: true }, {
	  fill: arrayFill
	});

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('fill');

	var iterators = {};

	var correctPrototypeGetter = !fails(function () {
	  function F() { /* empty */ }
	  F.prototype.constructor = null;
	  return Object.getPrototypeOf(new F()) !== F.prototype;
	});

	var IE_PROTO$1 = sharedKey('IE_PROTO');
	var ObjectPrototype = Object.prototype;

	// `Object.getPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.getprototypeof
	var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
	  O = toObject(O);
	  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
	  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectPrototype : null;
	};

	var ITERATOR = wellKnownSymbol('iterator');
	var BUGGY_SAFARI_ITERATORS = false;

	var returnThis = function () { return this; };

	// `%IteratorPrototype%` object
	// https://tc39.github.io/ecma262/#sec-%iteratorprototype%-object
	var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

	if ([].keys) {
	  arrayIterator = [].keys();
	  // Safari 8 has buggy iterators w/o `next`
	  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
	  else {
	    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
	    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
	  }
	}

	if (IteratorPrototype == undefined) IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	if ( !has(IteratorPrototype, ITERATOR)) {
	  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
	}

	var iteratorsCore = {
	  IteratorPrototype: IteratorPrototype,
	  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
	};

	var defineProperty$2 = objectDefineProperty.f;



	var TO_STRING_TAG = wellKnownSymbol('toStringTag');

	var setToStringTag = function (it, TAG, STATIC) {
	  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
	    defineProperty$2(it, TO_STRING_TAG, { configurable: true, value: TAG });
	  }
	};

	var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;





	var returnThis$1 = function () { return this; };

	var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
	  var TO_STRING_TAG = NAME + ' Iterator';
	  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
	  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
	  iterators[TO_STRING_TAG] = returnThis$1;
	  return IteratorConstructor;
	};

	var aPossiblePrototype = function (it) {
	  if (!isObject(it) && it !== null) {
	    throw TypeError("Can't set " + String(it) + ' as a prototype');
	  } return it;
	};

	// `Object.setPrototypeOf` method
	// https://tc39.github.io/ecma262/#sec-object.setprototypeof
	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
	  var CORRECT_SETTER = false;
	  var test = {};
	  var setter;
	  try {
	    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
	    setter.call(test, []);
	    CORRECT_SETTER = test instanceof Array;
	  } catch (error) { /* empty */ }
	  return function setPrototypeOf(O, proto) {
	    anObject(O);
	    aPossiblePrototype(proto);
	    if (CORRECT_SETTER) setter.call(O, proto);
	    else O.__proto__ = proto;
	    return O;
	  };
	}() : undefined);

	var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
	var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
	var ITERATOR$1 = wellKnownSymbol('iterator');
	var KEYS = 'keys';
	var VALUES = 'values';
	var ENTRIES = 'entries';

	var returnThis$2 = function () { return this; };

	var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
	  createIteratorConstructor(IteratorConstructor, NAME, next);

	  var getIterationMethod = function (KIND) {
	    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
	    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
	    switch (KIND) {
	      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
	      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
	      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
	    } return function () { return new IteratorConstructor(this); };
	  };

	  var TO_STRING_TAG = NAME + ' Iterator';
	  var INCORRECT_VALUES_NAME = false;
	  var IterablePrototype = Iterable.prototype;
	  var nativeIterator = IterablePrototype[ITERATOR$1]
	    || IterablePrototype['@@iterator']
	    || DEFAULT && IterablePrototype[DEFAULT];
	  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
	  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
	  var CurrentIteratorPrototype, methods, KEY;

	  // fix native
	  if (anyNativeIterator) {
	    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
	    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
	      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
	        if (objectSetPrototypeOf) {
	          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
	        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
	          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis$2);
	        }
	      }
	      // Set @@toStringTag to native iterators
	      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
	    }
	  }

	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
	    INCORRECT_VALUES_NAME = true;
	    defaultIterator = function values() { return nativeIterator.call(this); };
	  }

	  // define iterator
	  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
	    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
	  }
	  iterators[NAME] = defaultIterator;

	  // export additional methods
	  if (DEFAULT) {
	    methods = {
	      values: getIterationMethod(VALUES),
	      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
	      entries: getIterationMethod(ENTRIES)
	    };
	    if (FORCED) for (KEY in methods) {
	      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
	        redefine(IterablePrototype, KEY, methods[KEY]);
	      }
	    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
	  }

	  return methods;
	};

	var ARRAY_ITERATOR = 'Array Iterator';
	var setInternalState = internalState.set;
	var getInternalState = internalState.getterFor(ARRAY_ITERATOR);

	// `Array.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.entries
	// `Array.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.keys
	// `Array.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.values
	// `Array.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-array.prototype-@@iterator
	// `CreateArrayIterator` internal method
	// https://tc39.github.io/ecma262/#sec-createarrayiterator
	var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
	  setInternalState(this, {
	    type: ARRAY_ITERATOR,
	    target: toIndexedObject(iterated), // target
	    index: 0,                          // next index
	    kind: kind                         // kind
	  });
	// `%ArrayIteratorPrototype%.next` method
	// https://tc39.github.io/ecma262/#sec-%arrayiteratorprototype%.next
	}, function () {
	  var state = getInternalState(this);
	  var target = state.target;
	  var kind = state.kind;
	  var index = state.index++;
	  if (!target || index >= target.length) {
	    state.target = undefined;
	    return { value: undefined, done: true };
	  }
	  if (kind == 'keys') return { value: index, done: false };
	  if (kind == 'values') return { value: target[index], done: false };
	  return { value: [index, target[index]], done: false };
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values%
	// https://tc39.github.io/ecma262/#sec-createunmappedargumentsobject
	// https://tc39.github.io/ecma262/#sec-createmappedargumentsobject
	iterators.Arguments = iterators.Array;

	// https://tc39.github.io/ecma262/#sec-array.prototype-@@unscopables
	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

	var $map = arrayIteration.map;



	var HAS_SPECIES_SUPPORT$2 = arrayMethodHasSpeciesSupport('map');
	// FF49- issue
	var USES_TO_LENGTH$4 = arrayMethodUsesToLength('map');

	// `Array.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.map
	// with adding support of @@species
	_export({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT$2 || !USES_TO_LENGTH$4 }, {
	  map: function map(callbackfn /* , thisArg */) {
	    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  }
	});

	var arrayBufferNative = typeof ArrayBuffer !== 'undefined' && typeof DataView !== 'undefined';

	var redefineAll = function (target, src, options) {
	  for (var key in src) redefine(target, key, src[key], options);
	  return target;
	};

	var anInstance = function (it, Constructor, name) {
	  if (!(it instanceof Constructor)) {
	    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
	  } return it;
	};

	// `ToIndex` abstract operation
	// https://tc39.github.io/ecma262/#sec-toindex
	var toIndex = function (it) {
	  if (it === undefined) return 0;
	  var number = toInteger(it);
	  var length = toLength(number);
	  if (number !== length) throw RangeError('Wrong length or index');
	  return length;
	};

	// IEEE754 conversions based on https://github.com/feross/ieee754
	// eslint-disable-next-line no-shadow-restricted-names
	var Infinity$1 = 1 / 0;
	var abs = Math.abs;
	var pow = Math.pow;
	var floor$1 = Math.floor;
	var log = Math.log;
	var LN2 = Math.LN2;

	var pack = function (number, mantissaLength, bytes) {
	  var buffer = new Array(bytes);
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var rt = mantissaLength === 23 ? pow(2, -24) - pow(2, -77) : 0;
	  var sign = number < 0 || number === 0 && 1 / number < 0 ? 1 : 0;
	  var index = 0;
	  var exponent, mantissa, c;
	  number = abs(number);
	  // eslint-disable-next-line no-self-compare
	  if (number != number || number === Infinity$1) {
	    // eslint-disable-next-line no-self-compare
	    mantissa = number != number ? 1 : 0;
	    exponent = eMax;
	  } else {
	    exponent = floor$1(log(number) / LN2);
	    if (number * (c = pow(2, -exponent)) < 1) {
	      exponent--;
	      c *= 2;
	    }
	    if (exponent + eBias >= 1) {
	      number += rt / c;
	    } else {
	      number += rt * pow(2, 1 - eBias);
	    }
	    if (number * c >= 2) {
	      exponent++;
	      c /= 2;
	    }
	    if (exponent + eBias >= eMax) {
	      mantissa = 0;
	      exponent = eMax;
	    } else if (exponent + eBias >= 1) {
	      mantissa = (number * c - 1) * pow(2, mantissaLength);
	      exponent = exponent + eBias;
	    } else {
	      mantissa = number * pow(2, eBias - 1) * pow(2, mantissaLength);
	      exponent = 0;
	    }
	  }
	  for (; mantissaLength >= 8; buffer[index++] = mantissa & 255, mantissa /= 256, mantissaLength -= 8);
	  exponent = exponent << mantissaLength | mantissa;
	  exponentLength += mantissaLength;
	  for (; exponentLength > 0; buffer[index++] = exponent & 255, exponent /= 256, exponentLength -= 8);
	  buffer[--index] |= sign * 128;
	  return buffer;
	};

	var unpack = function (buffer, mantissaLength) {
	  var bytes = buffer.length;
	  var exponentLength = bytes * 8 - mantissaLength - 1;
	  var eMax = (1 << exponentLength) - 1;
	  var eBias = eMax >> 1;
	  var nBits = exponentLength - 7;
	  var index = bytes - 1;
	  var sign = buffer[index--];
	  var exponent = sign & 127;
	  var mantissa;
	  sign >>= 7;
	  for (; nBits > 0; exponent = exponent * 256 + buffer[index], index--, nBits -= 8);
	  mantissa = exponent & (1 << -nBits) - 1;
	  exponent >>= -nBits;
	  nBits += mantissaLength;
	  for (; nBits > 0; mantissa = mantissa * 256 + buffer[index], index--, nBits -= 8);
	  if (exponent === 0) {
	    exponent = 1 - eBias;
	  } else if (exponent === eMax) {
	    return mantissa ? NaN : sign ? -Infinity$1 : Infinity$1;
	  } else {
	    mantissa = mantissa + pow(2, mantissaLength);
	    exponent = exponent - eBias;
	  } return (sign ? -1 : 1) * mantissa * pow(2, exponent - mantissaLength);
	};

	var ieee754 = {
	  pack: pack,
	  unpack: unpack
	};

	var getOwnPropertyNames = objectGetOwnPropertyNames.f;
	var defineProperty$3 = objectDefineProperty.f;




	var getInternalState$1 = internalState.get;
	var setInternalState$1 = internalState.set;
	var ARRAY_BUFFER = 'ArrayBuffer';
	var DATA_VIEW = 'DataView';
	var PROTOTYPE$1 = 'prototype';
	var WRONG_LENGTH = 'Wrong length';
	var WRONG_INDEX = 'Wrong index';
	var NativeArrayBuffer = global_1[ARRAY_BUFFER];
	var $ArrayBuffer = NativeArrayBuffer;
	var $DataView = global_1[DATA_VIEW];
	var $DataViewPrototype = $DataView && $DataView[PROTOTYPE$1];
	var ObjectPrototype$1 = Object.prototype;
	var RangeError$1 = global_1.RangeError;

	var packIEEE754 = ieee754.pack;
	var unpackIEEE754 = ieee754.unpack;

	var packInt8 = function (number) {
	  return [number & 0xFF];
	};

	var packInt16 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF];
	};

	var packInt32 = function (number) {
	  return [number & 0xFF, number >> 8 & 0xFF, number >> 16 & 0xFF, number >> 24 & 0xFF];
	};

	var unpackInt32 = function (buffer) {
	  return buffer[3] << 24 | buffer[2] << 16 | buffer[1] << 8 | buffer[0];
	};

	var packFloat32 = function (number) {
	  return packIEEE754(number, 23, 4);
	};

	var packFloat64 = function (number) {
	  return packIEEE754(number, 52, 8);
	};

	var addGetter = function (Constructor, key) {
	  defineProperty$3(Constructor[PROTOTYPE$1], key, { get: function () { return getInternalState$1(this)[key]; } });
	};

	var get$1 = function (view, count, index, isLittleEndian) {
	  var intIndex = toIndex(index);
	  var store = getInternalState$1(view);
	  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
	  var bytes = getInternalState$1(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = bytes.slice(start, start + count);
	  return isLittleEndian ? pack : pack.reverse();
	};

	var set$1 = function (view, count, index, conversion, value, isLittleEndian) {
	  var intIndex = toIndex(index);
	  var store = getInternalState$1(view);
	  if (intIndex + count > store.byteLength) throw RangeError$1(WRONG_INDEX);
	  var bytes = getInternalState$1(store.buffer).bytes;
	  var start = intIndex + store.byteOffset;
	  var pack = conversion(+value);
	  for (var i = 0; i < count; i++) bytes[start + i] = pack[isLittleEndian ? i : count - i - 1];
	};

	if (!arrayBufferNative) {
	  $ArrayBuffer = function ArrayBuffer(length) {
	    anInstance(this, $ArrayBuffer, ARRAY_BUFFER);
	    var byteLength = toIndex(length);
	    setInternalState$1(this, {
	      bytes: arrayFill.call(new Array(byteLength), 0),
	      byteLength: byteLength
	    });
	    if (!descriptors) this.byteLength = byteLength;
	  };

	  $DataView = function DataView(buffer, byteOffset, byteLength) {
	    anInstance(this, $DataView, DATA_VIEW);
	    anInstance(buffer, $ArrayBuffer, DATA_VIEW);
	    var bufferLength = getInternalState$1(buffer).byteLength;
	    var offset = toInteger(byteOffset);
	    if (offset < 0 || offset > bufferLength) throw RangeError$1('Wrong offset');
	    byteLength = byteLength === undefined ? bufferLength - offset : toLength(byteLength);
	    if (offset + byteLength > bufferLength) throw RangeError$1(WRONG_LENGTH);
	    setInternalState$1(this, {
	      buffer: buffer,
	      byteLength: byteLength,
	      byteOffset: offset
	    });
	    if (!descriptors) {
	      this.buffer = buffer;
	      this.byteLength = byteLength;
	      this.byteOffset = offset;
	    }
	  };


	  // WebKit bug - the same parent prototype for typed arrays and data view
	  if (objectSetPrototypeOf && objectGetPrototypeOf($DataViewPrototype) !== ObjectPrototype$1) {
	    objectSetPrototypeOf($DataViewPrototype, ObjectPrototype$1);
	  }

	  // iOS Safari 7.x bug
	  var testView = new $DataView(new $ArrayBuffer(2));
	  var nativeSetInt8 = $DataViewPrototype.setInt8;
	  testView.setInt8(0, 2147483648);
	  testView.setInt8(1, 2147483649);
	  if (testView.getInt8(0) || !testView.getInt8(1)) redefineAll($DataViewPrototype, {
	    setInt8: function setInt8(byteOffset, value) {
	      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
	    },
	    setUint8: function setUint8(byteOffset, value) {
	      nativeSetInt8.call(this, byteOffset, value << 24 >> 24);
	    }
	  }, { unsafe: true });
	}

	setToStringTag($ArrayBuffer, ARRAY_BUFFER);
	setToStringTag($DataView, DATA_VIEW);

	var arrayBuffer = {
	  ArrayBuffer: $ArrayBuffer,
	  DataView: $DataView
	};

	var SPECIES$3 = wellKnownSymbol('species');

	// `SpeciesConstructor` abstract operation
	// https://tc39.github.io/ecma262/#sec-speciesconstructor
	var speciesConstructor = function (O, defaultConstructor) {
	  var C = anObject(O).constructor;
	  var S;
	  return C === undefined || (S = anObject(C)[SPECIES$3]) == undefined ? defaultConstructor : aFunction$1(S);
	};

	var ArrayBuffer$1 = arrayBuffer.ArrayBuffer;
	var DataView$1 = arrayBuffer.DataView;
	var nativeArrayBufferSlice = ArrayBuffer$1.prototype.slice;

	var INCORRECT_SLICE = fails(function () {
	  return !new ArrayBuffer$1(2).slice(1, undefined).byteLength;
	});

	// `ArrayBuffer.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-arraybuffer.prototype.slice
	_export({ target: 'ArrayBuffer', proto: true, unsafe: true, forced: INCORRECT_SLICE }, {
	  slice: function slice(start, end) {
	    if (nativeArrayBufferSlice !== undefined && end === undefined) {
	      return nativeArrayBufferSlice.call(anObject(this), start); // FF fix
	    }
	    var length = anObject(this).byteLength;
	    var first = toAbsoluteIndex(start, length);
	    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
	    var result = new (speciesConstructor(this, ArrayBuffer$1))(toLength(fin - first));
	    var viewSource = new DataView$1(this);
	    var viewTarget = new DataView$1(result);
	    var index = 0;
	    while (first < fin) {
	      viewTarget.setUint8(index++, viewSource.getUint8(first++));
	    } return result;
	  }
	});

	var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
	var test = {};

	test[TO_STRING_TAG$1] = 'z';

	var toStringTagSupport = String(test) === '[object z]';

	var TO_STRING_TAG$2 = wellKnownSymbol('toStringTag');
	// ES3 wrong here
	var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function (it, key) {
	  try {
	    return it[key];
	  } catch (error) { /* empty */ }
	};

	// getting tag from ES6+ `Object.prototype.toString`
	var classof = toStringTagSupport ? classofRaw : function (it) {
	  var O, tag, result;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG$2)) == 'string' ? tag
	    // builtinTag case
	    : CORRECT_ARGUMENTS ? classofRaw(O)
	    // ES3 arguments fallback
	    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
	};

	// `Object.prototype.toString` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	var objectToString = toStringTagSupport ? {}.toString : function toString() {
	  return '[object ' + classof(this) + ']';
	};

	// `Object.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-object.prototype.tostring
	if (!toStringTagSupport) {
	  redefine(Object.prototype, 'toString', objectToString, { unsafe: true });
	}

	var ITERATOR$2 = wellKnownSymbol('iterator');
	var SAFE_CLOSING = false;

	try {
	  var called = 0;
	  var iteratorWithReturn = {
	    next: function () {
	      return { done: !!called++ };
	    },
	    'return': function () {
	      SAFE_CLOSING = true;
	    }
	  };
	  iteratorWithReturn[ITERATOR$2] = function () {
	    return this;
	  };
	  // eslint-disable-next-line no-throw-literal
	  Array.from(iteratorWithReturn, function () { throw 2; });
	} catch (error) { /* empty */ }

	var checkCorrectnessOfIteration = function (exec, SKIP_CLOSING) {
	  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
	  var ITERATION_SUPPORT = false;
	  try {
	    var object = {};
	    object[ITERATOR$2] = function () {
	      return {
	        next: function () {
	          return { done: ITERATION_SUPPORT = true };
	        }
	      };
	    };
	    exec(object);
	  } catch (error) { /* empty */ }
	  return ITERATION_SUPPORT;
	};

	var defineProperty$4 = objectDefineProperty.f;





	var Int8Array$1 = global_1.Int8Array;
	var Int8ArrayPrototype = Int8Array$1 && Int8Array$1.prototype;
	var Uint8ClampedArray$1 = global_1.Uint8ClampedArray;
	var Uint8ClampedArrayPrototype = Uint8ClampedArray$1 && Uint8ClampedArray$1.prototype;
	var TypedArray = Int8Array$1 && objectGetPrototypeOf(Int8Array$1);
	var TypedArrayPrototype = Int8ArrayPrototype && objectGetPrototypeOf(Int8ArrayPrototype);
	var ObjectPrototype$2 = Object.prototype;
	var isPrototypeOf = ObjectPrototype$2.isPrototypeOf;

	var TO_STRING_TAG$3 = wellKnownSymbol('toStringTag');
	var TYPED_ARRAY_TAG = uid('TYPED_ARRAY_TAG');
	// Fixing native typed arrays in Opera Presto crashes the browser, see #595
	var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferNative && !!objectSetPrototypeOf && classof(global_1.opera) !== 'Opera';
	var TYPED_ARRAY_TAG_REQIRED = false;
	var NAME;

	var TypedArrayConstructorsList = {
	  Int8Array: 1,
	  Uint8Array: 1,
	  Uint8ClampedArray: 1,
	  Int16Array: 2,
	  Uint16Array: 2,
	  Int32Array: 4,
	  Uint32Array: 4,
	  Float32Array: 4,
	  Float64Array: 8
	};

	var isView = function isView(it) {
	  var klass = classof(it);
	  return klass === 'DataView' || has(TypedArrayConstructorsList, klass);
	};

	var isTypedArray = function (it) {
	  return isObject(it) && has(TypedArrayConstructorsList, classof(it));
	};

	var aTypedArray = function (it) {
	  if (isTypedArray(it)) return it;
	  throw TypeError('Target is not a typed array');
	};

	var aTypedArrayConstructor = function (C) {
	  if (objectSetPrototypeOf) {
	    if (isPrototypeOf.call(TypedArray, C)) return C;
	  } else for (var ARRAY in TypedArrayConstructorsList) if (has(TypedArrayConstructorsList, NAME)) {
	    var TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && (C === TypedArrayConstructor || isPrototypeOf.call(TypedArrayConstructor, C))) {
	      return C;
	    }
	  } throw TypeError('Target is not a typed array constructor');
	};

	var exportTypedArrayMethod = function (KEY, property, forced) {
	  if (!descriptors) return;
	  if (forced) for (var ARRAY in TypedArrayConstructorsList) {
	    var TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && has(TypedArrayConstructor.prototype, KEY)) {
	      delete TypedArrayConstructor.prototype[KEY];
	    }
	  }
	  if (!TypedArrayPrototype[KEY] || forced) {
	    redefine(TypedArrayPrototype, KEY, forced ? property
	      : NATIVE_ARRAY_BUFFER_VIEWS && Int8ArrayPrototype[KEY] || property);
	  }
	};

	var exportTypedArrayStaticMethod = function (KEY, property, forced) {
	  var ARRAY, TypedArrayConstructor;
	  if (!descriptors) return;
	  if (objectSetPrototypeOf) {
	    if (forced) for (ARRAY in TypedArrayConstructorsList) {
	      TypedArrayConstructor = global_1[ARRAY];
	      if (TypedArrayConstructor && has(TypedArrayConstructor, KEY)) {
	        delete TypedArrayConstructor[KEY];
	      }
	    }
	    if (!TypedArray[KEY] || forced) {
	      // V8 ~ Chrome 49-50 `%TypedArray%` methods are non-writable non-configurable
	      try {
	        return redefine(TypedArray, KEY, forced ? property : NATIVE_ARRAY_BUFFER_VIEWS && Int8Array$1[KEY] || property);
	      } catch (error) { /* empty */ }
	    } else return;
	  }
	  for (ARRAY in TypedArrayConstructorsList) {
	    TypedArrayConstructor = global_1[ARRAY];
	    if (TypedArrayConstructor && (!TypedArrayConstructor[KEY] || forced)) {
	      redefine(TypedArrayConstructor, KEY, property);
	    }
	  }
	};

	for (NAME in TypedArrayConstructorsList) {
	  if (!global_1[NAME]) NATIVE_ARRAY_BUFFER_VIEWS = false;
	}

	// WebKit bug - typed arrays constructors prototype is Object.prototype
	if (!NATIVE_ARRAY_BUFFER_VIEWS || typeof TypedArray != 'function' || TypedArray === Function.prototype) {
	  // eslint-disable-next-line no-shadow
	  TypedArray = function TypedArray() {
	    throw TypeError('Incorrect invocation');
	  };
	  if (NATIVE_ARRAY_BUFFER_VIEWS) for (NAME in TypedArrayConstructorsList) {
	    if (global_1[NAME]) objectSetPrototypeOf(global_1[NAME], TypedArray);
	  }
	}



	var arrayBufferViewCore = {
	  NATIVE_ARRAY_BUFFER_VIEWS: NATIVE_ARRAY_BUFFER_VIEWS,
	  TYPED_ARRAY_TAG: TYPED_ARRAY_TAG_REQIRED && TYPED_ARRAY_TAG,
	  aTypedArray: aTypedArray,
	  aTypedArrayConstructor: aTypedArrayConstructor,
	  exportTypedArrayMethod: exportTypedArrayMethod,
	  exportTypedArrayStaticMethod: exportTypedArrayStaticMethod,
	  isView: isView,
	  isTypedArray: isTypedArray,
	  TypedArray: TypedArray,
	  TypedArrayPrototype: TypedArrayPrototype
	};

	/* eslint-disable no-new */



	var NATIVE_ARRAY_BUFFER_VIEWS$1 = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;

	var ArrayBuffer$2 = global_1.ArrayBuffer;
	var Int8Array$2 = global_1.Int8Array;

	var typedArrayConstructorsRequireWrappers = !NATIVE_ARRAY_BUFFER_VIEWS$1 || !fails(function () {
	  Int8Array$2(1);
	}) || !fails(function () {
	  new Int8Array$2(-1);
	}) || !checkCorrectnessOfIteration(function (iterable) {
	  new Int8Array$2();
	  new Int8Array$2(null);
	  new Int8Array$2(1.5);
	  new Int8Array$2(iterable);
	}, true) || fails(function () {
	  // Safari (11+) bug - a reason why even Safari 13 should load a typed array polyfill
	  return new Int8Array$2(new ArrayBuffer$2(2), 1, undefined).length !== 1;
	});

	


	var SPECIES$4 = wellKnownSymbol('species');

	var setSpecies = function (CONSTRUCTOR_NAME) {
	  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
	  var defineProperty = objectDefineProperty.f;

	  if (descriptors && Constructor && !Constructor[SPECIES$4]) {
	    defineProperty(Constructor, SPECIES$4, {
	      configurable: true,
	      get: function () { return this; }
	    });
	  }
	};







	var typedArrayConstructor = createCommonjsModule(function (module) {


	var getOwnPropertyNames = objectGetOwnPropertyNames.f;

	var forEach = arrayIteration.forEach;






	var getInternalState = internalState.get;
	var setInternalState = internalState.set;
	var nativeDefineProperty = objectDefineProperty.f;
	var nativeGetOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
	var round = Math.round;
	var RangeError = global_1.RangeError;
	var ArrayBuffer = arrayBuffer.ArrayBuffer;
	var DataView = arrayBuffer.DataView;
	var NATIVE_ARRAY_BUFFER_VIEWS = arrayBufferViewCore.NATIVE_ARRAY_BUFFER_VIEWS;
	var TYPED_ARRAY_TAG = arrayBufferViewCore.TYPED_ARRAY_TAG;
	var TypedArray = arrayBufferViewCore.TypedArray;
	var TypedArrayPrototype = arrayBufferViewCore.TypedArrayPrototype;
	var aTypedArrayConstructor = arrayBufferViewCore.aTypedArrayConstructor;
	var isTypedArray = arrayBufferViewCore.isTypedArray;
	var BYTES_PER_ELEMENT = 'BYTES_PER_ELEMENT';
	var WRONG_LENGTH = 'Wrong length';

	var fromList = function (C, list) {
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	};

	var addGetter = function (it, key) {
	  nativeDefineProperty(it, key, { get: function () {
	    return getInternalState(this)[key];
	  } });
	};

	var isArrayBuffer = function (it) {
	  var klass;
	  return it instanceof ArrayBuffer || (klass = classof(it)) == 'ArrayBuffer' || klass == 'SharedArrayBuffer';
	};

	var isTypedArrayIndex = function (target, key) {
	  return isTypedArray(target)
	    && typeof key != 'symbol'
	    && key in target
	    && String(+key) == String(key);
	};

	var wrappedGetOwnPropertyDescriptor = function getOwnPropertyDescriptor(target, key) {
	  return isTypedArrayIndex(target, key = toPrimitive(key, true))
	    ? createPropertyDescriptor(2, target[key])
	    : nativeGetOwnPropertyDescriptor(target, key);
	};

	var wrappedDefineProperty = function defineProperty(target, key, descriptor) {
	  if (isTypedArrayIndex(target, key = toPrimitive(key, true))
	    && isObject(descriptor)
	    && has(descriptor, 'value')
	    && !has(descriptor, 'get')
	    && !has(descriptor, 'set')
	    // TODO: add validation descriptor w/o calling accessors
	    && !descriptor.configurable
	    && (!has(descriptor, 'writable') || descriptor.writable)
	    && (!has(descriptor, 'enumerable') || descriptor.enumerable)
	  ) {
	    target[key] = descriptor.value;
	    return target;
	  } return nativeDefineProperty(target, key, descriptor);
	};

	if (descriptors) {
	  if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	    objectGetOwnPropertyDescriptor.f = wrappedGetOwnPropertyDescriptor;
	    objectDefineProperty.f = wrappedDefineProperty;
	    addGetter(TypedArrayPrototype, 'buffer');
	    addGetter(TypedArrayPrototype, 'byteOffset');
	    addGetter(TypedArrayPrototype, 'byteLength');
	    addGetter(TypedArrayPrototype, 'length');
	  }

	  _export({ target: 'Object', stat: true, forced: !NATIVE_ARRAY_BUFFER_VIEWS }, {
	    getOwnPropertyDescriptor: wrappedGetOwnPropertyDescriptor,
	    defineProperty: wrappedDefineProperty
	  });

	  module.exports = function (TYPE, wrapper, CLAMPED) {
	    var BYTES = TYPE.match(/\d+$/)[0] / 8;
	    var CONSTRUCTOR_NAME = TYPE + (CLAMPED ? 'Clamped' : '') + 'Array';
	    var GETTER = 'get' + TYPE;
	    var SETTER = 'set' + TYPE;
	    var NativeTypedArrayConstructor = global_1[CONSTRUCTOR_NAME];
	    var TypedArrayConstructor = NativeTypedArrayConstructor;
	    var TypedArrayConstructorPrototype = TypedArrayConstructor && TypedArrayConstructor.prototype;
	    var exported = {};

	    var getter = function (that, index) {
	      var data = getInternalState(that);
	      return data.view[GETTER](index * BYTES + data.byteOffset, true);
	    };

	    var setter = function (that, index, value) {
	      var data = getInternalState(that);
	      if (CLAMPED) value = (value = round(value)) < 0 ? 0 : value > 0xFF ? 0xFF : value & 0xFF;
	      data.view[SETTER](index * BYTES + data.byteOffset, value, true);
	    };

	    var addElement = function (that, index) {
	      nativeDefineProperty(that, index, {
	        get: function () {
	          return getter(this, index);
	        },
	        set: function (value) {
	          return setter(this, index, value);
	        },
	        enumerable: true
	      });
	    };

	    if (!NATIVE_ARRAY_BUFFER_VIEWS) {
	      TypedArrayConstructor = wrapper(function (that, data, offset, $length) {
	        anInstance(that, TypedArrayConstructor, CONSTRUCTOR_NAME);
	        var index = 0;
	        var byteOffset = 0;
	        var buffer, byteLength, length;
	        if (!isObject(data)) {
	          length = toIndex(data);
	          byteLength = length * BYTES;
	          buffer = new ArrayBuffer(byteLength);
	        } else if (isArrayBuffer(data)) {
	          buffer = data;
	          byteOffset = toOffset(offset, BYTES);
	          var $len = data.byteLength;
	          if ($length === undefined) {
	            if ($len % BYTES) throw RangeError(WRONG_LENGTH);
	            byteLength = $len - byteOffset;
	            if (byteLength < 0) throw RangeError(WRONG_LENGTH);
	          } else {
	            byteLength = toLength($length) * BYTES;
	            if (byteLength + byteOffset > $len) throw RangeError(WRONG_LENGTH);
	          }
	          length = byteLength / BYTES;
	        } else if (isTypedArray(data)) {
	          return fromList(TypedArrayConstructor, data);
	        } else {
	          return typedArrayFrom.call(TypedArrayConstructor, data);
	        }
	        setInternalState(that, {
	          buffer: buffer,
	          byteOffset: byteOffset,
	          byteLength: byteLength,
	          length: length,
	          view: new DataView(buffer)
	        });
	        while (index < length) addElement(that, index++);
	      });

	      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
	      TypedArrayConstructorPrototype = TypedArrayConstructor.prototype = objectCreate(TypedArrayPrototype);
	    } else if (typedArrayConstructorsRequireWrappers) {
	      TypedArrayConstructor = wrapper(function (dummy, data, typedArrayOffset, $length) {
	        anInstance(dummy, TypedArrayConstructor, CONSTRUCTOR_NAME);
	        return inheritIfRequired(function () {
	          if (!isObject(data)) return new NativeTypedArrayConstructor(toIndex(data));
	          if (isArrayBuffer(data)) return $length !== undefined
	            ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES), $length)
	            : typedArrayOffset !== undefined
	              ? new NativeTypedArrayConstructor(data, toOffset(typedArrayOffset, BYTES))
	              : new NativeTypedArrayConstructor(data);
	          if (isTypedArray(data)) return fromList(TypedArrayConstructor, data);
	          return typedArrayFrom.call(TypedArrayConstructor, data);
	        }(), dummy, TypedArrayConstructor);
	      });

	      if (objectSetPrototypeOf) objectSetPrototypeOf(TypedArrayConstructor, TypedArray);
	      forEach(getOwnPropertyNames(NativeTypedArrayConstructor), function (key) {
	        if (!(key in TypedArrayConstructor)) {
	          createNonEnumerableProperty(TypedArrayConstructor, key, NativeTypedArrayConstructor[key]);
	        }
	      });
	      TypedArrayConstructor.prototype = TypedArrayConstructorPrototype;
	    }

	    if (TypedArrayConstructorPrototype.constructor !== TypedArrayConstructor) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, 'constructor', TypedArrayConstructor);
	    }

	    if (TYPED_ARRAY_TAG) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, TYPED_ARRAY_TAG, CONSTRUCTOR_NAME);
	    }

	    exported[CONSTRUCTOR_NAME] = TypedArrayConstructor;

	    _export({
	      global: true, forced: TypedArrayConstructor != NativeTypedArrayConstructor, sham: !NATIVE_ARRAY_BUFFER_VIEWS
	    }, exported);

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructor)) {
	      createNonEnumerableProperty(TypedArrayConstructor, BYTES_PER_ELEMENT, BYTES);
	    }

	    if (!(BYTES_PER_ELEMENT in TypedArrayConstructorPrototype)) {
	      createNonEnumerableProperty(TypedArrayConstructorPrototype, BYTES_PER_ELEMENT, BYTES);
	    }

	    setSpecies(CONSTRUCTOR_NAME);
	  };
	} else module.exports = function () { /* empty */ };
	});

	// `Float32Array` constructor
	// https://tc39.github.io/ecma262/#sec-typedarray-objects
	typedArrayConstructor('Float32', function (init) {
	  return function Float32Array(data, byteOffset, length) {
	    return init(this, data, byteOffset, length);
	  };
	});

	var min$3 = Math.min;

	// `Array.prototype.copyWithin` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.copywithin
	var arrayCopyWithin = [].copyWithin || function copyWithin(target /* = 0 */, start /* = 0, end = @length */) {
	  var O = toObject(this);
	  var len = toLength(O.length);
	  var to = toAbsoluteIndex(target, len);
	  var from = toAbsoluteIndex(start, len);
	  var end = arguments.length > 2 ? arguments[2] : undefined;
	  var count = min$3((end === undefined ? len : toAbsoluteIndex(end, len)) - from, len - to);
	  var inc = 1;
	  if (from < to && to < from + count) {
	    inc = -1;
	    from += count - 1;
	    to += count - 1;
	  }
	  while (count-- > 0) {
	    if (from in O) O[to] = O[from];
	    else delete O[to];
	    to += inc;
	    from += inc;
	  } return O;
	};

	var aTypedArray$1 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$1 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.copyWithin` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.copywithin
	exportTypedArrayMethod$1('copyWithin', function copyWithin(target, start /* , end */) {
	  return arrayCopyWithin.call(aTypedArray$1(this), target, start, arguments.length > 2 ? arguments[2] : undefined);
	});

	var $every = arrayIteration.every;

	var aTypedArray$2 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$2 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.every` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.every
	exportTypedArrayMethod$2('every', function every(callbackfn /* , thisArg */) {
	  return $every(aTypedArray$2(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$3 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$3 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.fill` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.fill
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$3('fill', function fill(value /* , start, end */) {
	  return arrayFill.apply(aTypedArray$3(this), arguments);
	});

	var $filter = arrayIteration.filter;


	var aTypedArray$4 = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$2 = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayMethod$4 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.filter` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.filter
	exportTypedArrayMethod$4('filter', function filter(callbackfn /* , thisArg */) {
	  var list = $filter(aTypedArray$4(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	  var C = speciesConstructor(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$2(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	});

	var $find = arrayIteration.find;

	var aTypedArray$5 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$5 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.find` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.find
	exportTypedArrayMethod$5('find', function find(predicate /* , thisArg */) {
	  return $find(aTypedArray$5(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $findIndex = arrayIteration.findIndex;

	var aTypedArray$6 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$6 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.findIndex` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.findindex
	exportTypedArrayMethod$6('findIndex', function findIndex(predicate /* , thisArg */) {
	  return $findIndex(aTypedArray$6(this), predicate, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $forEach$1 = arrayIteration.forEach;

	var aTypedArray$7 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$7 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.forEach` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.foreach
	exportTypedArrayMethod$7('forEach', function forEach(callbackfn /* , thisArg */) {
	  $forEach$1(aTypedArray$7(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $includes = arrayIncludes.includes;

	var aTypedArray$8 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$8 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.includes` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.includes
	exportTypedArrayMethod$8('includes', function includes(searchElement /* , fromIndex */) {
	  return $includes(aTypedArray$8(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $indexOf = arrayIncludes.indexOf;

	var aTypedArray$9 = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$9 = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.indexOf` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.indexof
	exportTypedArrayMethod$9('indexOf', function indexOf(searchElement /* , fromIndex */) {
	  return $indexOf(aTypedArray$9(this), searchElement, arguments.length > 1 ? arguments[1] : undefined);
	});

	var ITERATOR$5 = wellKnownSymbol('iterator');
	var Uint8Array$1 = global_1.Uint8Array;
	var arrayValues = es_array_iterator.values;
	var arrayKeys = es_array_iterator.keys;
	var arrayEntries = es_array_iterator.entries;
	var aTypedArray$a = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$a = arrayBufferViewCore.exportTypedArrayMethod;
	var nativeTypedArrayIterator = Uint8Array$1 && Uint8Array$1.prototype[ITERATOR$5];

	var CORRECT_ITER_NAME = !!nativeTypedArrayIterator
	  && (nativeTypedArrayIterator.name == 'values' || nativeTypedArrayIterator.name == undefined);

	var typedArrayValues = function values() {
	  return arrayValues.call(aTypedArray$a(this));
	};

	// `%TypedArray%.prototype.entries` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.entries
	exportTypedArrayMethod$a('entries', function entries() {
	  return arrayEntries.call(aTypedArray$a(this));
	});
	// `%TypedArray%.prototype.keys` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.keys
	exportTypedArrayMethod$a('keys', function keys() {
	  return arrayKeys.call(aTypedArray$a(this));
	});
	// `%TypedArray%.prototype.values` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.values
	exportTypedArrayMethod$a('values', typedArrayValues, !CORRECT_ITER_NAME);
	// `%TypedArray%.prototype[@@iterator]` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype-@@iterator
	exportTypedArrayMethod$a(ITERATOR$5, typedArrayValues, !CORRECT_ITER_NAME);

	var aTypedArray$b = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$b = arrayBufferViewCore.exportTypedArrayMethod;
	var $join = [].join;

	// `%TypedArray%.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.join
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$b('join', function join(separator) {
	  return $join.apply(aTypedArray$b(this), arguments);
	});

	var min$4 = Math.min;
	var nativeLastIndexOf = [].lastIndexOf;
	var NEGATIVE_ZERO = !!nativeLastIndexOf && 1 / [1].lastIndexOf(1, -0) < 0;
	var STRICT_METHOD$2 = arrayMethodIsStrict('lastIndexOf');
	// For preventing possible almost infinite loop in non-standard implementations, test the forward version of the method
	var USES_TO_LENGTH$5 = arrayMethodUsesToLength('indexOf', { ACCESSORS: true, 1: 0 });
	var FORCED$1 = NEGATIVE_ZERO || !STRICT_METHOD$2 || !USES_TO_LENGTH$5;

	// `Array.prototype.lastIndexOf` method implementation
	// https://tc39.github.io/ecma262/#sec-array.prototype.lastindexof
	var arrayLastIndexOf = FORCED$1 ? function lastIndexOf(searchElement /* , fromIndex = @[*-1] */) {
	  // convert -0 to +0
	  if (NEGATIVE_ZERO) return nativeLastIndexOf.apply(this, arguments) || 0;
	  var O = toIndexedObject(this);
	  var length = toLength(O.length);
	  var index = length - 1;
	  if (arguments.length > 1) index = min$4(index, toInteger(arguments[1]));
	  if (index < 0) index = length + index;
	  for (;index >= 0; index--) if (index in O && O[index] === searchElement) return index || 0;
	  return -1;
	} : nativeLastIndexOf;

	var aTypedArray$c = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$c = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.lastIndexOf` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.lastindexof
	// eslint-disable-next-line no-unused-vars
	exportTypedArrayMethod$c('lastIndexOf', function lastIndexOf(searchElement /* , fromIndex */) {
	  return arrayLastIndexOf.apply(aTypedArray$c(this), arguments);
	});

	var $map$1 = arrayIteration.map;


	var aTypedArray$d = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$3 = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayMethod$d = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.map` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.map
	exportTypedArrayMethod$d('map', function map(mapfn /* , thisArg */) {
	  return $map$1(aTypedArray$d(this), mapfn, arguments.length > 1 ? arguments[1] : undefined, function (O, length) {
	    return new (aTypedArrayConstructor$3(speciesConstructor(O, O.constructor)))(length);
	  });
	});

	var $reduce$1 = arrayReduce.left;

	var aTypedArray$e = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$e = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduce` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduce
	exportTypedArrayMethod$e('reduce', function reduce(callbackfn /* , initialValue */) {
	  return $reduce$1(aTypedArray$e(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var $reduceRight = arrayReduce.right;

	var aTypedArray$f = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$f = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.reduceRicht` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reduceright
	exportTypedArrayMethod$f('reduceRight', function reduceRight(callbackfn /* , initialValue */) {
	  return $reduceRight(aTypedArray$f(this), callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$g = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$g = arrayBufferViewCore.exportTypedArrayMethod;
	var floor$2 = Math.floor;

	// `%TypedArray%.prototype.reverse` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.reverse
	exportTypedArrayMethod$g('reverse', function reverse() {
	  var that = this;
	  var length = aTypedArray$g(that).length;
	  var middle = floor$2(length / 2);
	  var index = 0;
	  var value;
	  while (index < middle) {
	    value = that[index];
	    that[index++] = that[--length];
	    that[length] = value;
	  } return that;
	});

	var aTypedArray$h = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$h = arrayBufferViewCore.exportTypedArrayMethod;

	var FORCED$2 = fails(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).set({});
	});

	// `%TypedArray%.prototype.set` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.set
	exportTypedArrayMethod$h('set', function set(arrayLike /* , offset */) {
	  aTypedArray$h(this);
	  var offset = toOffset(arguments.length > 1 ? arguments[1] : undefined, 1);
	  var length = this.length;
	  var src = toObject(arrayLike);
	  var len = toLength(src.length);
	  var index = 0;
	  if (len + offset > length) throw RangeError('Wrong length');
	  while (index < len) this[offset + index] = src[index++];
	}, FORCED$2);

	var aTypedArray$i = arrayBufferViewCore.aTypedArray;
	var aTypedArrayConstructor$4 = arrayBufferViewCore.aTypedArrayConstructor;
	var exportTypedArrayMethod$i = arrayBufferViewCore.exportTypedArrayMethod;
	var $slice = [].slice;

	var FORCED$3 = fails(function () {
	  // eslint-disable-next-line no-undef
	  new Int8Array(1).slice();
	});

	// `%TypedArray%.prototype.slice` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
	exportTypedArrayMethod$i('slice', function slice(start, end) {
	  var list = $slice.call(aTypedArray$i(this), start, end);
	  var C = speciesConstructor(this, this.constructor);
	  var index = 0;
	  var length = list.length;
	  var result = new (aTypedArrayConstructor$4(C))(length);
	  while (length > index) result[index] = list[index++];
	  return result;
	}, FORCED$3);

	var $some = arrayIteration.some;

	var aTypedArray$j = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$j = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.some` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.some
	exportTypedArrayMethod$j('some', function some(callbackfn /* , thisArg */) {
	  return $some(aTypedArray$j(this), callbackfn, arguments.length > 1 ? arguments[1] : undefined);
	});

	var aTypedArray$k = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$k = arrayBufferViewCore.exportTypedArrayMethod;
	var $sort = [].sort;

	// `%TypedArray%.prototype.sort` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.sort
	exportTypedArrayMethod$k('sort', function sort(comparefn) {
	  return $sort.call(aTypedArray$k(this), comparefn);
	});

	var aTypedArray$l = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$l = arrayBufferViewCore.exportTypedArrayMethod;

	// `%TypedArray%.prototype.subarray` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.subarray
	exportTypedArrayMethod$l('subarray', function subarray(begin, end) {
	  var O = aTypedArray$l(this);
	  var length = O.length;
	  var beginIndex = toAbsoluteIndex(begin, length);
	  return new (speciesConstructor(O, O.constructor))(
	    O.buffer,
	    O.byteOffset + beginIndex * O.BYTES_PER_ELEMENT,
	    toLength((end === undefined ? length : toAbsoluteIndex(end, length)) - beginIndex)
	  );
	});

	var Int8Array$3 = global_1.Int8Array;
	var aTypedArray$m = arrayBufferViewCore.aTypedArray;
	var exportTypedArrayMethod$m = arrayBufferViewCore.exportTypedArrayMethod;
	var $toLocaleString = [].toLocaleString;
	var $slice$1 = [].slice;

	// iOS Safari 6.x fails here
	var TO_LOCALE_STRING_BUG = !!Int8Array$3 && fails(function () {
	  $toLocaleString.call(new Int8Array$3(1));
	});

	var FORCED$4 = fails(function () {
	  return [1, 2].toLocaleString() != new Int8Array$3([1, 2]).toLocaleString();
	}) || !fails(function () {
	  Int8Array$3.prototype.toLocaleString.call([1, 2]);
	});

	// `%TypedArray%.prototype.toLocaleString` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tolocalestring
	exportTypedArrayMethod$m('toLocaleString', function toLocaleString() {
	  return $toLocaleString.apply(TO_LOCALE_STRING_BUG ? $slice$1.call(aTypedArray$m(this)) : aTypedArray$m(this), arguments);
	}, FORCED$4);

	var exportTypedArrayMethod$n = arrayBufferViewCore.exportTypedArrayMethod;



	var Uint8Array$2 = global_1.Uint8Array;
	var Uint8ArrayPrototype = Uint8Array$2 && Uint8Array$2.prototype || {};
	var arrayToString = [].toString;
	var arrayJoin = [].join;

	if (fails(function () { arrayToString.call({}); })) {
	  arrayToString = function toString() {
	    return arrayJoin.call(this);
	  };
	}

	var IS_NOT_ARRAY_METHOD = Uint8ArrayPrototype.toString != arrayToString;

	// `%TypedArray%.prototype.toString` method
	// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.tostring
	exportTypedArrayMethod$n('toString', arrayToString, IS_NOT_ARRAY_METHOD);

  var zeros = function zeros(size) {
	  return new Float32Array(size);
	};


	var randomWeight = function randomWeight() {
	  return Math.random() * 0.4 - 0.2;
	};

	var randos = function randos(size, std) {
	  var array = new Float32Array(size);

	  if (std) {
	    for (var i = 0; i < size; i++) {
	      array[i] = randomFloat$1(-std, std);
	    }
	  } else {
	    for (var _i = 0; _i < size; _i++) {
	      array[_i] = randomWeight();
	    }
	  }

	  return array;
	};

	/* Functions for turning sparse hashes into arrays and vice versa */
	var Lookup = /*#__PURE__*/function () {
	  function Lookup() {
	    _classCallCheck(this, Lookup);
	  }

	  _createClass(Lookup, null, [{
	    key: "toTable",

	    /**
	     * Performs `[{a: 1}, {b: 6, c: 7}] -> {a: 0, b: 1, c: 2}`
	     * @param {Object} hashes
	     * @returns {Object}
	     */
	    value: function toTable(hashes) {
	      var hash = hashes.reduce(function (memo, hash) {
	        return Object.assign(memo, hash);
	      }, {});
	      return Lookup.toHash(hash);
	    }
	    /**
	     * Performs `[{a: 1}, {b: 6, c: 7}] -> {a: 0, b: 1, c: 2}`
	     * @param {Object} objects2D
	     * @returns {Object}
	     */

	  }, {
	    key: "toTable2D",
	    value: function toTable2D(objects2D) {
	      var table = {};
	      var valueIndex = 0;

	      for (var i = 0; i < objects2D.length; i++) {
	        var objects = objects2D[i];

	        for (var j = 0; j < objects.length; j++) {
	          var object = objects[j];

	          for (var p in object) {
	            if (object.hasOwnProperty(p) && !table.hasOwnProperty(p)) {
	              table[p] = valueIndex++;
	            }
	          }
	        }
	      }

	      return table;
	    }
	  }, {
	    key: "toInputTable",
	    value: function toInputTable(data) {
	      var table = {};
	      var tableIndex = 0;

	      for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
	        for (var p in data[dataIndex].input) {
	          if (!table.hasOwnProperty(p)) {
	            table[p] = tableIndex++;
	          }
	        }
	      }

	      return table;
	    }
	  }, {
	    key: "toInputTable2D",
	    value: function toInputTable2D(data) {
	      var table = {};
	      var tableIndex = 0;

	      for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
	        var input = data[dataIndex].input;

	        for (var i = 0; i < input.length; i++) {
	          var object = input[i];

	          for (var p in object) {
	            if (!table.hasOwnProperty(p)) {
	              table[p] = tableIndex++;
	            }
	          }
	        }
	      }

	      return table;
	    }
	  }, {
	    key: "toOutputTable",
	    value: function toOutputTable(data) {
	      var table = {};
	      var tableIndex = 0;

	      for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
	        for (var p in data[dataIndex].output) {
	          if (!table.hasOwnProperty(p)) {
	            table[p] = tableIndex++;
	          }
	        }
	      }

	      return table;
	    }
	  }, {
	    key: "toOutputTable2D",
	    value: function toOutputTable2D(data) {
	      var table = {};
	      var tableIndex = 0;

	      for (var dataIndex = 0; dataIndex < data.length; dataIndex++) {
	        var output = data[dataIndex].output;

	        for (var i = 0; i < output.length; i++) {
	          var object = output[i];

	          for (var p in object) {
	            if (!table.hasOwnProperty(p)) {
	              table[p] = tableIndex++;
	            }
	          }
	        }
	      }

	      return table;
	    }
	    /**
	     * performs `{a: 6, b: 7} -> {a: 0, b: 1}`
	     * @param {Object} hash
	     * @returns {Object}
	     */

	  }, {
	    key: "toHash",
	    value: function toHash(hash) {
	      var lookup = {};
	      var index = 0;

	      for (var i in hash) {
	        lookup[i] = index++;
	      }

	      return lookup;
	    }
	    /**
	     * performs `{a: 0, b: 1}, {a: 6} -> [6, 0]`
	     * @param {*} lookup
	     * @param {*} object
	     * @param {*} arrayLength
	     * @returns {Float32Array}
	     */

	  }, {
	    key: "toArray",
	    value: function toArray(lookup, object, arrayLength) {
	      var result = new Float32Array(arrayLength);

	      for (var p in lookup) {
	        result[lookup[p]] = object.hasOwnProperty(p) ? object[p] : 0;
	      }

	      return result;
	    }
	  }, {
	    key: "toArrayShort",
	    value: function toArrayShort(lookup, object) {
	      var result = [];

	      for (var p in lookup) {
	        if (!object.hasOwnProperty(p)) break;
	        result[lookup[p]] = object[p];
	      }

	      return Float32Array.from(result);
	    }
	  }, {
	    key: "toArrays",
	    value: function toArrays(lookup, objects, arrayLength) {
	      var result = [];

	      for (var i = 0; i < objects.length; i++) {
	        result.push(this.toArray(lookup, objects[i], arrayLength));
	      }

	      return result;
	    }
	    /**
	     * performs `{a: 0, b: 1}, [6, 7] -> {a: 6, b: 7}`
	     * @param {Object} lookup
	     * @param {Array} array
	     * @returns {Object}
	     */

	  }, {
	    key: "toObject",
	    value: function toObject(lookup, array) {
	      var object = {};

	      for (var p in lookup) {
	        object[p] = array[lookup[p]];
	      }

	      return object;
	    }
	  }, {
	    key: "toObjectPartial",
	    value: function toObjectPartial(lookup, array) {
	      var offset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
	      var limit = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
	      var object = {};
	      var i = 0;

	      for (var p in lookup) {
	        if (offset > 0) {
	          if (i++ < offset) continue;
	        }

	        if (limit > 0) {
	          if (i++ >= limit) continue;
	        }

	        object[p] = array[lookup[p] - offset];
	      }

	      return object;
	    }
	    /**
	     *
	     * @param {Array} array
	     * @returns {*}
	     */

	  }, {
	    key: "lookupFromArray",
	    value: function lookupFromArray(array) {
	      var lookup = {};
	      var z = 0;
	      var i = array.length;

	      while (i-- > 0) {
	        lookup[array[i]] = z++;
	      }

	      return lookup;
	    }
	  }, {
	    key: "dataShape",
	    value: function dataShape(data) {
	      var shape = [];

	      if (data.input) {
	        shape.push('datum');
	        data = data.input;
	      } else if (Array.isArray(data)) {
	        if (data[0].input) {
	          shape.push('array', 'datum');
	          data = data[0].input;
	        } else {
	          shape.push('array');
	          data = data[0];
	        }
	      }

	      var p;

	      while (data) {
	        for (p in data) {
	          break;
	        }

	        if (!data.hasOwnProperty(p)) break;

	        if (Array.isArray(data) || data.buffer instanceof ArrayBuffer) {
	          shape.push('array');
	          data = data[p];
	        } else if (_typeof(data) === 'object') {
	          shape.push('object');
	          data = data[p];
	        } else {
	          throw new Error('unhandled signature');
	        }
	      }

	      shape.push(_typeof(data));
	      return shape;
	    }
	  }, {
	    key: "addKeys",
	    value: function addKeys(value, table) {
	      if (Array.isArray(value)) return;
	      table = table || {};
	      var i = Object.keys(table).length;

	      for (var p in value) {
	        if (!value.hasOwnProperty(p)) continue;
	        if (table.hasOwnProperty(p)) continue;
	        table[p] = i++;
	      }

	      return table;
	    }
	  }]);

	  return Lookup;
	}();

	var lookup = Lookup;

	var FeedForward = /*#__PURE__*/function () {
	  _createClass(FeedForward, [{
	    key: "_setLogMethod",

	    /**
	     *
	     * @param log
	     * if a method is passed in method is used
	     * if false passed in nothing is logged
	     * @returns error
	     */
	    value: function _setLogMethod(log) {
	      if (typeof log === 'function') {
	        this.trainOpts.log = log;
	      } else if (log) {
	        // eslint-disable-next-line
	        this.trainOpts.log = console.log;
	      } else {
	        this.trainOpts.log = false;
	      }
	    }
	    /**
	     *
	     * @param opts
	     *    Supports all `trainDefaults` properties
	     *    also supports:
	     *       learningRate: (number)
	     */

	  }, {
	    key: "_updateTrainingOptions",
	    value: function _updateTrainingOptions(opts) {
	      var _this = this;

	      Object.keys(this.constructor.trainDefaults).forEach(function (opt) {
	        _this.trainOpts[opt] = opts.hasOwnProperty(opt) ? opts[opt] : _this.trainOpts[opt];
	      });

	      this.constructor._validateTrainingOptions(this.trainOpts);

	      this._setLogMethod(opts.log || this.trainOpts.log);

	      if (this.trainOpts.callback && this.trainOpts.callbackPeriod !== this.trainOpts.errorCheckInterval) {
	        console.warn("options.callbackPeriod with value of ".concat(this.trainOpts.callbackPeriod, " does not match options.errorCheckInterval with value of ").concat(this.trainOpts.errorCheckInterval, ", if logging error, it will repeat.  These values may need to match"));
	      }
	    }
	  }], [{
	    key: "_validateTrainingOptions",

	    /**
	     *
	     * @param options
	     * @private
	     */
	    value: function _validateTrainingOptions(options) {
	      var validations = {
	        iterations: function iterations(val) {
	          return typeof val === 'number' && val > 0;
	        },
	        errorThresh: function errorThresh(val) {
	          return typeof val === 'number' && val > 0 && val < 1;
	        },
	        log: function log(val) {
	          return typeof val === 'function' || typeof val === 'boolean';
	        },
	        logPeriod: function logPeriod(val) {
	          return typeof val === 'number' && val > 0;
	        },
	        learningRate: function learningRate(val) {
	          return typeof val === 'number' && val > 0 && val < 1;
	        },
	        callback: function callback(val) {
	          return typeof val === 'function' || val === null;
	        },
	        callbackPeriod: function callbackPeriod(val) {
	          return typeof val === 'number' && val > 0;
	        },
	        timeout: function timeout(val) {
	          return typeof val === 'number' && val > 0;
	        }
	      };
	      Object.keys(FeedForward.trainDefaults).forEach(function (key) {
	        if (validations.hasOwnProperty(key) && !validations[key](options[key])) {
	          throw new Error("[".concat(key, ", ").concat(options[key], "] is out of normal training range, your network will probably not train."));
	        }
	      });
	    }
	  }, {
	    key: "trainDefaults",
	    get: function get() {
	      return {
	        iterations: 20000,
	        errorThresh: 0.005,
	        log: false,
	        logPeriod: 10,
	        learningRate: 0.3,
	        callback: null,
	        callbackPeriod: 10,
	        errorCheckInterval: 100,
	        reinforce: false
	      };
	    }
	  }, {
	    key: "defaults",
	    get: function get() {
	      return {
	        learningRate: 0.3,
	        binaryThresh: 0.5,
	        hiddenLayers: null,
	        inputLayer: null,
	        outputLayer: null,
	        praxisOpts: null,
	        praxis: function praxis$1(layer, settings) {
	          return praxis.momentumRootMeanSquaredPropagation(_objectSpread2({}, layer), layer.praxisOpts || settings);
	        }
	      };
	    }
	  }, {
	    key: "structure",
	    get: function get() {
	      return {
	        layers: null,
	        _inputLayer: null,
	        _outputLayer: null,
	        _model: null
	      };
	    }
	    /**
	     *
	     * @param {object} options
	     * @constructor
	     */

	  }]);

	  function FeedForward() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, FeedForward);

	    this.layers = null;
	    this.inputLayer = null;
	    this.hiddenLayers = null;
	    this.outputLayer = null;
	    this.praxisOpts = null;
	    this.praxis = null;
	    Object.assign(this, this.constructor.defaults, options);
	    this.trainOpts = {};

	    this._updateTrainingOptions(_objectSpread2(_objectSpread2({}, this.constructor.trainDefaults), options));

	    Object.assign(this, this.constructor.structure);
	    this._inputLayer = null;
	    this._hiddenLayers = null;
	    this._outputLayer = null;
	  }

	  _createClass(FeedForward, [{
	    key: "_connectLayers",
	    value: function _connectLayers() {
	      var layers = [];
	      this._inputLayer = this.inputLayer();

	      var hiddenLayers = this._connectHiddenLayers(this._inputLayer);

	      this._outputLayer = this.outputLayer(hiddenLayers[hiddenLayers.length - 1], hiddenLayers.length);
	      layers.push(this._inputLayer);
	      layers.push.apply(layers, _toConsumableArray(hiddenLayers));
	      layers.push(this._outputLayer);
	      this.layers = flattenLayers(layers);
	    }
	  }, {
	    key: "_connectHiddenLayers",
	    value: function _connectHiddenLayers(previousLayer) {
	      this._hiddenLayers = [];
	      var hiddenLayers = [];

	      for (var i = 0; i < this.hiddenLayers.length; i++) {
	        var hiddenLayer = this.hiddenLayers[i](previousLayer, i);
	        hiddenLayers.push(hiddenLayer);

	        this._hiddenLayers.push(hiddenLayer);

	        previousLayer = hiddenLayer;
	      }

	      return hiddenLayers;
	    }
	  }, {
	    key: "initialize",
	    value: function initialize() {
	      this._connectLayers();

	      this.initializeLayers(this.layers);
	      this._model = this.layers.filter(function (l) {
	        return l instanceof Model$4;
	      });
	    }
	  }, {
	    key: "initializeLayers",
	    value: function initializeLayers(layers) {
	      for (var i = 0; i < layers.length; i++) {
	        var layer = layers[i]; // TODO: optimize for when training or just running

	        layer.setupKernels(true);

	        if (layer instanceof Model$4 && layer.hasOwnProperty('praxis') && layer.praxis === null) {
	          layer.praxis = this.praxis(layer, layer.praxisOpts || this.praxisOpts);
	          layer.praxis.setupKernels();
	        }
	      }

	      var lastLayer = layers[layers.length - 1];
	      this.meanSquaredError = new MeanSquaredError$1({
	        width: lastLayer.width,
	        height: lastLayer.height
	      }); // this._getMSE = makeKernel(mse2d, {
	      //   output: [1],
	      //   constants: {
	      //     width: this._outputLayer.width,
	      //     height: this._outputLayer.height,
	      //     length: this._outputLayer.width * this._outputLayer.height,
	      //   }
	      // });
	      // this._addMSE = makeKernel(function(value1, value2) {
	      //   return value1[0] + value2[0];
	      // }, {
	      //   output: [1]
	      // });
	      // this._divideMSESum = makeKernel(function(length, mseSum) {
	      //   const value = mseSum[0];
	      //   if (value > 0) {
	      //     return value / length;
	      //   }
	      //   return 0;
	      // }, {
	      //   output: [1]
	      // });
	    }
	    /**
	     *
	     * @param input
	     * @returns {*}
	     */

	  }, {
	    key: "run",
	    value: function run(input) {
	      if (this.inputLookup) {
	        input = lookup.toArray(this.inputLookup, input);
	      }

	      var output = this.runInput(input);

	      if (output.toArray) {
	        output = output.toArray();
	      }

	      if (this.outputLookup) {
	        output = lookup.toHash(this.outputLookup, output);
	      }

	      return output;
	    }
	  }, {
	    key: "runInput",
	    value: function runInput(input) {
	      this.layers[0].predict(input);

	      for (var i = 1; i < this.layers.length; i++) {
	        this.layers[i].predict();
	      }

	      return this.layers[this.layers.length - 1].weights;
	    }
	    /**
	     *
	     * @param data
	     * @param options
	     * @returns {{error: number, iterations: number}}
	     */

	  }, {
	    key: "train",
	    value: function train(data) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var status;
	      var endTime;

	      var _this$_prepTraining = this._prepTraining(data, options);

	      data = _this$_prepTraining.data;
	      status = _this$_prepTraining.status;
	      endTime = _this$_prepTraining.endTime;

	      while (this._trainingTick(data, status, endTime)) {
	      }

	      return status;
	    }
	    /**
	     *
	     * @param {object} data
	     * @param {object} status { iterations: number, error: number }
	     * @param {Number} endTime
	     */

	  }, {
	    key: "_trainingTick",
	    value: function _trainingTick(data, status, endTime) {
	      if (status.iterations >= this.trainOpts.iterations || status.error <= this.trainOpts.errorThresh || Date.now() >= endTime) {
	        return false;
	      }

	      if (this.trainOpts.log && status.iterations % this.trainOpts.logPeriod === 0) {
	        status.error = this._calculateTrainingError(data);
	        this.trainOpts.log("iterations: ".concat(status.iterations, ", training error: ").concat(status.error));
	      } else if (status.iterations % this.trainOpts.errorCheckInterval === 0) {
	        status.error = this._calculateTrainingError(data);
	      } else {
	        this._trainPatterns(data);
	      }

	      if (this.trainOpts.callback && status.iterations % this.trainOpts.callbackPeriod === 0) {
	        this.trainOpts.callback(Object.assign(status));
	      }

	      status.iterations++;
	      return true;
	    }
	    /**
	     *
	     * @param data
	     * @param options
	     * @protected
	     * @return { data, status, endTime }
	     */

	  }, {
	    key: "_prepTraining",
	    value: function _prepTraining(data, options) {
	      this._updateTrainingOptions(options);

	      var formattedData = this.formatData(data);
	      var endTime = Date.now() + this.trainOpts.timeout;
	      var status = {
	        error: 1,
	        iterations: 0
	      };
	      this.verifyIsInitialized();
	      return {
	        data: this.transferData(formattedData),
	        status: status,
	        endTime: endTime
	      };
	    }
	  }, {
	    key: "verifyIsInitialized",
	    value: function verifyIsInitialized() {
	      if (!this._model) {
	        this.initialize();
	      }
	    }
	    /**
	     *
	     * @param data
	     * @returns {Number} error
	     */

	  }, {
	    key: "_calculateTrainingError",
	    value: function _calculateTrainingError(data) {
	      var sum = new Float32Array([0]);

	      for (var i = 0; i < data.length; ++i) {
	        var prevSum = sum;

	        var error = this._trainPattern(data[i].input, data[i].output, true);

	        sum = this.meanSquaredError.add(sum, error);
	        release$h(error);
	        release$h(prevSum);
	      }

	      var result = this.meanSquaredError.divide(data.length, sum);
	      release$h(sum);

	      if (result.toArray) {
	        var resultArray = result.toArray();
	        release$h(result);
	        return resultArray[0];
	      }

	      return result[0];
	    }
	    /**
	     * @param data
	     * @private
	     */

	  }, {
	    key: "_trainPatterns",
	    value: function _trainPatterns(data) {
	      for (var i = 0; i < data.length; ++i) {
	        this._trainPattern(data[i].input, data[i].output, false);
	      }
	    }
	    /**
	     *
	     * @param input
	     * @param target
	     * @param {Boolean} logErrorRate
	     */

	  }, {
	    key: "_trainPattern",
	    value: function _trainPattern(input, target, logErrorRate) {
	      // forward propagate
	      this.runInput(input); // back propagate

	      this._calculateDeltas(target);

	      this.adjustWeights();

	      if (logErrorRate) {
	        return this.meanSquaredError.calculate(this._outputLayer.errors);
	      }

	      return null;
	    }
	  }, {
	    key: "_calculateDeltas",
	    value: function _calculateDeltas(target) {
	      for (var i = this.layers.length - 1; i > -1; i--) {
	        this.layers[i].compare(target);
	      }
	    }
	    /**
	     *
	     */

	  }, {
	    key: "adjustWeights",
	    value: function adjustWeights() {
	      var _model = this._model;

	      for (var i = 0; i < _model.length; i++) {
	        _model[i].learn(null, null, this.trainOpts.learningRate);
	      }
	    }
	    /**
	     *
	     * @param data
	     * @returns {*}
	     */

	  }, {
	    key: "formatData",
	    value: function formatData(data) {
	      var _this2 = this;

	      if (!Array.isArray(data)) {
	        // turn stream datum into array
	        var tmp = [];
	        tmp.push(data);
	        data = tmp;
	      } // turn sparse hash input into arrays with 0s as filler


	      var inputDatumCheck = data[0].input;

	      if (!Array.isArray(inputDatumCheck) && !(inputDatumCheck instanceof Float32Array)) {
	        if (!this.inputLookup) {
	          this.inputLookup = lookup.buildLookup(data.map(function (value) {
	            return value.input;
	          }));
	        }

	        data = data.map(function (datumParam) {
	          var array = lookup.toArray(_this2.inputLookup, datumParam.input);
	          return _objectSpread2(_objectSpread2({}, datumParam), {}, {
	            input: array
	          });
	        }, this);
	      }

	      var outputDatumCheck = data[0].output;

	      if (!Array.isArray(outputDatumCheck) && !(outputDatumCheck instanceof Float32Array)) {
	        if (!this.outputLookup) {
	          this.outputLookup = lookup.buildLookup(data.map(function (value) {
	            return value.output;
	          }));
	        }

	        data = data.map(function (datumParam) {
	          var array = lookup.toArray(_this2.outputLookup, datumParam.output);
	          return _objectSpread2(_objectSpread2({}, datumParam), {}, {
	            output: array
	          });
	        }, this);
	      }

	      return data;
	    }
	  }, {
	    key: "transferData",
	    value: function transferData(formattedData) {
	      var transferredData = new Array(formattedData.length);
	      var transferInput = makeKernel$l(function (value) {
	        return value[this.thread.x];
	      }, {
	        output: [formattedData[0].input.length],
	        immutable: true
	      });
	      var transferOutput = makeKernel$l(function (value) {
	        return value[this.thread.x];
	      }, {
	        output: [formattedData[0].output.length],
	        immutable: true
	      });

	      for (var i = 0; i < formattedData.length; i++) {
	        var formattedDatum = formattedData[i];
	        transferredData[i] = {
	          input: transferInput(formattedDatum.input),
	          output: transferOutput(formattedDatum.output)
	        };
	      }

	      return transferredData;
	    }
	    /**
	     *
	     * @param data
	     * @returns {
	     *  {
	     *    error: number,
	     *    misclasses: Array
	     *  }
	     * }
	     */

	  }, {
	    key: "test",
	    value: function test() {
	      throw new Error("".concat(this.constructor.name, "-test is not yet implemented"));
	    }
	    /**
	     *
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      if (!this.layers) {
	        this.initialize();
	      }

	      var jsonLayers = [];

	      for (var i = 0; i < this.layers.length; i++) {
	        var layer = this.layers[i];
	        var jsonLayer = layer.toJSON();

	        if (layer.hasOwnProperty('inputLayer')) {
	          jsonLayer.inputLayerIndex = this.layers.indexOf(layer.inputLayer);
	        } else if (layer.hasOwnProperty('inputLayer1') && layer.hasOwnProperty('inputLayer2')) {
	          jsonLayer.inputLayer1Index = this.layers.indexOf(layer.inputLayer1);
	          jsonLayer.inputLayer2Index = this.layers.indexOf(layer.inputLayer2);
	        }

	        jsonLayers.push(jsonLayer);
	      }

	      return {
	        type: this.constructor.name,
	        sizes: [this._inputLayer.height].concat(this._hiddenLayers.map(function (l) {
	          return l.height;
	        })).concat([this._outputLayer.height]),
	        layers: jsonLayers
	      };
	    }
	    /**
	     *
	     * @param json
	     * @param [getLayer]
	     * @returns {FeedForward}
	     */

	  }, {
	    key: "toFunction",

	    /**
	     *
	     * @returns {Function}
	     */
	    value: function toFunction() {
	      throw new Error("".concat(this.constructor.name, "-toFunction is not yet implemented"));
	    }
	    /**
	     * This will create a TrainStream (WriteStream) for us to send the training data to.
	     * @param opts training options
	     * @returns {TrainStream|*}
	     */

	  }, {
	    key: "createTrainStream",
	    value: function createTrainStream() {
	      throw new Error("".concat(this.constructor.name, "-createTrainStream is not yet implemented"));
	    }
	  }], [{
	    key: "fromJSON",
	    value: function fromJSON(json, getLayer) {
	      var jsonLayers = json.layers;
	      var layers = [];
	      var inputLayer = layerFromJson(jsonLayers[0]) || getLayer(jsonLayers[0]);
	      layers.push(inputLayer);

	      for (var i = 1; i < jsonLayers.length; i++) {
	        var jsonLayer = jsonLayers[i];

	        if (jsonLayer.hasOwnProperty('inputLayerIndex')) {
	          var inputLayer1 = layers[jsonLayer.inputLayerIndex];
	          layers.push(layerFromJson(jsonLayer, inputLayer1) || getLayer(jsonLayer, inputLayer1));
	        } else {
	          if (!jsonLayer.hasOwnProperty('inputLayer1Index')) throw new Error('Cannot create network from provided JOSN. inputLayer1Index not defined.');
	          if (!jsonLayer.hasOwnProperty('inputLayer2Index')) throw new Error('Cannot create network from provided JOSN. inputLayer2Index not defined.');
	          var _inputLayer = layers[jsonLayer.inputLayer1Index];
	          var inputLayer2 = layers[jsonLayer.inputLayer2Index];
	          if (_inputLayer === undefined) throw new Error("Cannot create network from provided JOSN. layer of index ".concat(jsonLayer.inputLayer1Index, " not found."));
	          if (inputLayer2 === undefined) throw new Error("Cannot create network from provided JOSN. layer of index ".concat(jsonLayer.inputLayer2Index, " not found."));
	          layers.push(layerFromJson(jsonLayer, inputLayer) || getLayer(jsonLayer, _inputLayer, inputLayer2));
	        }
	      }

	      var net = new FeedForward(json);
	      net.layers = layers;
	      return net;
	    }
	  }]);

	  return FeedForward;
	}();

	var feedForward$2 = {
	  FeedForward: FeedForward
	};

	var nativeJoin = [].join;

	var ES3_STRINGS = indexedObject != Object;
	var STRICT_METHOD$4 = arrayMethodIsStrict('join', ',');

	// `Array.prototype.join` method
	// https://tc39.github.io/ecma262/#sec-array.prototype.join
	_export({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD$4 }, {
	  join: function join(separator) {
	    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
	  }
	});

	var nativePromiseConstructor = global_1.Promise;

	var PromiseCapability = function (C) {
	  var resolve, reject;
	  this.promise = new C(function ($$resolve, $$reject) {
	    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject = $$reject;
	  });
	  this.resolve = aFunction$1(resolve);
	  this.reject = aFunction$1(reject);
	};

	// 25.4.1.5 NewPromiseCapability(C)
	var f$5 = function (C) {
	  return new PromiseCapability(C);
	};

	var newPromiseCapability = {
		f: f$5
	};

	var promiseResolve = function (C, x) {
	  anObject(C);
	  if (isObject(x) && x.constructor === C) return x;
	  var promiseCapability = newPromiseCapability.f(C);
	  var resolve = promiseCapability.resolve;
	  resolve(x);
	  return promiseCapability.promise;
	};

	var SPECIES$5 = wellKnownSymbol('species');
	var PROMISE = 'Promise';
	var getInternalState$2 = internalState.get;
	var setInternalState$2 = internalState.set;
	var getInternalPromiseState = internalState.getterFor(PROMISE);
	var PromiseConstructor = nativePromiseConstructor;
	var document$2 = global_1.document;
	var process$3 = global_1.process;
	var $fetch = getBuiltIn('fetch');
	var newPromiseCapability$1 = newPromiseCapability.f;
	var newGenericPromiseCapability = newPromiseCapability$1;
	var IS_NODE$1 = classofRaw(process$3) == 'process';

	var PENDING = 0;
;
	var Internal$1, OwnPromiseCapability, PromiseWrapper, nativeThen;

	var FORCED$6 = isForced_1(PROMISE, function () {
	  var GLOBAL_CORE_JS_PROMISE = inspectSource(PromiseConstructor) !== String(PromiseConstructor);
	  if (!GLOBAL_CORE_JS_PROMISE) {
	    // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
	    // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
	    // We can't detect it synchronously, so just check versions
	    if (engineV8Version === 66) return true;
	    // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    if (!IS_NODE$1 && typeof PromiseRejectionEvent != 'function') return true;
	  }
	  // We can't use @@species feature detection in V8 since it causes
	  // deoptimization and performance degradation
	  // https://github.com/zloirock/core-js/issues/679
	  if (engineV8Version >= 51 && /native code/.test(PromiseConstructor)) return false;
	  // Detect correctness of subclassing with @@species support
	  var promise = PromiseConstructor.resolve(1);
	  var FakePromise = function (exec) {
	    exec(function () { /* empty */ }, function () { /* empty */ });
	  };
	  var constructor = promise.constructor = {};
	  constructor[SPECIES$5] = FakePromise;
	  return !(promise.then(function () { /* empty */ }) instanceof FakePromise);
	});

	var INCORRECT_ITERATION = FORCED$6 || !checkCorrectnessOfIteration(function (iterable) {
	  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
	});

	// constructor polyfill
	if (FORCED$6) {
	  // 25.4.3.1 Promise(executor)
	  PromiseConstructor = function Promise(executor) {
	    anInstance(this, PromiseConstructor, PROMISE);
	    aFunction$1(executor);
	    Internal$1.call(this);
	    var state = getInternalState$2(this);
	    try {
	      executor(bind(internalResolve, this, state), bind(internalReject, this, state));
	    } catch (error) {
	      internalReject(this, state, error);
	    }
	  };
	  // eslint-disable-next-line no-unused-vars
	  Internal$1 = function Promise(executor) {
	    setInternalState$2(this, {
	      type: PROMISE,
	      done: false,
	      notified: false,
	      parent: false,
	      reactions: [],
	      rejection: false,
	      state: PENDING,
	      value: undefined
	    });
	  };
	  Internal$1.prototype = redefineAll(PromiseConstructor.prototype, {
	    // `Promise.prototype.then` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.then
	    then: function then(onFulfilled, onRejected) {
	      var state = getInternalPromiseState(this);
	      var reaction = newPromiseCapability$1(speciesConstructor(this, PromiseConstructor));
	      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail = typeof onRejected == 'function' && onRejected;
	      reaction.domain = IS_NODE$1 ? process$3.domain : undefined;
	      state.parent = true;
	      state.reactions.push(reaction);
	      if (state.state != PENDING) notify$1(this, state, false);
	      return reaction.promise;
	    },
	    // `Promise.prototype.catch` method
	    // https://tc39.github.io/ecma262/#sec-promise.prototype.catch
	    'catch': function (onRejected) {
	      return this.then(undefined, onRejected);
	    }
	  });
	  OwnPromiseCapability = function () {
	    var promise = new Internal$1();
	    var state = getInternalState$2(promise);
	    this.promise = promise;
	    this.resolve = bind(internalResolve, promise, state);
	    this.reject = bind(internalReject, promise, state);
	  };
	  newPromiseCapability.f = newPromiseCapability$1 = function (C) {
	    return C === PromiseConstructor || C === PromiseWrapper
	      ? new OwnPromiseCapability(C)
	      : newGenericPromiseCapability(C);
	  };

	  if ( typeof nativePromiseConstructor == 'function') {
	    nativeThen = nativePromiseConstructor.prototype.then;

	    // wrap native Promise#then for native async functions
	    redefine(nativePromiseConstructor.prototype, 'then', function then(onFulfilled, onRejected) {
	      var that = this;
	      return new PromiseConstructor(function (resolve, reject) {
	        nativeThen.call(that, resolve, reject);
	      }).then(onFulfilled, onRejected);
	    // https://github.com/zloirock/core-js/issues/640
	    }, { unsafe: true });

	    // wrap fetch result
	    if (typeof $fetch == 'function') _export({ global: true, enumerable: true, forced: true }, {
	      // eslint-disable-next-line no-unused-vars
	      fetch: function fetch(input /* , init */) {
	        return promiseResolve(PromiseConstructor, $fetch.apply(global_1, arguments));
	      }
	    });
	  }
	}

	_export({ global: true, wrap: true, forced: FORCED$6 }, {
	  Promise: PromiseConstructor
	});

	setToStringTag(PromiseConstructor, PROMISE, false);
	setSpecies(PROMISE);

	PromiseWrapper = getBuiltIn(PROMISE);

	// statics
	_export({ target: PROMISE, stat: true, forced: FORCED$6 }, {
	  // `Promise.reject` method
	  // https://tc39.github.io/ecma262/#sec-promise.reject
	  reject: function reject(r) {
	    var capability = newPromiseCapability$1(this);
	    capability.reject.call(undefined, r);
	    return capability.promise;
	  }
	});

	_export({ target: PROMISE, stat: true, forced:  FORCED$6 }, {
	  // `Promise.resolve` method
	  // https://tc39.github.io/ecma262/#sec-promise.resolve
	  resolve: function resolve(x) {
	    return promiseResolve( this, x);
	  }
	});

	_export({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
	  // `Promise.all` method
	  // https://tc39.github.io/ecma262/#sec-promise.all
	  all: function all(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var resolve = capability.resolve;
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      var values = [];
	      var counter = 0;
	      var remaining = 1;
	      iterate_1(iterable, function (promise) {
	        var index = counter++;
	        var alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        $promiseResolve.call(C, promise).then(function (value) {
	          if (alreadyCalled) return;
	          alreadyCalled = true;
	          values[index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  },
	  // `Promise.race` method
	  // https://tc39.github.io/ecma262/#sec-promise.race
	  race: function race(iterable) {
	    var C = this;
	    var capability = newPromiseCapability$1(C);
	    var reject = capability.reject;
	    var result = perform(function () {
	      var $promiseResolve = aFunction$1(C.resolve);
	      iterate_1(iterable, function (promise) {
	        $promiseResolve.call(C, promise).then(capability.resolve, reject);
	      });
	    });
	    if (result.error) reject(result.value);
	    return capability.promise;
	  }
	});

	var thaw_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.thaw = thaw;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	//private variables
	var thawing = false;
	var thaws = [];

	/**
	 * thaw an array of items
	 * @param {Array} items
	 * @param {Object} [options]
	 * @constructor
	 */

	var Thaw = function () {
	  _createClass(Thaw, null, [{
	    key: "stopAll",


	    /**
	     * Stops all Thaw instances
	     */
	    value: function stopAll() {
	      for (var i = 0; i < thaws.length; i++) {
	        thaws[i].stop();
	      }
	    }
	  }, {
	    key: "defaultSettings",

	    /**
	     *
	     * @type {{each: null, done: null}}
	     */
	    get: function get() {
	      return {
	        each: null,
	        done: null
	      };
	    }

	    /**
	     * returns if Thaw.js is thawing
	     * @returns {boolean}
	     */

	  }, {
	    key: "isThawing",
	    get: function get() {
	      return thawing;
	    }
	  }]);

	  function Thaw(items) {
	    var _this = this;

	    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	    _classCallCheck(this, Thaw);

	    var _constructor$defaultS = _extends({}, this.constructor.defaultSettings, options),
	        each = _constructor$defaultS.each,
	        done = _constructor$defaultS.done;

	    this.items = items;
	    this.i = 0;
	    this.options = options;
	    var tick = this.tick = function () {
	      if (_this.i < 0) return;

	      _this.timeout = setTimeout(tick, 0);

	      if (thawing) return;
	      var item = items[_this.i];
	      if (_this.i >= items.length) {
	        if (done !== null) {
	          thawing = true;
	          done(item, _this.i);
	          thawing = false;
	        }

	        _this.i = -1;
	        clearTimeout(_this.timeout);
	        return;
	      }
	      if (each !== null) {
	        thawing = true;
	        each(item, _this.i);
	        thawing = false;
	      } else if (item !== undefined) {
	        item();
	      }
	      _this.i++;
	    };

	    thaws.push(this);
	    if (!options.delay) {
	      tick();
	    }
	  }

	  /**
	   * readies thaw to continue
	   * @returns {boolean} if had to get ready
	   */


	  _createClass(Thaw, [{
	    key: "makeReady",
	    value: function makeReady() {
	      if (this.i < 0) {
	        this.i = this.items.length;
	        return true;
	      }
	      return false;
	    }

	    /**
	     * Adds an item to the end of this instance of Thaw and readies Thaw to process it
	     * @param item
	     * @returns {Thaw}
	     */

	  }, {
	    key: "add",
	    value: function add(item) {
	      var doTick = this.makeReady();

	      this.items.push(item);

	      if (doTick) {
	        this.tick();
	      }
	      return this;
	    }

	    /**
	     * Inserts an item just after the current item being processed in Thaw and readies Thaw to process it
	     * @param item
	     * @returns {Thaw}
	     */

	  }, {
	    key: "insert",
	    value: function insert(item) {
	      var doTick = this.makeReady();

	      this.items.splice(this.i, 0, item);

	      if (doTick) {
	        this.tick();
	      }

	      return this;
	    }

	    /**
	     * Adds an Array to the end of this instance of Thaw and readies Thaw to process it
	     * @param {Array} items
	     * @returns {Thaw}
	     */

	  }, {
	    key: "addArray",
	    value: function addArray(items) {
	      var doTick = this.makeReady();

	      this.items = this.items.concat(items);

	      if (doTick) {
	        this.tick();
	      }

	      return this;
	    }

	    /**
	     * Inserts an Array just after the current item being processed in Thaw and readies Thaw to process them
	     * @param {Array} items
	     * @returns {Thaw}
	     */

	  }, {
	    key: "insertArray",
	    value: function insertArray(items) {
	      var doTick = this.makeReady();
	      var left = this.items;
	      var middle = items;
	      var right = this.items.splice(this.i, this.items.length - this.i + 1);

	      this.items = left.concat(middle, right);

	      if (doTick) {
	        this.tick();
	      }
	      return this;
	    }

	    /**
	     * Stops this instance of Thaw
	     * @returns {Thaw}
	     */

	  }, {
	    key: "stop",
	    value: function stop() {
	      this.i = -1;
	      clearTimeout(this.timeout);
	      if (this.options.done) {
	        this.options.done();
	      }
	      return this;
	    }
	  }]);

	  return Thaw;
	}();

	exports.default = Thaw;
	function thaw(items) {
	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  return new Thaw(items, options);
	}

	});

	unwrapExports(thaw_1);
	var thaw_2 = thaw_1.thaw;

	var block = createCommonjsModule(function (module, exports) {


	});

	unwrapExports(block);

	var dist = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Block = undefined;


	});

	unwrapExports(dist);
	var dist_1 = dist.Block;

	var propertyIsEnumerable = objectPropertyIsEnumerable.f;

	/**
	 *
	 * @param values
	 * @returns {*}
	 */
	var toArray = function toArray(values) {
	  if (Array.isArray(values)) {
	    return values;
	  }

	  return new Float32Array(Object.values(values));
	};


	/**
	 *
	 * @param start
	 * @param end
	 * @returns {Array}
	 */
	var range = function range(start, end) {
	  var result = [];

	  for (; start < end; start++) {
	    result.push(start);
	  }

	  return result;
	};


	var NeuralNetwork = /*#__PURE__*/function () {
	  _createClass(NeuralNetwork, null, [{
	    key: "trainDefaults",
	    get: function get() {
	      return {
	        iterations: 20000,
	        // the maximum times to iterate the training data
	        errorThresh: 0.005,
	        // the acceptable error percentage from training data
	        log: false,
	        // true to use console.log, when a function is supplied it is used
	        logPeriod: 10,
	        // iterations between logging out
	        learningRate: 0.3,
	        // multiply's against the input and the delta then adds to momentum
	        momentum: 0.1,
	        // multiply's against the specified "change" then adds to learning rate for change
	        callback: null,
	        // a periodic call back that can be triggered while training
	        callbackPeriod: 10,
	        // the number of iterations through the training data between callback calls
	        timeout: Infinity,
	        // the max number of milliseconds to train for
	        praxis: null,
	        beta1: 0.9,
	        beta2: 0.999,
	        epsilon: 1e-8
	      };
	    }
	  }, {
	    key: "defaults",
	    get: function get() {
	      return {
	        leakyReluAlpha: 0.01,
	        binaryThresh: 0.5,
	        hiddenLayers: null,
	        // array of ints for the sizes of the hidden layers in the network
	        activation: 'sigmoid' // Supported activation types ['sigmoid', 'relu', 'leaky-relu', 'tanh']

	      };
	    }
	  }]);

	  function NeuralNetwork() {
	    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

	    _classCallCheck(this, NeuralNetwork);

	    Object.assign(this, this.constructor.defaults, options);
	    this.trainOpts = {};
	    this.updateTrainingOptions(_objectSpread2(_objectSpread2({}, this.constructor.trainDefaults), options));
	    this.sizes = null;
	    this.outputLayer = null;
	    this.biases = null; // weights for bias nodes

	    this.weights = null;
	    this.outputs = null; // state for training

	    this.deltas = null;
	    this.changes = null; // for momentum

	    this.errors = null;
	    this.errorCheckInterval = 1;

	    if (!this.constructor.prototype.hasOwnProperty('runInput')) {
	      this.runInput = null;
	    }

	    if (!this.constructor.prototype.hasOwnProperty('calculateDeltas')) {
	      this.calculateDeltas = null;
	    }

	    this.inputLookup = null;
	    this.inputLookupLength = null;
	    this.outputLookup = null;
	    this.outputLookupLength = null;

	    if (options.inputSize && options.hiddenLayers && options.outputSize) {
	      this.sizes = [options.inputSize].concat(options.hiddenLayers).concat([options.outputSize]);
	    }
	  }
	  /**
	   *
	   * Expects this.sizes to have been set
	   */


	  _createClass(NeuralNetwork, [{
	    key: "initialize",
	    value: function initialize() {
	      if (!this.sizes) throw new Error('Sizes must be set before initializing');
	      this.outputLayer = this.sizes.length - 1;
	      this.biases = []; // weights for bias nodes

	      this.weights = [];
	      this.outputs = []; // state for training

	      this.deltas = [];
	      this.changes = []; // for momentum

	      this.errors = [];

	      for (var layer = 0; layer <= this.outputLayer; layer++) {
	        var size = this.sizes[layer];
	        this.deltas[layer] = zeros(size);
	        this.errors[layer] = zeros(size);
	        this.outputs[layer] = zeros(size);

	        if (layer > 0) {
	          this.biases[layer] = randos(size);
	          this.weights[layer] = new Array(size);
	          this.changes[layer] = new Array(size);

	          for (var node = 0; node < size; node++) {
	            var prevSize = this.sizes[layer - 1];
	            this.weights[layer][node] = randos(prevSize);
	            this.changes[layer][node] = zeros(prevSize);
	          }
	        }
	      }

	      this.setActivation();

	      if (this.trainOpts.praxis === 'adam') {
	        this._setupAdam();
	      }
	    }
	    /**
	     *
	     * @param activation supported inputs: 'sigmoid', 'relu', 'leaky-relu', 'tanh'
	     */

	  }, {
	    key: "setActivation",
	    value: function setActivation(activation) {
	      this.activation = activation || this.activation;

	      switch (this.activation) {
	        case 'sigmoid':
	          this.runInput = this.runInput || this._runInputSigmoid;
	          this.calculateDeltas = this.calculateDeltas || this._calculateDeltasSigmoid;
	          break;

	        case 'relu':
	          this.runInput = this.runInput || this._runInputRelu;
	          this.calculateDeltas = this.calculateDeltas || this._calculateDeltasRelu;
	          break;

	        case 'leaky-relu':
	          this.runInput = this.runInput || this._runInputLeakyRelu;
	          this.calculateDeltas = this.calculateDeltas || this._calculateDeltasLeakyRelu;
	          break;

	        case 'tanh':
	          this.runInput = this.runInput || this._runInputTanh;
	          this.calculateDeltas = this.calculateDeltas || this._calculateDeltasTanh;
	          break;

	        default:
	          throw new Error("Unknown activation ".concat(this.activation, ". Available activations are: 'sigmoid', 'relu', 'leaky-relu', 'tanh'"));
	      }
	    }
	    /**
	     *
	     * @returns boolean
	     */

	  }, {
	    key: "run",

	    /**
	     *
	     * @param input
	     * @returns {*}
	     */
	    value: function run(input) {
	      if (!this.isRunnable) return null;

	      if (this.inputLookup) {
	        input = lookup.toArray(this.inputLookup, input, this.inputLookupLength);
	      }

	      var output = this.runInput(input).slice(0);

	      if (this.outputLookup) {
	        output = lookup.toObject(this.outputLookup, output);
	      }

	      return output;
	    }
	    /**
	     * trains via sigmoid
	     * @param input
	     * @returns {*}
	     */

	  }, {
	    key: "_runInputSigmoid",
	    value: function _runInputSigmoid(input) {
	      this.outputs[0] = input; // set output state of input layer

	      var output = null;

	      for (var layer = 1; layer <= this.outputLayer; layer++) {
	        var activeLayer = this.sizes[layer];
	        var activeWeights = this.weights[layer];
	        var activeBiases = this.biases[layer];
	        var activeOutputs = this.outputs[layer];

	        for (var node = 0; node < activeLayer; node++) {
	          var weights = activeWeights[node];
	          var sum = activeBiases[node];

	          for (var k = 0; k < weights.length; k++) {
	            sum += weights[k] * input[k];
	          } // sigmoid


	          activeOutputs[node] = 1 / (1 + Math.exp(-sum));
	        }

	        output = input = this.outputs[layer];
	      }

	      return output;
	    }
	  }, {
	    key: "_runInputRelu",
	    value: function _runInputRelu(input) {
	      this.outputs[0] = input; // set output state of input layer

	      var output = null;

	      for (var layer = 1; layer <= this.outputLayer; layer++) {
	        var currentSize = this.sizes[layer];
	        var currentWeights = this.weights[layer];
	        var currentBiases = this.biases[layer];
	        var currentOutputs = this.outputs[layer];

	        for (var node = 0; node < currentSize; node++) {
	          var weights = currentWeights[node];
	          var sum = currentBiases[node];

	          for (var k = 0; k < weights.length; k++) {
	            sum += weights[k] * input[k];
	          } // relu


	          currentOutputs[node] = sum < 0 ? 0 : sum;
	        }

	        output = input = currentOutputs;
	      }

	      return output;
	    }
	  }, {
	    key: "_runInputLeakyRelu",
	    value: function _runInputLeakyRelu(input) {
	      this.outputs[0] = input; // set output state of input layer

	      var alpha = this.leakyReluAlpha;
	      var output = null;

	      for (var layer = 1; layer <= this.outputLayer; layer++) {
	        var currentSize = this.sizes[layer];
	        var currentWeights = this.weights[layer];
	        var currentBiases = this.biases[layer];
	        var currentOutputs = this.outputs[layer];

	        for (var node = 0; node < currentSize; node++) {
	          var weights = currentWeights[node];
	          var sum = currentBiases[node];

	          for (var k = 0; k < weights.length; k++) {
	            sum += weights[k] * input[k];
	          } // leaky relu


	          currentOutputs[node] = sum < 0 ? 0 : alpha * sum;
	        }

	        output = input = currentOutputs;
	      }

	      return output;
	    }
	  }, {
	    key: "_runInputTanh",
	    value: function _runInputTanh(input) {
	      this.outputs[0] = input; // set output state of input layer

	      var output = null;

	      for (var layer = 1; layer <= this.outputLayer; layer++) {
	        var currentSize = this.sizes[layer];
	        var currentWeights = this.weights[layer];
	        var currentBiases = this.biases[layer];
	        var currentOutputs = this.outputs[layer];

	        for (var node = 0; node < currentSize; node++) {
	          var weights = currentWeights[node];
	          var sum = currentBiases[node];

	          for (var k = 0; k < weights.length; k++) {
	            sum += weights[k] * input[k];
	          } // tanh


	          currentOutputs[node] = Math.tanh(sum);
	        }

	        output = input = currentOutputs;
	      }

	      return output;
	    }
	    /**
	     *
	     * @param data
	     * Verifies network sizes are initialized
	     * If they are not it will initialize them based off the data set.
	     */

	  }, {
	    key: "verifyIsInitialized",
	    value: function verifyIsInitialized(data) {
	      var _this = this;

	      if (this.sizes) return;
	      this.sizes = [];
	      this.sizes.push(data[0].input.length);

	      if (!this.hiddenLayers) {
	        this.sizes.push(Math.max(3, Math.floor(data[0].input.length / 2)));
	      } else {
	        this.hiddenLayers.forEach(function (size) {
	          _this.sizes.push(size);
	        });
	      }

	      this.sizes.push(data[0].output.length);
	      this.initialize();
	    }
	    /**
	     *
	     * @param options
	     *    Supports all `trainDefaults` properties
	     *    also supports:
	     *       learningRate: (number),
	     *       momentum: (number),
	     *       activation: 'sigmoid', 'relu', 'leaky-relu', 'tanh'
	     */

	  }, {
	    key: "updateTrainingOptions",
	    value: function updateTrainingOptions(options) {
	      var trainDefaults = this.constructor.trainDefaults;

	      for (var p in trainDefaults) {
	        if (!trainDefaults.hasOwnProperty(p)) continue;
	        this.trainOpts[p] = options.hasOwnProperty(p) ? options[p] : trainDefaults[p];
	      }

	      this.validateTrainingOptions(this.trainOpts);
	      this.setLogMethod(options.log || this.trainOpts.log);
	      this.activation = options.activation || this.activation;
	    }
	    /**
	     *
	     * @param options
	     */

	  }, {
	    key: "validateTrainingOptions",
	    value: function validateTrainingOptions(options) {
	      var validations = {
	        iterations: function iterations(val) {
	          return typeof val === 'number' && val > 0;
	        },
	        errorThresh: function errorThresh(val) {
	          return typeof val === 'number' && val > 0 && val < 1;
	        },
	        log: function log(val) {
	          return typeof val === 'function' || typeof val === 'boolean';
	        },
	        logPeriod: function logPeriod(val) {
	          return typeof val === 'number' && val > 0;
	        },
	        learningRate: function learningRate(val) {
	          return typeof val === 'number' && val > 0 && val < 1;
	        },
	        momentum: function momentum(val) {
	          return typeof val === 'number' && val > 0 && val < 1;
	        },
	        callback: function callback(val) {
	          return typeof val === 'function' || val === null;
	        },
	        callbackPeriod: function callbackPeriod(val) {
	          return typeof val === 'number' && val > 0;
	        },
	        timeout: function timeout(val) {
	          return typeof val === 'number' && val > 0;
	        }
	      };

	      for (var p in validations) {
	        if (!validations.hasOwnProperty(p)) continue;
	        if (!options.hasOwnProperty(p)) continue;

	        if (!validations[p](options[p])) {
	          throw new Error("[".concat(p, ", ").concat(options[p], "] is out of normal training range, your network will probably not train."));
	        }
	      }
	    }
	    /**
	     *
	     *  Gets JSON of trainOpts object
	     *    NOTE: Activation is stored directly on JSON object and not in the training options
	     */

	  }, {
	    key: "getTrainOptsJSON",
	    value: function getTrainOptsJSON() {
	      var _this2 = this;

	      return Object.keys(this.constructor.trainDefaults).reduce(function (opts, opt) {
	        if (opt === 'timeout' && _this2.trainOpts[opt] === Infinity) return opts;
	        if (opt === 'callback') return opts;
	        if (_this2.trainOpts[opt]) opts[opt] = _this2.trainOpts[opt];
	        if (opt === 'log') opts.log = typeof opts.log === 'function';
	        return opts;
	      }, {});
	    }
	    /**
	     *
	     * @param log
	     * if a method is passed in method is used
	     * if false passed in nothing is logged
	     * @returns error
	     */

	  }, {
	    key: "setLogMethod",
	    value: function setLogMethod(log) {
	      if (typeof log === 'function') {
	        this.trainOpts.log = log;
	      } else if (log) {
	        this.trainOpts.log = this.logTrainingStatus;
	      } else {
	        this.trainOpts.log = false;
	      }
	    }
	    /**
	     *
	     * @param status
	     * log training status
	     */

	  }, {
	    key: "logTrainingStatus",
	    value: function logTrainingStatus(status) {
	      console.log("iterations: ".concat(status.iterations, ", training error: ").concat(status.error));
	    }
	    /**
	     *
	     * @param data
	     * @returns {Number} error
	     */

	  }, {
	    key: "calculateTrainingError",
	    value: function calculateTrainingError(data) {
	      var sum = 0;

	      for (var i = 0; i < data.length; ++i) {
	        sum += this.trainPattern(data[i], true);
	      }

	      return sum / data.length;
	    }
	    /**
	     * @param data
	     */

	  }, {
	    key: "trainPatterns",
	    value: function trainPatterns(data) {
	      for (var i = 0; i < data.length; ++i) {
	        this.trainPattern(data[i]);
	      }
	    }
	    /**
	     *
	     * @param {object} data
	     * @param {object} status { iterations: number, error: number }
	     * @param endTime
	     */

	  }, {
	    key: "trainingTick",
	    value: function trainingTick(data, status, endTime) {
	      var _this$trainOpts = this.trainOpts,
	          callback = _this$trainOpts.callback,
	          callbackPeriod = _this$trainOpts.callbackPeriod,
	          errorThresh = _this$trainOpts.errorThresh,
	          iterations = _this$trainOpts.iterations,
	          log = _this$trainOpts.log,
	          logPeriod = _this$trainOpts.logPeriod;

	      if (status.iterations >= iterations || status.error <= errorThresh || Date.now() >= endTime) {
	        return false;
	      }

	      status.iterations++;

	      if (log && status.iterations % logPeriod === 0) {
	        status.error = this.calculateTrainingError(data);
	        log(status);
	      } else if (status.iterations % this.errorCheckInterval === 0) {
	        status.error = this.calculateTrainingError(data);
	      } else {
	        this.trainPatterns(data);
	      }

	      if (callback && status.iterations % callbackPeriod === 0) {
	        callback({
	          iterations: status.iterations,
	          error: status.error
	        });
	      }

	      return true;
	    }
	    /**
	     *
	     * @param data
	     * @param options
	     * @protected
	     * @return {object} { data, status, endTime }
	     */

	  }, {
	    key: "prepTraining",
	    value: function prepTraining(data, options) {
	      this.updateTrainingOptions(options);
	      data = this.formatData(data);
	      var endTime = Date.now() + this.trainOpts.timeout;
	      var status = {
	        error: 1,
	        iterations: 0
	      };
	      this.verifyIsInitialized(data);
	      return {
	        data: data,
	        status: status,
	        endTime: endTime
	      };
	    }
	    /**
	     *
	     * @param data
	     * @param options
	     * @returns {object} {error: number, iterations: number}
	     */

	  }, {
	    key: "train",
	    value: function train(data) {
	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var status;
	      var endTime;

	      var _this$prepTraining = this.prepTraining(data, options);

	      data = _this$prepTraining.data;
	      status = _this$prepTraining.status;
	      endTime = _this$prepTraining.endTime;

	      while (this.trainingTick(data, status, endTime)) {
	      }

	      return status;
	    }
	    /**
	     *
	     * @param data
	     * @param options
	     * @returns {Promise}
	     * @resolves {{error: number, iterations: number}}
	     * @rejects {{trainError: string, status: {error: number, iterations: number}}
	     */

	  }, {
	    key: "trainAsync",
	    value: function trainAsync(data) {
	      var _this3 = this;

	      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	      var status;
	      var endTime;

	      var _this$prepTraining2 = this.prepTraining(data, options);

	      data = _this$prepTraining2.data;
	      status = _this$prepTraining2.status;
	      endTime = _this$prepTraining2.endTime;
	      return new Promise(function (resolve, reject) {
	        try {
	          var thawedTrain = new Thaw(new Array(_this3.trainOpts.iterations), {
	            delay: true,
	            each: function each() {
	              return _this3.trainingTick(data, status, endTime) || thawedTrain.stop();
	            },
	            done: function done() {
	              return resolve(status);
	            }
	          });
	          thawedTrain.tick();
	        } catch (trainError) {
	          reject(new Error({
	            trainError: trainError,
	            status: status
	          }));
	        }
	      });
	    }
	    /**
	     *
	     * @param {object} value
	     * @param {boolean} [logErrorRate]
	     */

	  }, {
	    key: "trainPattern",
	    value: function trainPattern(value, logErrorRate) {
	      // forward propagate
	      this.runInput(value.input); // back propagate

	      this.calculateDeltas(value.output);
	      this.adjustWeights();

	      if (logErrorRate) {
	        return mse(this.errors[this.outputLayer]);
	      }

	      return null;
	    }
	    /**
	     *
	     * @param target
	     */

	  }, {
	    key: "_calculateDeltasSigmoid",
	    value: function _calculateDeltasSigmoid(target) {
	      for (var layer = this.outputLayer; layer >= 0; layer--) {
	        var activeSize = this.sizes[layer];
	        var activeOutput = this.outputs[layer];
	        var activeError = this.errors[layer];
	        var activeDeltas = this.deltas[layer];
	        var nextLayer = this.weights[layer + 1];

	        for (var node = 0; node < activeSize; node++) {
	          var output = activeOutput[node];
	          var error = 0;

	          if (layer === this.outputLayer) {
	            error = target[node] - output;
	          } else {
	            var deltas = this.deltas[layer + 1];

	            for (var k = 0; k < deltas.length; k++) {
	              error += deltas[k] * nextLayer[k][node];
	            }
	          }

	          activeError[node] = error;
	          activeDeltas[node] = error * output * (1 - output);
	        }
	      }
	    }
	    /**
	     *
	     * @param target
	     */

	  }, {
	    key: "_calculateDeltasRelu",
	    value: function _calculateDeltasRelu(target) {
	      for (var layer = this.outputLayer; layer >= 0; layer--) {
	        var currentSize = this.sizes[layer];
	        var currentOutputs = this.outputs[layer];
	        var nextWeights = this.weights[layer + 1];
	        var nextDeltas = this.deltas[layer + 1];
	        var currentErrors = this.errors[layer];
	        var currentDeltas = this.deltas[layer];

	        for (var node = 0; node < currentSize; node++) {
	          var output = currentOutputs[node];
	          var error = 0;

	          if (layer === this.outputLayer) {
	            error = target[node] - output;
	          } else {
	            for (var k = 0; k < nextDeltas.length; k++) {
	              error += nextDeltas[k] * nextWeights[k][node];
	            }
	          }

	          currentErrors[node] = error;
	          currentDeltas[node] = output > 0 ? error : 0;
	        }
	      }
	    }
	    /**
	     *
	     * @param target
	     */

	  }, {
	    key: "_calculateDeltasLeakyRelu",
	    value: function _calculateDeltasLeakyRelu(target) {
	      var alpha = this.leakyReluAlpha;

	      for (var layer = this.outputLayer; layer >= 0; layer--) {
	        var currentSize = this.sizes[layer];
	        var currentOutputs = this.outputs[layer];
	        var nextDeltas = this.deltas[layer + 1];
	        var nextWeights = this.weights[layer + 1];
	        var currentErrors = this.errors[layer];
	        var currentDeltas = this.deltas[layer];

	        for (var node = 0; node < currentSize; node++) {
	          var output = currentOutputs[node];
	          var error = 0;

	          if (layer === this.outputLayer) {
	            error = target[node] - output;
	          } else {
	            for (var k = 0; k < nextDeltas.length; k++) {
	              error += nextDeltas[k] * nextWeights[k][node];
	            }
	          }

	          currentErrors[node] = error;
	          currentDeltas[node] = output > 0 ? error : alpha * error;
	        }
	      }
	    }
	    /**
	     *
	     * @param target
	     */

	  }, {
	    key: "_calculateDeltasTanh",
	    value: function _calculateDeltasTanh(target) {
	      for (var layer = this.outputLayer; layer >= 0; layer--) {
	        var currentSize = this.sizes[layer];
	        var currentOutputs = this.outputs[layer];
	        var nextDeltas = this.deltas[layer + 1];
	        var nextWeights = this.weights[layer + 1];
	        var currentErrors = this.errors[layer];
	        var currentDeltas = this.deltas[layer];

	        for (var node = 0; node < currentSize; node++) {
	          var output = currentOutputs[node];
	          var error = 0;

	          if (layer === this.outputLayer) {
	            error = target[node] - output;
	          } else {
	            for (var k = 0; k < nextDeltas.length; k++) {
	              error += nextDeltas[k] * nextWeights[k][node];
	            }
	          }

	          currentErrors[node] = error;
	          currentDeltas[node] = (1 - output * output) * error;
	        }
	      }
	    }
	    /**
	     *
	     * Changes weights of networks
	     */

	  }, {
	    key: "adjustWeights",
	    value: function adjustWeights() {
	      var _this$trainOpts2 = this.trainOpts,
	          learningRate = _this$trainOpts2.learningRate,
	          momentum = _this$trainOpts2.momentum;

	      for (var layer = 1; layer <= this.outputLayer; layer++) {
	        var incoming = this.outputs[layer - 1];
	        var activeSize = this.sizes[layer];
	        var activeDelta = this.deltas[layer];
	        var activeChanges = this.changes[layer];
	        var activeWeights = this.weights[layer];
	        var activeBiases = this.biases[layer];

	        for (var node = 0; node < activeSize; node++) {
	          var delta = activeDelta[node];

	          for (var k = 0; k < incoming.length; k++) {
	            var change = activeChanges[node][k];
	            change = learningRate * delta * incoming[k] + momentum * change;
	            activeChanges[node][k] = change;
	            activeWeights[node][k] += change;
	          }

	          activeBiases[node] += learningRate * delta;
	        }
	      }
	    }
	  }, {
	    key: "_setupAdam",
	    value: function _setupAdam() {
	      this.biasChangesLow = [];
	      this.biasChangesHigh = [];
	      this.changesLow = [];
	      this.changesHigh = [];
	      this.iterations = 0;

	      for (var layer = 0; layer <= this.outputLayer; layer++) {
	        var size = this.sizes[layer];

	        if (layer > 0) {
	          this.biasChangesLow[layer] = zeros(size);
	          this.biasChangesHigh[layer] = zeros(size);
	          this.changesLow[layer] = new Array(size);
	          this.changesHigh[layer] = new Array(size);

	          for (var node = 0; node < size; node++) {
	            var prevSize = this.sizes[layer - 1];
	            this.changesLow[layer][node] = zeros(prevSize);
	            this.changesHigh[layer][node] = zeros(prevSize);
	          }
	        }
	      }

	      this.adjustWeights = this._adjustWeightsAdam;
	    }
	  }, {
	    key: "_adjustWeightsAdam",
	    value: function _adjustWeightsAdam() {
	      this.iterations++;
	      var iterations = this.iterations;
	      var _this$trainOpts3 = this.trainOpts,
	          beta1 = _this$trainOpts3.beta1,
	          beta2 = _this$trainOpts3.beta2,
	          epsilon = _this$trainOpts3.epsilon,
	          learningRate = _this$trainOpts3.learningRate;

	      for (var layer = 1; layer <= this.outputLayer; layer++) {
	        var incoming = this.outputs[layer - 1];
	        var currentSize = this.sizes[layer];
	        var currentDeltas = this.deltas[layer];
	        var currentChangesLow = this.changesLow[layer];
	        var currentChangesHigh = this.changesHigh[layer];
	        var currentWeights = this.weights[layer];
	        var currentBiases = this.biases[layer];
	        var currentBiasChangesLow = this.biasChangesLow[layer];
	        var currentBiasChangesHigh = this.biasChangesHigh[layer];

	        for (var node = 0; node < currentSize; node++) {
	          var delta = currentDeltas[node];

	          for (var k = 0; k < incoming.length; k++) {
	            var gradient = delta * incoming[k];
	            var changeLow = currentChangesLow[node][k] * beta1 + (1 - beta1) * gradient;
	            var changeHigh = currentChangesHigh[node][k] * beta2 + (1 - beta2) * gradient * gradient;
	            var momentumCorrection = changeLow / (1 - Math.pow(beta1, iterations));
	            var gradientCorrection = changeHigh / (1 - Math.pow(beta2, iterations));
	            currentChangesLow[node][k] = changeLow;
	            currentChangesHigh[node][k] = changeHigh;
	            currentWeights[node][k] += learningRate * momentumCorrection / (Math.sqrt(gradientCorrection) + epsilon);
	          }

	          var biasGradient = currentDeltas[node];
	          var biasChangeLow = currentBiasChangesLow[node] * beta1 + (1 - beta1) * biasGradient;
	          var biasChangeHigh = currentBiasChangesHigh[node] * beta2 + (1 - beta2) * biasGradient * biasGradient;
	          var biasMomentumCorrection = currentBiasChangesLow[node] / (1 - Math.pow(beta1, iterations));
	          var biasGradientCorrection = currentBiasChangesHigh[node] / (1 - Math.pow(beta2, iterations));
	          currentBiasChangesLow[node] = biasChangeLow;
	          currentBiasChangesHigh[node] = biasChangeHigh;
	          currentBiases[node] += learningRate * biasMomentumCorrection / (Math.sqrt(biasGradientCorrection) + epsilon);
	        }
	      }
	    }
	    /**
	     *
	     * @param data
	     * @returns {*}
	     */

	  }, {
	    key: "formatData",
	    value: function formatData(data) {
	      if (!Array.isArray(data)) {
	        // turn stream datum into array
	        data = [data];
	      }

	      if (!Array.isArray(data[0].input)) {
	        if (this.inputLookup) {
	          this.inputLookupLength = Object.keys(this.inputLookup).length;
	        } else {
	          var inputLookup = new lookupTable(data, 'input');
	          this.inputLookup = inputLookup.table;
	          this.inputLookupLength = inputLookup.length;
	        }
	      }

	      if (!Array.isArray(data[0].output)) {
	        if (this.outputLookup) {
	          this.outputLookupLength = Object.keys(this.outputLookup).length;
	        } else {
	          var _lookup = new lookupTable(data, 'output');

	          this.outputLookup = _lookup.table;
	          this.outputLookupLength = _lookup.length;
	        }
	      }

	      if (typeof this._formatInput === 'undefined') {
	        this._formatInput = getTypedArrayFn(data[0].input, this.inputLookup);
	        this._formatOutput = getTypedArrayFn(data[0].output, this.outputLookup);
	      } // turn sparse hash input into arrays with 0s as filler


	      if (this._formatInput && this._formatOutput) {
	        var result = [];

	        for (var i = 0; i < data.length; i++) {
	          result.push({
	            input: this._formatInput(data[i].input),
	            output: this._formatOutput(data[i].output)
	          });
	        }

	        return result;
	      }

	      if (this._formatInput) {
	        var _result = [];

	        for (var _i = 0; _i < data.length; _i++) {
	          _result.push({
	            input: this._formatInput(data[_i].input),
	            output: data[_i].output
	          });
	        }

	        return _result;
	      }

	      if (this._formatOutput) {
	        var _result2 = [];

	        for (var _i2 = 0; _i2 < data.length; _i2++) {
	          _result2.push({
	            input: data[_i2].input,
	            output: this._formatOutput(data[_i2].output)
	          });
	        }

	        return _result2;
	      }

	      return data;
	    }
	  }, {
	    key: "addFormat",
	    value: function addFormat(data) {
	      this.inputLookup = lookup.addKeys(data.input, this.inputLookup);

	      if (this.inputLookup) {
	        this.inputLookupLength = Object.keys(this.inputLookup).length;
	      }

	      this.outputLookup = lookup.addKeys(data.output, this.outputLookup);

	      if (this.outputLookup) {
	        this.outputLookupLength = Object.keys(this.outputLookup).length;
	      }
	    }
	    /**
	     *
	     * @param data
	     * @returns {
	     *  {
	     *    error: number,
	     *    misclasses: Array,
	     *  }
	     * }
	     */

	  }, {
	    key: "test",
	    value: function test(data) {
	      var _this4 = this;

	      data = this.formatData(data); // for binary classification problems with one output node

	      var isBinary = data[0].output.length === 1; // for classification problems

	      var misclasses = []; // run each pattern through the trained network and collect
	      // error and misclassification statistics

	      var errorSum = 0;

	      if (isBinary) {
	        var falsePos = 0;
	        var falseNeg = 0;
	        var truePos = 0;
	        var trueNeg = 0;

	        var _loop = function _loop(i) {
	          var output = _this4.runInput(data[i].input);

	          var target = data[i].output;
	          var actual = output[0] > _this4.binaryThresh ? 1 : 0;
	          var expected = target[0];

	          if (actual !== expected) {
	            var misclass = data[i];
	            misclasses.push({
	              input: misclass.input,
	              output: misclass.output,
	              actual: actual,
	              expected: expected
	            });
	          }

	          if (actual === 0 && expected === 0) {
	            trueNeg++;
	          } else if (actual === 1 && expected === 1) {
	            truePos++;
	          } else if (actual === 0 && expected === 1) {
	            falseNeg++;
	          } else if (actual === 1 && expected === 0) {
	            falsePos++;
	          }

	          errorSum += mse(output.map(function (value, i) {
	            return target[i] - value;
	          }));
	        };

	        for (var i = 0; i < data.length; i++) {
	          _loop(i);
	        }

	        return {
	          error: errorSum / data.length,
	          misclasses: misclasses,
	          total: data.length,
	          trueNeg: trueNeg,
	          truePos: truePos,
	          falseNeg: falseNeg,
	          falsePos: falsePos,
	          precision: truePos > 0 ? truePos / (truePos + falsePos) : 0,
	          recall: truePos > 0 ? truePos / (truePos + falseNeg) : 0,
	          accuracy: (trueNeg + truePos) / data.length
	        };
	      }

	      var _loop2 = function _loop2(_i3) {
	        var output = _this4.runInput(data[_i3].input);

	        var target = data[_i3].output;
	        var actual = output.indexOf(max$3(output));
	        var expected = target.indexOf(max$3(target));

	        if (actual !== expected) {
	          var misclass = data[_i3];
	          misclasses.push({
	            input: misclass.input,
	            output: misclass.output,
	            actual: actual,
	            expected: expected
	          });
	        }

	        errorSum += mse(output.map(function (value, i) {
	          return target[i] - value;
	        }));
	      };

	      for (var _i3 = 0; _i3 < data.length; _i3++) {
	        _loop2(_i3);
	      }

	      return {
	        error: errorSum / data.length,
	        misclasses: misclasses,
	        total: data.length
	      };
	    }
	    /**
	     *
	     * @returns
	     *  {
	     *    layers: [
	     *      {
	     *        x: {},
	     *        y: {}
	     *      },
	     *      {
	     *        '0': {
	     *          bias: -0.98771313,
	     *          weights: {
	     *            x: 0.8374838,
	     *            y: 1.245858
	     *          },
	     *        '1': {
	     *          bias: 3.48192004,
	     *          weights: {
	     *            x: 1.7825821,
	     *            y: -2.67899
	     *          }
	     *        }
	     *      },
	     *      {
	     *        f: {
	     *          bias: 0.27205739,
	     *          weights: {
	     *            '0': 1.3161821,
	     *            '1': 2.00436
	     *          }
	     *        }
	     *      }
	     *    ]
	     *  }
	     */

	  }, {
	    key: "toJSON",
	    value: function toJSON() {
	      if (this.sizes === null) {
	        this.initialize();
	      }

	      var layers = [];

	      for (var layer = 0; layer <= this.outputLayer; layer++) {
	        layers[layer] = {};
	        var nodes = void 0; // turn any internal arrays back into hashes for readable json

	        if (layer === 0 && this.inputLookup) {
	          nodes = Object.keys(this.inputLookup);
	        } else if (this.outputLookup && layer === this.outputLayer) {
	          nodes = Object.keys(this.outputLookup);
	        } else {
	          nodes = range(0, this.sizes[layer]);
	        }

	        for (var j = 0; j < nodes.length; j++) {
	          var node = nodes[j];
	          layers[layer][node] = {};

	          if (layer > 0) {
	            layers[layer][node].bias = this.biases[layer][j];
	            layers[layer][node].weights = {};

	            for (var k in layers[layer - 1]) {
	              var index = k;

	              if (layer === 1 && this.inputLookup) {
	                index = this.inputLookup[k];
	              }

	              layers[layer][node].weights[k] = this.weights[layer][j][index];
	            }
	          }
	        }
	      }

	      return {
	        sizes: this.sizes.slice(0),
	        layers: layers,
	        outputLookup: this.outputLookup !== null,
	        inputLookup: this.inputLookup !== null,
	        activation: this.activation,
	        trainOpts: this.getTrainOptsJSON()
	      };
	    }
	    /**
	     *
	     * @param json
	     * @returns {NeuralNetwork}
	     */

	  }, {
	    key: "fromJSON",
	    value: function fromJSON(json) {
	      Object.assign(this, this.constructor.defaults, json);
	      this.sizes = json.sizes;
	      this.initialize();

	      for (var i = 0; i <= this.outputLayer; i++) {
	        var layer = json.layers[i];

	        if (i === 0 && (!layer[0] || json.inputLookup)) {
	          this.inputLookup = lookup.toHash(layer);
	          this.inputLookupLength = Object.keys(this.inputLookup).length;
	        } else if (i === this.outputLayer && (!layer[0] || json.outputLookup)) {
	          this.outputLookup = lookup.toHash(layer);
	        }

	        if (i > 0) {
	          var nodes = Object.keys(layer);
	          this.sizes[i] = nodes.length;

	          for (var j in nodes) {
	            if (nodes.hasOwnProperty(j)) {
	              var node = nodes[j];
	              this.biases[i][j] = layer[node].bias;
	              this.weights[i][j] = toArray(layer[node].weights);
	            }
	          }
	        }
	      }

	      if (json.hasOwnProperty('trainOpts')) {
	        this.updateTrainingOptions(json.trainOpts);
	      }

	      return this;
	    }
	    /**
	     * @param {Function} [cb]
	     * @returns {Function}
	     */

	  }, {
	    key: "toFunction",
	    value: function toFunction(cb) {
	      var activation = this.activation;
	      var leakyReluAlpha = this.leakyReluAlpha;
	      var needsVar = false;

	      function nodeHandle(layers, layerNumber, nodeKey) {
	        if (layerNumber === 0) {
	          return typeof nodeKey === 'string' ? "(input['".concat(nodeKey, "']||0)") : "(input[".concat(nodeKey, "]||0)");
	        }

	        var layer = layers[layerNumber];
	        var node = layer[nodeKey];
	        var result = ['(', node.bias];

	        for (var w in node.weights) {
	          if (node.weights[w] < 0) {
	            result.push("".concat(node.weights[w], "*").concat(nodeHandle(layers, layerNumber - 1, w)));
	          } else {
	            result.push("+".concat(node.weights[w], "*").concat(nodeHandle(layers, layerNumber - 1, w)));
	          }
	        }

	        result.push(')');

	        switch (activation) {
	          case 'sigmoid':
	            return "1/(1+1/Math.exp(".concat(result.join(''), "))");

	          case 'relu':
	            {
	              needsVar = true;
	              return "((v=".concat(result.join(''), ")<0?0:v)");
	            }

	          case 'leaky-relu':
	            {
	              needsVar = true;
	              return "((v=".concat(result.join(''), ")<0?0:").concat(leakyReluAlpha, "*v)");
	            }

	          case 'tanh':
	            return "Math.tanh(".concat(result.join(''), ")");

	          default:
	            throw new Error("Unknown activation ".concat(this.activation, ". Available activations are: 'sigmoid', 'relu', 'leaky-relu', 'tanh'"));
	        }
	      }

	      var _this$toJSON = this.toJSON(),
	          layers = _this$toJSON.layers;

	      var layersAsMath = [];
	      var result;

	      for (var i in layers[layers.length - 1]) {
	        layersAsMath.push(nodeHandle(layers, layers.length - 1, i));
	      }

	      if (this.outputLookup) {
	        result = "{".concat(Object.keys(this.outputLookup).map(function (key, i) {
	          return "'".concat(key, "':").concat(layersAsMath[i]);
	        }), "}");
	      } else {
	        result = "[".concat(layersAsMath.join(','), "]");
	      }

	      var source = "".concat(needsVar ? 'var v;' : '', "return ").concat(result, ";"); // eslint-disable-next-line no-new-func

	      return new Function('input', cb ? cb(source) : source);
	    }
	  }, {
	    key: "isRunnable",
	    get: function get() {
	      var _this5 = this;

	      if (!this.runInput) {
	        console.error('Activation function has not been initialized, did you run train()?');
	        return false;
	      }

	      var checkFns = ['sizes', 'outputLayer', 'biases', 'weights', 'outputs', 'deltas', 'changes', 'errors'].filter(function (c) {
	        return _this5[c] === null;
	      });

	      if (checkFns.length > 0) {
	        console.error("Some settings have not been initialized correctly, did you run train()? Found issues with: ".concat(checkFns.join(', ')));
	        return false;
	      }

	      return true;
	    }
	  }]);

	  return NeuralNetwork;
	}();

	var neuralNetwork = NeuralNetwork;

	// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	function isBuffer(obj) {
	  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
	}
	  
	var src = createCommonjsModule(function (module) {
	  var FeedForward = feedForward$2.FeedForward;
	  var brain = {
	    FeedForward: FeedForward,
	    NeuralNetwork: neuralNetwork,
	  };

	  if (typeof window !== 'undefined') {
	    window.brain = brain; //eslint-disable-line
	  }

	  {
	    module.exports = brain;
	  }
	});

	return src;

})));
