import Ember from 'ember';
import {retainByType, reduceComputedPropertyMacro} from './utils';
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

export default EmberCPM_sum;
