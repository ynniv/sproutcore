// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index'); // load sproutcore/foundation

var context = null;

// ..........................................................
// id()
// 
module("SC.RenderContext#id", {
  setup: function() {
    context = SC.RenderContext().id('foo') ;
  }
});

test("id() returns the current id for the tag", function() {
  equals(context.id(), 'foo', 'get id');
});

test("id(bar) alters the current id", function() {
  equals(context.id("bar"), context, "Returns receiver");
  equals(context.id(), 'bar', 'changed to bar');
});

plan.run();
