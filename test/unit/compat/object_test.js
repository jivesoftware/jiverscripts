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

/*extern module test asyncTest ok */

module("Object.create()", {
    setup: function() {
        this.obj = {
            foo: 1,
            bar: 2
        };

        this.child = Object.create(this.obj, {
            nao: { value: 3 },
            baz: { value: 4 }
        });
    }
});

test("creates an object", 1, function() {
    ok( typeof this.child == 'object' && this.child !== null, "obj is an object" );
});

test("sets the given argument as the prototype of the new object", 2, function() {
    ok( this.child.foo == 1, "the 'foo' property is defined to be 1" );
    ok( !this.child.hasOwnProperty('foo'), "child does not have its own 'foo' property" );
});

test("defines properties of the new object based on the given property descriptors", 4, function() {
    ok( this.child.nao == 3, "the 'nao' property is defined to be 3" );
    ok( this.child.baz == 4, "the 'nao' property is defined to be 3" );
    ok( this.child.hasOwnProperty('nao'), "child has its own 'nao' property" );
    ok( this.child.hasOwnProperty('baz'), "child has its own 'baz' property" );
});

module("Object.keys()", {
    setup: function() {
        this.obj = {
            foo: 1,
            bar: 2
        };

        function Child() {
            this.nao = 3;
        }
        Child.prototype = this.obj;

        this.child = new Child();

        this.inArray = function(a, obj) {
            for (var i = 0; i < a.length; i += 1) {
                if (a[i] === obj) { return i; }
            }
            return -1;
        };
    }
});

test("returns the property names of an object", 2, function() {
    ok( this.inArray(Object.keys(this.obj), 'foo') > -1, "keys include 'foo'" );
    ok( this.inArray(Object.keys(this.obj), 'bar') > -1, "keys include 'foo'" );
});

test("does not return property names inherited from object prototypes", 2, function() {
    ok( this.child.foo == 1, "child inherits the 'foo' property" );
    ok( this.inArray(Object.keys(this.child), 'foo') == -1, "keys do not include 'foo'" );
});
