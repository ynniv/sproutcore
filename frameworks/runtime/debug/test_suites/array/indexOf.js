// ==========================================================================
// Project:   SproutCore Costello - Property Observing Library
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

var SC = require('core'),
    Ct = require('core_test');
require('debug/test_suites/array/base');

SC.ArraySuite.define(function(T) {
  
  T.module("indexOf");
  
  Ct.test("should return index of object", function() {
    var expected = T.expected(3), 
        obj      = T.newObject(3), 
        len      = 3,
        idx;
        
    for(idx=0;idx<len;idx++) {
      Ct.equals(obj.indexOf(expected[idx]), idx, 'obj.indexOf(%@) should match idx'.fmt(expected[idx]));
    }
    
  });
  
  Ct.test("should return -1 when requesting object not in index", function() {
    var obj = T.newObject(3), foo = {};
    Ct.equals(obj.indexOf(foo), -1, 'obj.indexOf(foo) should be < 0');
  });
  
});
