!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.EmberCPM=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
var among = _dereq_("./macros/among")["default"] || _dereq_("./macros/among");
var encodeURIComponent = _dereq_("./macros/encode-uri-component")["default"] || _dereq_("./macros/encode-uri-component");
var encodeURI = _dereq_("./macros/encode-uri")["default"] || _dereq_("./macros/encode-uri");
var firstPresent = _dereq_("./macros/first-present")["default"] || _dereq_("./macros/first-present");
var fmt = _dereq_("./macros/fmt")["default"] || _dereq_("./macros/fmt");
var htmlEscape = _dereq_("./macros/html-escape")["default"] || _dereq_("./macros/html-escape");
var ifNull = _dereq_("./macros/if-null")["default"] || _dereq_("./macros/if-null");
var notAmong = _dereq_("./macros/not-among")["default"] || _dereq_("./macros/not-among");
var notEqual = _dereq_("./macros/not-equal")["default"] || _dereq_("./macros/not-equal");
var notMatch = _dereq_("./macros/not-match")["default"] || _dereq_("./macros/not-match");
var promise = _dereq_("./macros/promise")["default"] || _dereq_("./macros/promise");
var safeString = _dereq_("./macros/safe-string")["default"] || _dereq_("./macros/safe-string");
var join = _dereq_("./macros/join")["default"] || _dereq_("./macros/join");
var sumBy = _dereq_("./macros/sum-by")["default"] || _dereq_("./macros/sum-by");
var sum = _dereq_("./macros/sum")["default"] || _dereq_("./macros/sum");
var concat = _dereq_("./macros/concat")["default"] || _dereq_("./macros/concat");
var conditional = _dereq_("./macros/conditional")["default"] || _dereq_("./macros/conditional");
var product = _dereq_("./macros/product")["default"] || _dereq_("./macros/product");
var quotient = _dereq_("./macros/quotient")["default"] || _dereq_("./macros/quotient");
var difference = _dereq_("./macros/difference")["default"] || _dereq_("./macros/difference");

function reverseMerge(dest, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key) && !dest.hasOwnProperty(key)) {
      dest[key] = source[key];
    }
  }
}

var VERSION = '1.2.0';
var Macros = {
  among: among,
  encodeURIComponent: encodeURIComponent,
  encodeURI: encodeURI,
  firstPresent: firstPresent,
  fmt: fmt,
  htmlEscape: htmlEscape,
  ifNull: ifNull,
  notAmong: notAmong,
  notEqual: notEqual,
  notMatch: notMatch,
  promise: promise,
  safeString: safeString,
  join: join,
  sumBy: sumBy,
  sum: sum,
  difference: difference,
  concat: concat,
  conditional: conditional,
  quotient: quotient,
  product: product
};
var install = function(){ reverseMerge(Ember.computed, Macros); };


if (Ember.libraries) {
  Ember.libraries.register('Ember-CPM', VERSION);
}

exports.VERSION = VERSION;
exports.Macros = Macros;
exports.install = install;

exports["default"] = {
  VERSION: VERSION,
  Macros: Macros,
  install: install
};
},{"./macros/among":2,"./macros/concat":3,"./macros/conditional":4,"./macros/difference":5,"./macros/encode-uri":7,"./macros/encode-uri-component":6,"./macros/first-present":8,"./macros/fmt":9,"./macros/html-escape":10,"./macros/if-null":11,"./macros/join":12,"./macros/not-among":13,"./macros/not-equal":14,"./macros/not-match":15,"./macros/product":16,"./macros/promise":17,"./macros/quotient":18,"./macros/safe-string":19,"./macros/sum":21,"./macros/sum-by":20}],2:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;

exports["default"] = function EmberCPM_among(dependentKey) {
  var properties = Array.prototype.slice.call(arguments, 1);

  return computed(dependentKey, function(){
    var value = get(this, dependentKey),
      i;

    for (i = 0; i < properties.length; ++i) {
      if (properties[i] === value) {
        return true;
      }
    }
    return false;
  });
}
},{}],3:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var guidFor = Ember.guidFor;
var arrayComputed = Ember.arrayComputed;

var a_forEach = Ember.ArrayPolyfills.forEach,
  a_slice   = Array.prototype.slice;

/*
   Returns the index where an item is to be removed from, or placed into, for
   an EmberCPM.Macros.concat array.

   This is the index of the item within its dependent array, offset by the
   lengths of all prior dependent arrays.
*/
function getIndex(changeMeta, instanceMeta, dependentArrayDelta) {
  var dependentArrayGuid = guidFor(changeMeta.arrayChanged);

  if (!(dependentArrayGuid in instanceMeta.dependentGuidToIndex)) {
    recomputeGuidIndexes(instanceMeta, changeMeta.property._dependentKeys, this);
  }

  var dependentArrayLengths = instanceMeta.dependentArrayLengths,
      dependentArrayIndex = instanceMeta.dependentGuidToIndex[dependentArrayGuid],
      offset = 0,
      arrayIndex;

  // offset is the sum of the lengths of arrays to our left
  for (var i = 0; i < dependentArrayIndex; ++i) {
    offset += (dependentArrayLengths[i] || 0);
  }

  arrayIndex = offset + changeMeta.index;
  dependentArrayLengths[dependentArrayIndex] = (get(changeMeta.arrayChanged, 'length') || 0) + dependentArrayDelta;

  return arrayIndex;
}

function recomputeGuidIndexes(instanceMeta, keys, context) {
  instanceMeta.dependentGuidToIndex = {};
  a_forEach.call(keys, function (key, idx) {
    instanceMeta.dependentGuidToIndex[guidFor(get(this, key))] = idx;
  }, context);
}

/**
  Keeps n arrays concatenated using `Ember.ArrayComputed`.

  Example:
  ```js
  obj = Ember.Object.createWithMixins({
    itemsA: [],
    itemsB: [],
    itemsC: [],
    allItems: EmberCPM.Macros.concat('itemsA', 'itemsB', 'itemsC');
  });

  obj.get('itemsA').pushObjects(['a', 'b']);
  obj.get('allItems') //=> ['a', 'b']

  obj.get('itemsB').pushObjects(['c']);
  obj.get('allItems') //=> ['a', 'b', 'c']

  obj.get('itemsC').pushObjects(['d']);
  obj.get('allItems') //=> ['a', 'b', 'c', 'd']

  obj.get('itemsB').pushObjects(['e', 'f']);
  obj.get('allItems') //=> ['a', 'b', 'c', 'e', 'f', 'd']
  ```
*/
exports["default"] = function EmberCPM_concat() {
  var args = a_slice.call(arguments);
  args.push({
    initialize: function (array, changeMeta, instanceMeta) {
      instanceMeta.dependentArrayLengths = new Array(changeMeta.property._dependentKeys.length);
      // When items are added or removed, we have access to the array that was
      // changed, but not its dependent key, so we use its guid as the key to
      // determine its index in the array of dependent keys.
      instanceMeta.dependentGuidToIndex = {};

      return array;
    },

    addedItem: function (array, item, changeMeta, instanceMeta) {
      var arrayIndex = getIndex.call(this, changeMeta, instanceMeta, 0);
      array.insertAt(arrayIndex, item);
      return array;
    },

    removedItem: function (array, item, changeMeta, instanceMeta) {
      var arrayIndex = getIndex.call(this, changeMeta, instanceMeta, -1);
      array.removeAt(arrayIndex);
      return array;
    }
  });

  return arrayComputed.apply(null, args);
}
},{}],4:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
/**
 * Conditional computed property
 *
 * Usage:
 *
 *      // A simple true/false check on a property
 *      var MyType = Ember.Object.extend({
 *          a: true,
 *          b: EmberCPM.Macros.ifThenElse('a', 'yes', 'no')
 *      });
 *
 *      // Composable computed properties
 *      var lt = Ember.computed.lt; // "less than"
 *      var MyType = Ember.Object.extend({
 *          a: 15,
 *          b: EmberCPM.Macros.conditional(lt('a', 57), 'yes', 'no')
 *      });
 */

exports["default"] = function EmberCPM_conditional(condition, valIfTrue, valIfFalse) {
  var isConditionComputed = Ember.Descriptor === condition.constructor;
  var propertyArguments = isConditionComputed ? condition._dependentKeys.slice(0) : [condition];

  propertyArguments.push(function(/* key, value, oldValue */) {
    var conditionEvaluation = isConditionComputed ? condition.func.apply(this, arguments) : this.get(condition);

    return conditionEvaluation ? valIfTrue : valIfFalse;
  });

  return Ember.computed.apply(this, propertyArguments);
}
},{}],5:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
var getVal = _dereq_("../utils").getVal;
var getDependentPropertyKeys = _dereq_("../utils").getDependentPropertyKeys;

exports["default"] = function EmberCPM_difference() {
  var mainArguments = Array.prototype.slice.call(arguments);
  var propertyArguments = getDependentPropertyKeys(mainArguments);

  propertyArguments.push(function () {
    switch (mainArguments.length) {
      case 0:
        return 0;
      case 1:
        return getVal.call(this, mainArguments[0]);
      default:
        return getVal.call(this, mainArguments[0]) - getVal.call(this, mainArguments[1]);
    }
  });

  return Ember.computed.apply(this, propertyArguments);
}
},{"../utils":22}],6:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;

exports["default"] = function EmberCPM_encodeURIComponent(dependentKey) {
  return computed(dependentKey, function(){
    var value = get(this, dependentKey);
    if (value == null) {
      return value;
    }
    return encodeURIComponent(value);
  });
}
},{}],7:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;

exports["default"] = function EmberCPM_encodeURI(dependentKey) {
  return computed(dependentKey, function(){
    var value = get(this, dependentKey);
    if (value == null) {
      return value;
    }
    return encodeURI(value);
  });
}
},{}],8:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;
var isBlank = Ember.isBlank;

var a_slice = Array.prototype.slice;

// isBlank was introduced in Ember 1.5, backport if necessary.
if (!isBlank) {
  isBlank = function(obj) {
    return Ember.isEmpty(obj) || (typeof obj === 'string' && obj.match(/\S/) === null);
  };
}

var isPresent = function(value) {
  return ! isBlank(value);
};

exports["default"] = function EmberCPM_firstPresent() {
  var properties = a_slice.call(arguments);
  var computedArgs = a_slice.call(properties);

  computedArgs.push(function() {
    var that = this;
    var property = Ember.A(properties).find(function(key) {
      return isPresent(get(that, key));
    });

    if (property) { return get(that, property); }
  });

  return computed.apply(this, computedArgs);
}
},{}],9:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;
var EmberString = Ember.String;

var a_slice = Array.prototype.slice;

exports["default"] = function EmberCPM_fmt() {
  var formatString = '' + a_slice.call(arguments, -1),
      properties   = a_slice.call(arguments, 0, -1),
      propertyArguments = a_slice.call(arguments, 0 , -1);

  propertyArguments.push(function(){
    var values = [], i, value;

    for (i = 0; i < properties.length; ++i) {
      value = get(this, properties[i]);
      if (value === undefined) { return undefined; }
      if (value === null)      { return null; }
      values.push(value);
    }

    return EmberString.fmt(formatString, values);
  });

  return computed.apply(this, propertyArguments);

}
},{}],10:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;
var EmberHandlebars = Ember.Handlebars;

exports["default"] = function EmberCPM_htmlEscape(dependentKey) {
  return computed(dependentKey, function(){
    var value = get(this, dependentKey);

    if (value == null) {
      return value;
    }

    var escapedExpression = EmberHandlebars.Utils.escapeExpression(value);
    return new EmberHandlebars.SafeString(escapedExpression);
  });

}
},{}],11:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;

exports["default"] = function EmberCPM_ifNull(dependentKey, defaultValue) {
  return computed(dependentKey, function(){
    var value = get(this, dependentKey);

    return value == null ? defaultValue : value;
  });
}
},{}],12:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;
var a_slice = Array.prototype.slice;

exports["default"] = function EmberCPM_join() {
  var separator  = a_slice.call(arguments, -1),
      properties = a_slice.call(arguments, 0, -1);

  var cp = computed(function(){
    var that = this;
    return properties.map(function(key) {
      return get(that, key);
    }).join(separator);
  });

  return cp.property.apply(cp, properties);
}
},{}],13:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;

exports["default"] = function EmberCPM_notAmong(dependentKey) {
  var properties = Array.prototype.slice.call(arguments, 1);

  return computed(dependentKey, function(){
    var value = get(this, dependentKey);

    for (var i = 0, l = properties.length; i < l; ++i) {
      if (properties[i] === value) {
        return false;
      }
    }

    return true;
  });
}
},{}],14:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;

exports["default"] = function EmberCPM_notEqual(dependentKey, targetValue) {
  return computed(dependentKey, function(){
    return get(this, dependentKey) !== targetValue;
  });
}
},{}],15:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;

exports["default"] = function EmberCPM_notMatch(dependentKey, regexp) {
  return computed(dependentKey, function(){
    var value = get(this, dependentKey);

    return typeof value === 'string' ? !value.match(regexp) : true;
  });
}
},{}],16:[function(_dereq_,module,exports){
"use strict";
var reduceComputedPropertyMacro = _dereq_("../utils").reduceComputedPropertyMacro;

/**
*  Returns the product of some numeric properties and numeric constants
*
*  Example: 6 * 7 * 2 = 84
*
*  Usage:
*    a: 6,
*    b: 7,
*    c: 2,
*    d: product('a', 'b', 'c'), // 84
*    e: product('a', 'b', 'c', 2) // 168
*/

exports["default"] = reduceComputedPropertyMacro(
  function (prev, item) {
    return prev * item;
  }
);
},{"../utils":22}],17:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;

// TODO: Use RSVP?
exports["default"] = function EmberCPM_promise(dependentKey) {
  return computed(dependentKey, function(){
    var value = get(this, dependentKey);
    if (value == null) { return value; }
    return Ember.$.when(value);
  });
}
},{}],18:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
var getVal = _dereq_("../utils").getVal;
var getDependentPropertyKeys = _dereq_("../utils").getDependentPropertyKeys;

exports["default"] = function EmberCPM_quotient() {
  var mainArguments = Array.prototype.slice.call(arguments), // all arguments
    propertyArguments = getDependentPropertyKeys(mainArguments);

  propertyArguments.push(function () {
    switch (mainArguments.length) {
      case 0:
        return 0;
      case 1:
        return getVal.call(this, mainArguments[0]);
      default:
        return getVal.call(this, mainArguments[0]) / getVal.call(this, mainArguments[1]);
    }
  });

  return Ember.computed.apply(this, propertyArguments);
}
},{"../utils":22}],19:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var computed = Ember.computed;
var EmberHandlebars = Ember.Handlebars;

exports["default"] = function EmberCPM_safeString(dependentKey) {

  return computed(dependentKey, function(){
    var value = get(this, dependentKey);

    return value && new EmberHandlebars.SafeString(value);
  });

}
},{}],20:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

var get = Ember.get;
var reduceComputed = Ember.reduceComputed;

exports["default"] = function EmberCPM_sumBy(dependentKey, propertyKey) {
  return reduceComputed(dependentKey + '.@each.' + propertyKey, {
    initialValue: 0.0,

    addedItem: function(accumulatedValue, item /*, changeMeta, instanceMeta */){
      return accumulatedValue + parseFloat(get(item, propertyKey));
    },

    removedItem: function(accumulatedValue, item /*, changeMeta, instanceMeta */){
      return accumulatedValue - parseFloat(get(item, propertyKey));
    }
  });
}
},{}],21:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;
var reduceComputedPropertyMacro = _dereq_("../utils").reduceComputedPropertyMacro;
var getVal = _dereq_("../utils").getVal;
/**
*  Returns the sum of some numeric properties and numeric constants
*
*  Example: 6 + 7 + 2 = 84
*
*  Usage:
*    a: 6,
*    b: 7,
*    c: 2,
*    d: [1, 2, 3, 4],
*    e: sum('a', 'b', 'c'), // 15
*    f: sum('a', 'b', 'c', 2) // 17,
*    g: sum('d') // 10
*/

function singleValueOrArraySum(val) {
  if (Ember.isArray(val)) {
    return val.reduce(function (prev, item) {return prev + item;});
  }
  else {
    return val;
  }
}

var EmberCPM_sum = reduceComputedPropertyMacro(
  function (prev, item) {
    return singleValueOrArraySum(prev) + singleValueOrArraySum(item);
  },
  {
    singleItemCallback: function (item) {
      return singleValueOrArraySum(getVal.call(this, item));
    }
  }
);

exports["default"] = EmberCPM_sum;
},{"../utils":22}],22:[function(_dereq_,module,exports){
"use strict";
var Ember = window.Ember["default"] || window.Ember;

/**
 * Retain items in an array based on type
 * @param {array} arr  array to iterate over
 * @param {string} type string representation of type
 *
 * Example:
 * var x = ['a', 'b', 123, {hello: 'world'}];
 *
 * retainByType(x, 'string'); // ['a', 'b']
 * retainByType(x, 'number'); // [123]
 * retainByType(x, 'object'); // [{hello: 'world'}]
 *
 */
function retainByType(arr, type) {
  return arr.reject(
    function (item) {
      return Ember.typeOf(item) !== type;
    }
  );
}

exports.retainByType = retainByType;function getDependentPropertyKeys(argumentArr) {
  return argumentArr.reduce(
    function (prev, item) {
      switch (Ember.typeOf(item)) {
        case 'string':
          prev.push(item);
          break;
        case 'number':
          break;
        default:
          if (item.constructor === Ember.Descriptor) {
            prev.pushObjects(item._dependentKeys);
          }
          break;
      }
      return prev;
    },
    []
  );
}

exports.getDependentPropertyKeys = getDependentPropertyKeys;/**
 * Evaluate a value, which could either be a property key or a literal
 * @param val value to evaluate
 *
 * if the value is a string, the object that the computed property is installed
 * on will be checked for a property of the same name. If one is found, it will
 * be evaluated, and the result will be returned. Otherwise the string value its
 * self will be returned
 *
 * All non-string values pass straight through, and are returned unaltered
 */
function getVal(val) {
  if (Ember.typeOf(val) === 'string') {
    return Ember.get(this, val) || val;
  } else if (Ember.typeOf(val) === 'object' && Ember.Descriptor === val.constructor) {
    if (val.altKey) {
      return this.get(val.altKey);
    }
    else {
      return val.func.apply(this);
    }
  } else {
    return val;
  }
}

exports.getVal = getVal;/**
 * Return a computed property macro
 * @param {[type]} reducingFunction [description]
 */
function reduceComputedPropertyMacro(reducingFunction, options) {
  var opts = options || {};
  var singleItemCallback = opts.singleItemCallback || function (item) {return getVal.call(this,item);};

  return function () {
    var mainArguments = Array.prototype.slice.call(arguments), // all arguments
      propertyArguments = getDependentPropertyKeys(mainArguments);

    propertyArguments.push(function () {
      var self = this;
      switch (mainArguments.length) {

        case 0:   // Handle zero-argument case
          return 0;

        case 1:   // Handle one-argument case
          return singleItemCallback.call(this, mainArguments[0]);

        default:  // Handle multi-argument case
          return mainArguments.reduce(
            function (prev, item, idx, enumerable) {
              // Evaluate "prev" value if this is the first time the reduce callback is called
              var prevValue = idx === 1 ? getVal.call(self, prev) : prev,

                // Evaluate the "item" value
                itemValue = getVal.call(self, item);

              // Call the reducing function, replacing "prev" and "item" arguments with
              // their respective evaluated values
              return reducingFunction.apply(self, [prevValue, itemValue, idx, enumerable]);

            }
          );
      }
    });
    return Ember.computed.apply(this, propertyArguments);
  };
}

exports.reduceComputedPropertyMacro = reduceComputedPropertyMacro;
},{}]},{},[1])
(1)
});