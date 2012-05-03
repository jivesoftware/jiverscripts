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


/*jslint laxbreak:true forin:true browser:true */
/*extern jive */

this.jive = this.jive || {};
/**
 * Namespace grouping together classes and functions that provide
 * object-oriented support.
 *
 * @namespace
 * @name jive.oo
 */
jive.oo = jive.oo || {};

/**
 * An implementation of classical inheritance in JavaScript adapted from [John
 * Resig's Simple JavaScript Inheritance][1].
 *
 * This adaptation supports true protected members and supports class
 * composition via {@link jive.oo.compose} and abstract members via {@link jive.oo._abstract}.
 *
 * [1]: http://ejohn.org/blog/simple-javascript-inheritance/  "Simple JavaScript Inheritance"
 *
 * @class
 */
jive.oo.Class = function(){};

/**
 * Creates a new subclass.  The subclass will also have its own `extend()`
 * method.
 *
 * @function
 * @param   {Function|Object}   definition  definition of the methods and properties of the new class
 * @returns {jive.oo.Class} returns a new subclass
 */
jive.oo.Class.extend = (function(){
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

    var initializing = false;

    // Create a new Class that inherits from this class
    return function extend(definition) {
        var _super = this['protected'] || {}
          , name;

        // Instantiate a base class (but only create the instance,
        // don't run the init constructor)
        initializing  = true;
        var prototype = new this();
        var protect   = create(_super);
        initializing  = false;

        // Classes are defined by a given function.  Within the function body
        // properties assigned to `this` become public members and
        // properties assigned to the function's argument become protected
        // members.
        if (typeof definition == 'function') {
            definition.call(prototype, protect, _super);
        } else {
            // If an object is given all members of that object become public
            // members of the class.
            for (name in definition) {
                if (definition.hasOwnProperty(name)) {
                    prototype[name] = definition[name];
                }
            }
        }

        // Copy public properties onto the the class definition
        for (name in prototype) {
            if (prototype.hasOwnProperty(name)) {
                if (typeof prototype[name] != 'function') {
                    throw "Public members must be methods - public variables are not allowed: '"+ name +"'";
                } else if (typeof protect[name] == 'undefined' || !protect.hasOwnProperty(name)) {
                    protect[name] = prototype[name];
                } else {
                    throw "Public and protected properties with the same name are not allowed: '"+ name +"'";
                }
            }
        }

        // The dummy class constructor
        function Class() {
            var instance = this instanceof Class ? this : create(Class.prototype)
              , name
              , protectedInstance = create(Class['protected']);

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

            // Check for abstract members
            if ( !initializing && jive.oo._abstract ) {
                for (name in protectedInstance) {
                    if (protectedInstance[name] === jive.oo._abstract) {
                        throw "A class with abstract members cannot be instantiated: '"+ name +"'";
                    }
                }
            }

            if (!initializing) {
                // Replace public methods with proxies to the protected
                // object.  But skip this step if not initializing to
                // preserve the original method definitions in the
                // prototype chain.
                for (name in Class.prototype) {
                    if (typeof Class.prototype[name] == 'function' &&
                        typeof protectedInstance[name] == 'function') {
                        instance[name] = proxy(name);
                    }
                }

                // All construction is actually done in the init method
                if (protectedInstance.init) {
                    protectedInstance.init.apply(protectedInstance, arguments);
                }
            }

            return instance;
        }

        // Populate our constructed prototype object
        Class.prototype    = prototype;
        Class['protected'] = protect;
        Class.definition   = definition;

        // Enforce the constructor to be what we expect
        Class.constructor = Class;
        Class.superclass = this;

        // And make this class extendable
        Class.extend = extend;

        return Class;
    };
})();
