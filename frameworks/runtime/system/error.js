// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2009 Sprout Systems, Inc. and contributors.
//            Portions ©2008-2009 Apple Inc. All rights reserved.
// License:   Licened under MIT license (see license.js)
// ==========================================================================

"import core";
"export package";

/**
  @class
  
  An error, used to represent an error state.
  
  Many API's within SproutCore will return an instance of this object whenever
  they have an error occur.  An error includes an error code, description,
  and optional human readable label that indicates the item that failed. 
  
  Depending on the error, other properties may also be added to the object
  to help you recover from the failure.
  
  You can pass error objects to various UI elements to display the error in
  the interface. You can easily determine if the value returned by some API is 
  an error or not using the helper SC.ok(value).
  
  h2. Faking Error Objects
  
  You can actually make any object you want to be treated like an Error object
  by simply implementing two properties: isError and errorValue.  If you 
  set isError to YES, then calling SC.ok(obj) on your object will return NO.
  If isError is YES, then SC.val(obj) will return your errorValue property 
  instead of the receiver.
  
  @extends SC.Object
  @since SproutCore 1.0
*/
SC.Error = SC.Object.extend(
/** @scope SC.Error.prototype */ {
  
  /**
    error code.  Used to designate the error type.
    
    @property {Number}
  */
  code: -1,
  
  /**
    Human readable description of the error.  This can also be a non-localized
    key.
    
    @property {String}
  */
  message: '',
  
  /**
    The value the error represents.  This is used when wrapping a value inside
    of an error to represent the validation failure.
    
    @property {Object}
  */
  errorValue: null,
  
  /**
    The original error object.  Normally this will return the receiver.  
    However, sometimes another object will masquarade as an error; this gives
    you a way to get at the underyling error.
    
    @property {SC.Error}
  */
  errorObject: function() {
    return this;
  }.property().cacheable(),
  
  /**
    Human readable name of the item with the error.
    
    @property {String}
  */
  label: null,

  /** @private */
  toString: function() {
    return "SC.Error:%@:%@ (%@)".fmt(SC.guidFor(this), this.get('message'), this.get('code'));
  },
  
  /**
    Walk like a duck.
    
    @property {Boolean}
  */
  isError: YES
}) ;

/**
  Creates a new SC.Error instance with the passed description, label, and
  code.  All parameters are optional.
  
  @param description {String} human readable description of the error
  @param label {String} human readable name of the item with the error
  @param code {Number} an error code to use for testing.
  @returns {SC.Error} new error instance.
*/
SC.Error.desc = function(description, label, value, code) {
  var opts = { message: description } ;
  if (label !== undefined) opts.label = label ;
  if (code !== undefined) opts.code = code ;
  if (value !== undefined) opts.errorValue = value ;
  return this.create(opts) ;
} ;

/**
  Shorthand form of the SC.Error.desc method.

  @param description {String} human readable description of the error
  @param label {String} human readable name of the item with the error
  @param code {Number} an error code to use for testing.
  @returns {SC.Error} new error instance.
*/
SC.$error = function(description, label, value, c) { 
  return SC.Error.desc(description,label, value, c); 
} ;

/**
  Returns YES if the passed value is an error object or false.
  
  @param {Object} ret object value
  @returns {Boolean}
*/
SC.ok = function(ret) {
  return (ret !== false) && !(ret && ret.isError);
};

/** @private */
SC.$ok = SC.ok;

/**
  Returns the value of an object.  If the passed object is an error, returns
  the value associated with the error; otherwise returns the receiver itself.
  
  @param {Object} obj the object
  @returns {Object} value 
*/
SC.val = function(obj) {
  if (obj && obj.isError) {
    return obj.get ? obj.get('errorValue') : null ; // Error has no value
  } else return obj ;
};

/** @private */
SC.$val = SC.val;

// STANDARD ERROR OBJECTS

/**
  Standard error code for errors that do not support multiple values.
  
  @property {Number}
*/
SC.Error.HAS_MULTIPLE_VALUES = -100 ;
