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

(function(){
    // Returns true if the given array contains the given element and false
    // otherwise.
    function contains(array, e) {
        for (var i = 0; i < array.length; i += 1) {
            if (array[i] === e) {
                return true;
            }
        }
        return false;
    }

    function compose(/* classes */) {
        var classes = Array.prototype.slice.call(arguments)
          , original = jive.oo.Class
          , chain = []
          , ultimate = []
          , parent;

        for (var i = 0; i < classes.length; i += 1) {
            chain.push(classes[i]);  // add each class to the inheritance chain.

            // Record each class's parent class if it has one.
            parent = classes[i].superclass;
            if (parent !== original && !contains(ultimate, parent) && !contains(chain, parent)) {
                ultimate.push(parent);
            }
        }

        // Only one ultimate class is allowed.
        if (ultimate.length > 1) {
            throw "Cannot create linear inheritance chain. Make sure classes that you are mixing in do not inherit from different parent classes.";
        } else if (ultimate.length == 1 && chain[0].superclass !== ultimate[0]) {
            chain.unshift(ultimate[0]);
        }

        var comp = chain[0];
        for (i = 1; i < chain.length; i += 1) {
            comp = comp.extend(chain[i].definition);
        }

        return comp;
    }

    this.jive = this.jive || {};
    jive.oo = jive.oo || {};
    jive.oo.compose = compose;
})();
