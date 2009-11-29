// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2009 Apple Inc. and contributors.
// License:   Licened under MIT license (see license.js)
// ==========================================================================
/*globals plan */

"import package core_test";
"import package sproutcore/runtime";

module("SC.SelectionSet.copy");

test("basic copy", function() {
  var content = "1 2 3 4 5 6 7 8 9".w(),
      set     = SC.SelectionSet.create().add(content,4,4).remove(content,6),
      copy    = set.copy();
  
  equals(set.get('length'), 3, 'precond - original set should have length');
  equals(copy.get('length'), 3, 'copy should have same length');
  same(copy, set, 'copy should be the same as original set');
});

plan.run();
