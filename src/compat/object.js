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

/**
 * Object.create(obj) -> Object
 * - obj (Object): existing object to create a descendant of
 *
 * Returns a new object that has the given `obj` as its prototype.  This method
 * can be used to get prototypal inheritance without using the `new` keyword
 * directly.
 *
 * This implementation comes from:
 * http://ejohn.org/blog/ecmascript-5-objects-and-properties/
 */
if (typeof Object.create == 'undefined') {
    (function() {
        var defineProperty = Object.defineProperty || function(obj, name, desc) {
            if (desc.hasOwnProperty('value')) {
                obj[name] = desc.value;
            }
        };

        var defineProperties = Object.defineProperties || function(obj, props) {
            for (var name in props) {
                if (props.hasOwnProperty(name)) {
                    defineProperty(obj, name, props[name]);
                }
            }
        };

        Object.create = function( proto, props ) {
            var ctor = function( ps ) {
                if ( ps ) {
                    defineProperties( this, ps );
                }
            };
            ctor.prototype = proto;
            return new ctor( props );
        };
    })();
}

/**
 * Object.keys(obj) -> [string]
 * - obj (Object): object to read keys from
 *
 * Returns an array of the attribute names on `obj`.
 **/
if (typeof Object.keys == 'undefined') {
    Object.keys = function(obj) {
        var keys = [];
        for ( var k in obj ) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };
}
