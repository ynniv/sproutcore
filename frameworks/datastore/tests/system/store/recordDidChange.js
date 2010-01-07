// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Apple Inc. and contributors.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import package core_test";
var SC = require('index');

var json1, json2, json3, json4;
var storeKey1, storeKey2, storeKey3, storeKey4;
var store, storeKey, json;
module("SC.Store#recordDidChange", {
  setup: function() {
    
      store = SC.Store.create();

      json1 = {
        guid: "commitGUID1",
        string: "string",
        number: 23,
        bool:   true
      };
      json2 = {
        guid: "commitGUID2",
        string: "string",
        number: 23,
        bool:   true
      };
      json3 = {
        guid: "commitGUID3",
        string: "string",
        number: 23,
        bool:   true
      };
      json4 = {
        guid: "commitGUID4",
        string: "string",
        number: 23,
        bool:   true
      };
      

      storeKey1 = SC.Store.generateStoreKey();
      store.writeDataHash(storeKey1, json1, SC.Record.BUSY_LOADING);
      storeKey2 = SC.Store.generateStoreKey();
      store.writeDataHash(storeKey2, json2, SC.Record.EMPTY);
      storeKey3 = SC.Store.generateStoreKey();
      store.writeDataHash(storeKey3, json3, SC.Record.READY_NEW);
      storeKey4 = SC.Store.generateStoreKey();
      store.writeDataHash(storeKey4, json4, SC.Record.READY_CLEAN);
    }
});

test("recordDidChange", function() {
  var status;
  try{
    store.recordDidChange(undefined, undefined, storeKey1);
  }catch(error1){
    equals(SC.Record.BUSY_ERROR.message, error1.message, "the status shouldn't have changed.");
  }
  
  try{
    store.recordDidChange(undefined, undefined, storeKey2);
  }catch(error2){
    equals(SC.Record.NOT_FOUND_ERROR.message, error2.message, "the status shouldn't have changed.");
  }
  
  store.recordDidChange(undefined, undefined, storeKey3);
   status = store.readStatus( storeKey3);
   equals(status, SC.Record.READY_NEW, "the status shouldn't have changed.");

   store.recordDidChange(undefined, undefined, storeKey4);
   status = store.readStatus( storeKey4);
   equals(status, SC.Record.READY_DIRTY, "the status shouldn't have changed.");
  
});

plan.run();
