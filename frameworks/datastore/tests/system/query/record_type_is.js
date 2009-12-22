// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Apple Inc. and contributors.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index');

// test parsing of query string
var rec, q;
module("SC.Query comparison of record types", {
  setup: function() {
    // setup dummy app and store
    window.MyApp = SC.Object.create({
      store: SC.Store.create()
    });
    
    // setup a dummy model
    window.MyApp.Foo = SC.Record.extend({});
    
    // load some data
    window.MyApp.store.loadRecords(window.MyApp.Foo, [
      { guid: 1, firstName: "John", lastName: "Doe" }
    ]);
    
    rec = window.MyApp.store.find(window.MyApp.Foo,1);
    
    q = SC.Query.create();
  }
});


  
test("should handle record types", function() {
  
  q.conditions = "TYPE_IS 'MyApp.Foo'";
  q.parse();
  equals(SC.Store.recordTypeFor(rec.storeKey), SC.objectForPropertyPath('MyApp.Foo'), 'record type should be MyApp.Foo');
  ok(q.contains(rec), 'record with proper type should match');
  
  q.conditions = "TYPE_IS 'MyApp.Baz'";
  q.parse();
  ok(!q.contains(rec), 'record with wrong type should not match');
});

plan.run();
