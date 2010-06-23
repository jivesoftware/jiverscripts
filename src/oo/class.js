/*
 * Copyright 2010 Jive Software
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Adapted from:
// http://ejohn.org/blog/simple-javascript-inheritance/

/*jslint laxbreak:true forin:true browser:true */
/*extern jive */

// Inspired by base2 and Prototype
(function(){
    /**
     * Returns a new object that has the given `obj` as its prototype.  This method
     * can be used to get prototypal inheritance without using the `new` keyword
     * directly.
     *
     * This implementation comes from:
     * http://javascript.crockford.com/prototypal.html
     */
    var create = Object.create || function(o) {
        function F() {}
        F.prototype = o;
        return new F();
    };

    var initializing = false
      , fnTest = /xyz/.test(function(){return 'xyz';}) ? /\b_super\b/ : /.*/;

    // The base Class implementation (does nothing)
    this.jive = this.jive || {};
    jive.oo = jive.oo || {};
    jive.oo.Class = function(){};

    // Create a new Class that inherits from this class
    jive.oo.Class.extend = function extend(definition) {
        var _super = this.protected || {}
          , name;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing = true;
        var prototype = new this();
        var public    = create(this.public || {});
        var protected = create(_super);
        initializing = false;

        // Classes are defined by a given function.  Within the function body
        // properties assigned to `this` become public members and
        // properties assigned to the function's argument become protected
        // members.
        if (typeof definition == 'function') {
            definition.call(public, protected);
        } else {
            // If an object is given all members of that object become public
            // members of the class.
            for (name in definition) {
                if (definition.hasOwnProperty(name)) {
                    public[name] = definition[name];
                }
            }
        }

        // Copy public properties onto the the class definition
        for (name in public) {
            if (public.hasOwnProperty(name)) {
                if (typeof public[name] != 'function') {
                    throw "Public members must be methods - public variables are not allowed: '"+ name +"'";
                } else if (typeof protected[name] == 'undefined' || !protected.hasOwnProperty(name)) {
                    protected[name] = public[name];
                } else {
                    throw "Public and protected properties with the same name are not allowed: '"+ name +"'";
                }
            }
        }

        // Wrap methods that call `_super()`
        for (name in protected) {
            if (protected.hasOwnProperty(name) &&
              typeof protected[name] == "function" &&
              typeof _super[name] == "function" &&
              fnTest.test(protected[name])) {
                protected[name] = (function(name, fn){
                    return function() {
                        var tmp = this._super;

                        // Add a new ._super() method that is the same method
                        // but on the super-class
                        this._super = _super[name];

                        // The method only need to be bound temporarily, so we
                        // remove it when we're done executing
                        var ret = fn.apply(this, arguments);
                        this._super = tmp;

                        return ret;
                    };
                })(name, protected[name]);
            }
        }

        // The dummy class constructor
        function Class() {
            var instance = this
              , protectedInstance = create(Class.protected);

            // Wrap public methods so that they run in the context of the
            // protected instance.
            function proxy(name) {
                return function() {
                    var ret = protectedInstance[name].apply(protectedInstance, arguments);
                    // Swap return values if the method returns a reference to
                    // its receiver.
                    return ret === protectedInstance ? instance : ret;
                };
            }

            for (var name in Class.public) {
                if (typeof Class.public[name] == 'function') {
                    instance[name] = proxy(name);
                }
            }

            // All construction is actually done in the init method
            if ( !initializing && protectedInstance.init ) {
                protectedInstance.init.apply(protectedInstance, arguments);
            }

            return instance;
        }

        // Populate our constructed prototype object
        Class.prototype  = prototype;
        Class.public     = public;
        Class.protected  = protected;

        // Enforce the constructor to be what we expect
        Class.constructor = Class;

        // And make this class extendable
        Class.extend = extend;

        return Class;
    };
})();
