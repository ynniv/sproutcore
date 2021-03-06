// ========================================================================
// SC.Observable Tests
// ========================================================================
/*globals module test ok isObj equals expects Namespace */

var object, ObjectC, ObjectD, objectA, objectB ;

// ..........................................................
// GET()
// 

module("object.get()", {
  
  setup: function() {
    object = SC.Object.create({
      
      normal: 'value',
      numberVal: 24,
      toggleVal: true,

      computed: function() { return 'value'; }.property(),
      
      method: function() { return "value"; },
      
      nullProperty: null,
      
      unknownProperty: function(key, value) {
        this.lastUnknownProperty = key ;
        return "unknown" ;
      }
      
    });
  }
  
});

test("should get normal properties", function() {
  equals(object.get('normal'), 'value') ;
});

test("should call computed properties and return their result", function() {
  equals(object.get("computed"), "value") ;
});

test("should return the function for a non-computed property", function() {
  var value = object.get("method") ;
  equals(SC.typeOf(value), SC.T_FUNCTION) ;
});

test("should return null when property value is null", function() {
  equals(object.get("nullProperty"), null) ;
});

test("should call unknownProperty when value is undefined", function() {
  equals(object.get("unknown"), "unknown") ;
  equals(object.lastUnknownProperty, "unknown") ;
});

// ..........................................................
// SC.GET()
//
module("SC.get()", {
  setup: function() {
    objectA = SC.Object.create({

      normal: 'value',
      numberVal: 24,
      toggleVal: true,

      computed: function() { return 'value'; }.property(),

      method: function() { return "value"; },

      nullProperty: null,

      unknownProperty: function(key, value) {
        this.lastUnknownProperty = key ;
        return "unknown" ;
      }

    });

    objectB = {
      normal: 'value',

      nullProperty: null
    };
  }
});

test("should get normal properties on SC.Observable", function() {
  equals(SC.get(objectA, 'normal'), 'value') ;
});

test("should call computed properties on SC.Observable and return their result", function() {
  equals(SC.get(objectA, "computed"), "value") ;
});

test("should return the function for a non-computed property on SC.Observable", function() {
  var value = SC.get(objectA, "method") ;
  equals(SC.typeOf(value), SC.T_FUNCTION) ;
});

test("should return null when property value is null on SC.Observable", function() {
  equals(SC.get(objectA, "nullProperty"), null) ;
});

test("should call unknownProperty when value is undefined on SC.Observable", function() {
  equals(SC.get(object, "unknown"), "unknown") ;
  equals(object.lastUnknownProperty, "unknown") ;
});

test("should get normal properties on standard objects", function() {
  equals(SC.get(objectB, 'normal'), 'value');
});

test("should return null when property is null on standard objects", function() {
  equals(SC.get(objectB, 'nullProperty'), null);
});

test("should return undefined if the provided object is null", function() {
  equals(SC.get(null, 'key'), undefined);
});

test("should return undefined if the provided object is undefined", function() {
  equals(SC.get(undefined, 'key'), undefined);
});

test("should work when object is SC (used in SC.objectForPropertyPath)", function() {
  equals(SC.objectForPropertyPath('SC.RunLoop'), SC.RunLoop);
  equals(SC.get('RunLoop'), SC.RunLoop);
  equals(SC.get(SC, 'RunLoop'), SC.RunLoop);
});

// ..........................................................
// SET()
// 

module("object.set()", {
  
  setup: function() {
    object = SC.Object.create({
      
      // normal property
      normal: 'value',
      
      // computed property
      _computed: "computed",
      computed: function(key, value) {
        if (value !== undefined) {
          this._computed = value ;
        }
        return this._computed ;
      }.property(),
      
      // method, but not a property
      _method: "method",
      method: function(key, value) {
        if (value !== undefined) {
          this._method = value ;
        }
        return this._method ;
      },
      
      // null property
      nullProperty: null,
      
      // unknown property
      _unknown: 'unknown',
      unknownProperty: function(key, value) {
        if (value !== undefined) {
          this._unknown = value ;
        }
        return this._unknown ;
      }
      
    });
  }

});

test("should change normal properties and return this", function() {
  var ret = object.set("normal", "changed") ;
  equals(object.normal, "changed") ;
  equals(ret, object) ;
});

test("should call computed properties passing value and return this", function() {
  var ret = object.set("computed", "changed") ;
  equals(object._computed, "changed") ;
  equals(SC.typeOf(object.computed), SC.T_FUNCTION) ;
  equals(ret, object) ;
});

test("should replace the function for a non-computed property and return this", function() {
  var ret = object.set("method", "changed") ;
  equals(object._method, "method") ; // make sure this was NOT run
  ok(SC.typeOf(object.method) !== SC.T_FUNCTION) ;
  equals(ret, object) ;
});

test("should replace prover when property value is null", function() {
  var ret = object.set("nullProperty", "changed") ;
  equals(object.nullProperty, "changed") ;
  equals(object._unknown, "unknown"); // verify unknownProperty not called.
  equals(ret, object) ;
});

test("should call unknownProperty with value when property is undefined", function() {
  var ret = object.set("unknown", "changed") ;
  equals(object._unknown, "changed") ;
  equals(ret, object) ;
});

// ..........................................................
// COMPUTED PROPERTIES
// 

module("Computed properties", {
  setup: function() {
    object = SC.Object.create({
      
      // REGULAR
      
      computedCalls: [],
      computed: function(key, value) {
        this.computedCalls.push(value);
        return 'computed';
      }.property(),
      
      computedCachedCalls: [],
      computedCached: function(key, value) {
        this.computedCachedCalls.push(value);
        return 'computedCached';
      }.property().cacheable(),
      
      
      // DEPENDENT KEYS
      
      changer: 'foo',
      
      dependentCalls: [],
      dependent: function(key, value) {
        this.dependentCalls.push(value);
        return 'dependent';
      }.property('changer'),
      
      dependentCachedCalls: [],
      dependentCached: function(key, value) {
        this.dependentCachedCalls.push(value);
        return 'dependentCached';
      }.property('changer').cacheable(),
      
      // everytime it is recomputed, increments call
      incCallCount: 0,
      inc: function() {
        return this.incCallCount++;
      }.property('changer').cacheable(),

      // depends on cached property which depends on another property...
      nestedIncCallCount: 0,
      nestedInc: function(key, value) {
        return this.nestedIncCallCount++;
      }.property('inc').cacheable(),
      
      // two computed properties that depend on a third property
      state: 'on',
      isOn: function(key, value) {
        if (value !== undefined) this.set('state', 'on');
        return this.get('state') === 'on';
      }.property('state'),
      
      isOff: function(key, value) {
        if (value !== undefined) this.set('state', 'off');
        return this.get('state') === 'off';
      }.property('state')
      
    }) ;
  }
});

test("getting values should call function return value", function() {
  
  // get each property twice. Verify return.
  var keys = 'computed computedCached dependent dependentCached'.w();
  
  keys.forEach(function(key) {
    equals(object.get(key), key, 'Try #1: object.get(%@) should run function'.fmt(key));
    equals(object.get(key), key, 'Try #2: object.get(%@) should run function'.fmt(key));
  });
  
  // verify each call count.  cached should only be called once
  'computedCalls dependentCalls'.w().forEach(function(key) {
    equals(object[key].length, 2, 'non-cached property %@ should be called 2x'.fmt(key));
  });

  'computedCachedCalls dependentCachedCalls'.w().forEach(function(key) {
    equals(object[key].length, 1, 'non-cached property %@ should be called 1x'.fmt(key));
  });
  
});

test("setting values should call function return value", function() {
  
  // get each property twice. Verify return.
  var keys = 'computed dependent computedCached dependentCached'.w();
  var values = 'value1 value2'.w();
  
  keys.forEach(function(key) {
    
    equals(object.set(key, values[0]), object, 'Try #1: object.set(%@, %@) should run function'.fmt(key, values[0]));

    equals(object.set(key, values[1]), object, 'Try #2: object.set(%@, %@) should run function'.fmt(key, values[1]));
    equals(object.set(key, values[1]), object, 'Try #3: object.set(%@, %@) should not run function since it is setting same value as before'.fmt(key, values[1]));
    
  });
  
  
  // verify each call count.  cached should only be called once
  keys.forEach(function(key) {
    var calls = object[key + 'Calls'], idx;
    equals(calls.length, 2, 'set(%@) should be called 2x'.fmt(key));
    for(idx=0;idx<2;idx++) {
      equals(calls[idx], values[idx], 'call #%@ to set(%@) should have passed value %@'.fmt(idx+1, key, values[idx]));
    }
  });
  
});

test("notify change should clear cache", function() {

  // call get several times to collect call count
  object.get('computedCached'); // should run func
  object.get('computedCached'); // should not run func

  object.propertyWillChange('computedCached')
    .propertyDidChange('computedCached');
    
  object.get('computedCached'); // should run again
  equals(object.computedCachedCalls.length, 2, 'should have invoked method 2x');
});

test("change dependent should clear cache", function() {

  // call get several times to collect call count
  var ret1 = object.get('inc'); // should run func
  equals(object.get('inc'), ret1, 'multiple calls should not run cached prop');

  object.set('changer', 'bar');
    
  equals(object.get('inc'), ret1+1, 'should increment after dependent key changes'); // should run again
});

test("just notifying change of dependent should clear cache", function() {

  // call get several times to collect call count
  var ret1 = object.get('inc'); // should run func
  equals(object.get('inc'), ret1, 'multiple calls should not run cached prop');

  object.notifyPropertyChange('changer');
    
  equals(object.get('inc'), ret1+1, 'should increment after dependent key changes'); // should run again
});

test("changing dependent should clear nested cache", function() {

  // call get several times to collect call count
  var ret1 = object.get('nestedInc'); // should run func
  equals(object.get('nestedInc'), ret1, 'multiple calls should not run cached prop');

  object.set('changer', 'bar');
    
  equals(object.get('nestedInc'), ret1+1, 'should increment after dependent key changes'); // should run again
  
});

test("just notifying change of dependent should clear nested cache", function() {

  // call get several times to collect call count
  var ret1 = object.get('nestedInc'); // should run func
  equals(object.get('nestedInc'), ret1, 'multiple calls should not run cached prop');

  object.notifyPropertyChange('changer');
    
  equals(object.get('nestedInc'), ret1+1, 'should increment after dependent key changes'); // should run again
  
});


// This verifies a specific bug encountered where observers for computed 
// properties would fire before their prop caches were cleared.
test("change dependent should clear cache when observers of dependent are called", function() {

  // call get several times to collect call count
  var ret1 = object.get('inc'); // should run func
  equals(object.get('inc'), ret1, 'multiple calls should not run cached prop');

  // add observer to verify change...
  object.addObserver('inc', this, function() {
    equals(object.get('inc'), ret1+1, 'should increment after dependent key changes'); // should run again
  });

  // now run
  object.set('changer', 'bar');
    
});

test("allPropertiesDidChange should clear cache", function() {
  // note: test this with a computed method that returns a different value
  // each time to ensure clean function.
  var ret1 = object.get('inc');
  equals(object.get('inc'), ret1, 'should not change after first call');
  
  // flush all props
  object.allPropertiesDidChange();
  equals(object.get('inc'), ret1+1, 'should increment after change');
});

test('setting one of two computed properties that depend on a third property should clear the kvo cache', function() {
  // we have to call set twice to fill up the cache
  object.set('isOff', YES);
  object.set('isOn', YES);
  
  // setting isOff to YES should clear the kvo cache
  object.set('isOff', YES);
  equals(object.get('isOff'), YES, 'object.isOff should be YES');
  equals(object.get('isOn'), NO, 'object.isOn should be NO');
});

// ..........................................................
// OBSERVABLE OBJECTS
// 

module("Observable objects & object properties ", {
  
  setup: function() {
    object = SC.Object.create({
      
      normal: 'value',
      abnormal: 'zeroValue',
      numberVal: 24,
      toggleVal: true,
      observedProperty: 'beingWatched',
      testRemove: 'observerToBeRemoved',  
      normalArray: [1,2,3,4,5],
    
      automaticallyNotifiesObserversFor : function(key) { 
        return NO;    
      },  
    
      getEach: function() {
        var keys = ['normal','abnormal'];
        var ret = [];
        for(var idx=0; idx<keys.length;idx++) {
          ret[ret.length] = this.getPath(keys[idx]);
        }
        return ret ;
      },
    
      newObserver:function(){
        this.abnormal = 'changedValueObserved';
      },
    
      testObserver:function(){
        this.abnormal = 'removedObserver';
      }.observes('normal'),
    
      testArrayObserver:function(){
        this.abnormal = 'notifiedObserver';
      }.observes('*normalArray.[]')
    
    });
  }   
  
});

test('incrementProperty and decrementProperty',function(){
  var newValue = object.incrementProperty('numberVal');
  equals(25,newValue,'numerical value incremented');
  object.numberVal = 24;
  newValue = object.decrementProperty('numberVal');
  equals(23,newValue,'numerical value decremented');
  object.numberVal = 25;
  newValue = object.incrementProperty('numberVal', 5);
  equals(30,newValue,'numerical value incremented by specified increment');
  object.numberVal = 25;
  newValue = object.decrementProperty('numberVal',5);
  equals(20,newValue,'numerical value decremented by specified increment');
});

test('toggle function, should be boolean',function(){
  equals(object.toggleProperty('toggleVal',true,false),object.get('toggleVal')); 
  equals(object.toggleProperty('toggleVal',true,false),object.get('toggleVal'));
  equals(object.toggleProperty('toggleVal',undefined,undefined),object.get('toggleVal'));
});

test('should not notify the observers of a property automatically',function(){
  object.set('normal', 'doNotNotifyObserver'); 
  equals(object.abnormal,'zeroValue')  ;
});

test('should notify array observer when array changes',function(){
  object.normalArray.replace(0,0,6);
  equals(object.abnormal, 'notifiedObserver', 'observer should be notified');
});


module("object.addObserver()", {  
  setup: function() {
        
    ObjectC = SC.Object.create({
      
      ObjectE:SC.Object.create({
        propertyVal:"chainedProperty"
      }),
      
      normal: 'value',
      normal1: 'zeroValue',
      normal2: 'dependentValue',
      incrementor: 10,
      
      action: function() {
        this.normal1= 'newZeroValue';
      },
            
      observeOnceAction: function() {
        this.incrementor= this.incrementor+1;
      },
              
      chainedObserver:function(){
        this.normal2 = 'chainedPropertyObserved' ;
      }
      
    });
  }
});

test("should register an observer for a property", function() {
  ObjectC.addObserver('normal', ObjectC, 'action');
  ObjectC.set('normal','newValue');
  equals(ObjectC.normal1, 'newZeroValue');
});

test("should register an observer for a property - Special case of chained property", function() {
  ObjectC.addObserver('ObjectE.propertyVal',ObjectC,'chainedObserver');
  ObjectC.ObjectE.set('propertyVal',"chainedPropertyValue");
  equals('chainedPropertyObserved',ObjectC.normal2);
  ObjectC.normal2 = 'dependentValue';
  ObjectC.set('ObjectE','');
  equals('chainedPropertyObserved',ObjectC.normal2);  
});


module("object.removeObserver()", {  
  setup: function() {
    ObjectD = SC.Object.create({
      
      ObjectF:SC.Object.create({
        propertyVal:"chainedProperty"
      }),
      
      normal: 'value',
      normal1: 'zeroValue',
      normal2: 'dependentValue',
      ArrayKeys: ['normal','normal1'],
      
      addAction: function() {
        this.normal1 = 'newZeroValue';
      },
      removeAction: function() {
        this.normal2 = 'newDependentValue';
      },
      removeChainedObserver:function(){
        this.normal2 = 'chainedPropertyObserved' ;
      }
    });
    
  }
});

test("should unregister an observer for a property", function() {
  ObjectD.addObserver('normal', ObjectD, 'addAction');
  ObjectD.set('normal','newValue');
  equals(ObjectD.normal1, 'newZeroValue');
  
  ObjectD.set('normal1','zeroValue');
  
  ObjectD.removeObserver('normal', ObjectD, 'addAction');
  ObjectD.set('normal','newValue');
  equals(ObjectD.normal1, 'zeroValue');  
});


test("should unregister an observer for a property - special case when key has a '.' in it.", function() {
  ObjectD.addObserver('ObjectF.propertyVal',ObjectD,'removeChainedObserver');
  ObjectD.ObjectF.set('propertyVal',"chainedPropertyValue");
  ObjectD.removeObserver('ObjectF.propertyVal',ObjectD,'removeChainedObserver');
  ObjectD.normal2 = 'dependentValue';
  ObjectD.ObjectF.set('propertyVal',"removedPropertyValue");
  equals('dependentValue',ObjectD.normal2);
  ObjectD.set('ObjectF','');
  equals('dependentValue',ObjectD.normal2);  
});



module("Bind function ", {
  
  setup: function() {
    objectA = SC.Object.create({
      name: "Sproutcore",
      location: "Timbaktu"
    });

    objectB = SC.Object.create({
      normal: "value",
      computed:function() {
        this.normal = 'newValue';
      }
    }) ;
         
    Namespace = {
      objectA: objectA,
      objectB: objectB  
    } ;
  }
});

test("should bind property with method parameter as undefined", function() {
  // creating binding
  objectA.bind("name", "Namespace.objectB.normal",undefined) ;
  SC.Binding.flushPendingChanges() ; // actually sets up up the binding
  
  // now make a change to see if the binding triggers.
  objectB.set("normal", "changedValue") ;
  
  // support new-style bindings if available
  SC.Binding.flushPendingChanges();
  equals("changedValue", objectA.get("name"), "objectA.name is binded");
});

// ..........................................................
// SPECIAL CASES
// 

test("changing chained observer object to null should not raise exception", function() {

  var obj = SC.Object.create({
    foo: SC.Object.create({
      bar: SC.Object.create({ bat: "BAT" })
    })
  });
  
  var callCount = 0;
  obj.foo.addObserver('bar.bat', obj, function(target, key, value) { 
    equals(target, null, 'new target value should be null');
    equals(key, 'bat', 'key should be bat');
    callCount++; 
  });
  
  SC.run(function() {
    obj.foo.set('bar', null);
  });

  //debugger ;
  equals(callCount, 1, 'changing bar should trigger observer');
  expect(3);
});
