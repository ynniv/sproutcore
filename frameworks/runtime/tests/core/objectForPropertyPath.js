// ========================================================================
// SC.objectForPropertyPath Tests
// ========================================================================
/*globals module test ok same equals expects */

"import core_test:package core";

// An ObjectController will make a content object or an array of content objects 
module("SC.objectForPropertyPath") ;

test("should be able to resolve an object on the window", function() {
  var myLocal = (window.myGlobal = { test: 'this '}) ;
  
  same(myLocal, { test: 'this '}) ;
  same(window.myGlobal, { test: 'this '}) ;
  
  // verify we can resolve our binding path
  same(SC.objectForPropertyPath('myGlobal'), { test: 'this '}, 'SC.objectForPropertyPath()') ;
  
  window.myGlobal =null ;
});

plan.run();
