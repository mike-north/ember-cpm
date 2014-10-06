define(
  ["ember","./utils","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"] || __dependency1__;
    var retainByType = __dependency2__.retainByType;
    var reduceComputedPropertyMacro = __dependency2__.reduceComputedPropertyMacro;
    /**
    *  Returns the sum of some numeric properties and numeric constants
    *
    *  Example: 6 + 7 + 2 = 84
    *
    *  Usage:
    *    a: 6,
    *    b: 7,
    *    c: 2,
    *    d: sum('a', 'b', 'c'), // 15
    *    e: sum('a', 'b', 'c', 2) // 17
    */

    var EmberCPM_sum = reduceComputedPropertyMacro(
      function (prev, item) {
        return prev + item;
      }
    );

    __exports__["default"] = EmberCPM_sum;
  });