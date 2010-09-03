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
jive.oo = jive.oo || {};

/**
 * Function for renaming properties of a class.  It takes a map from old names
 * to new names and a class and returns a new class that is the same as the
 * original except that the given property names have been changed.
 *
 * For example, you may want to compose two classes that implement incompatible
 * definitions of the `init()` method.  You can use `jive.oo.resolve()` to
 * rename those `init()` methods before composing the classes so that a
 * subclass of the composed classes can call the `init()` methods of both of
 * its parents:
 *
 *     var Spork = jive.oo.compose(
 *         jive.oo.resolve({ init: 'initSpoon' }, Spoon),
 *         jive.oo.resolve({ init: 'initFork' }, Fork)
 *     ).extend(function(protect) {
 *         protect.init = function(spoonOpts, forkOpts) {
 *             this.initSpoon(spoonOpts);
 *             this.initFork(forkOpts);
 *         };
 *     });
 *
 * You can also use `jive.oo.resolve()` to exclude members from a class by giving
 * a value of `undefined` instead of a new name.
 *
 * This method was inspired by a similar method in [traits.js][].
 *
 * [traits.js]: http://www.traitsjs.org/  (traits.js)
 *
 * @function
 * @param {Object} resolutions map of old names to new names (strings to strings)
 * @param {jive.oo.Class} klass a class to modify
 * @returns {jive.oo.Class} a new class that has been modified appropriately
 * @requires jive.oo.Class
 */
jive.oo.resolve = function(resolutions, klass) {
    var undefined;

    return klass.superclass.extend(function(protect) {
        var definition = klass.definition
          , public = this;

        if (typeof definition == 'function') {
            definition.call(public, protect);
        } else {
            for (name in definition) {
                if (definition.hasOwnProperty(name)) {
                    public[name] = definition[name];
                }
            }
        }

        exclude(public);
        exclude(protect);

        rename(public);
        rename(protect);

        function exclude(def) {
            eachProp(def, function(name) {
                if (resolutions[name] === undefined) {
                    delete def[name];
                }
            });
        }

        function rename(def) {
            eachProp(def, function(name) {
                if (resolutions[name]) {
                    def[resolutions[name]] = def[name];
                    delete def[name];
                }
            });
        }

        function eachProp(def, callback) {
            for (var name in def) {
                if (resolutions.hasOwnProperty(name) && def.hasOwnProperty(name)) {
                    callback(name);
                }
            }
        }
    });
};
