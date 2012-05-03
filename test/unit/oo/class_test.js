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

/*jslint laxbreak:true */
/*extern module test ok jive */

module("class");

test("creates a class", 1, function() {
    var klass = jive.oo.Class.extend(function() {});
    ok( typeof klass == "function", "extend() returns a constructor" );
});

test("a class constructs an object", 1, function() {
    var klass = jive.oo.Class.extend(function() {});
    var obj = new klass();
    ok( typeof obj == "object" && obj, "an instance is of type 'object'" );
});

test("classes keep a reference to their definition", 1, function() {
    var def = function(protect) { protect.foo = 1; };
    var klass = jive.oo.Class.extend(def);
    ok( klass.definition === def, "klass.definition is a reference to the original definition of klass" );
});


module("class members");

test("public methods are publicly accessible", 1, function() {
    var klass = jive.oo.Class.extend(function(protect) {
        this.hello = function() {
            return "hello";
        };
    });
    var obj = new klass();
    ok( obj.hello() == "hello", "the return value of hello() is 'hello'" );
});

test("protected members are not publicly accessible", 2, function() {
    var klass = jive.oo.Class.extend(function(protect) {
        protect.goodbye = function() { return "goodbye"; };
        protect.init = function() { this.name = "foo"; };
    });
    var obj = new klass();
    ok( typeof obj.goodbye == 'undefined', "protected methods are not publicly accessible" );
    ok( typeof obj.name == 'undefined', "protected variables are not publicly accessible" );
});

test("protected members can be accessed from public methods", 1, function() {
    var klass = jive.oo.Class.extend(function(protect) {
        this.hello = function() { return this.greeting() +" "+ this.name; };
        protect.greeting = function() { return "hello"; };
        protect.init = function() { this.name = "world"; };
    });
    var obj = new klass();
    ok( obj.hello() == "hello world", "hello() calls into protected members" );
});

test("protected members can be accessed from protected methods", 1, function() {
    var klass = jive.oo.Class.extend(function(protect) {
        this.hello = function() { return this.greeting(); };
        protect.greeting = function() { return "hello " + this.name; };
        protect.init = function() { this.name = "world"; };
    });
    var obj = new klass();
    ok( obj.hello() == "hello world", "hello() calls into protected members" );
});

test("public variables are not allowed", 1, function() {
    try {
        var klass = jive.oo.Class.extend(function() {
            this.foo = 1;
        });
    } catch(e) {
        ok( true, "an error is thrown when declaring a public variable" );
    }
});

test("public methods are always invoked in the context of the object that they belong to", 1, function() {
    var klass = jive.oo.Class.extend(function(protect) {
        this.hello = function() { return this.greeting(); };
        protect.greeting = function() { return "hello " + this.name; };
        protect.init = function() { this.name = "world"; };
    });
    var obj = new klass();
    var hello = obj.hello;
    ok( hello() == "hello world", "a copied reference of hello() runs in the same context as the original" );
});

test("public methods that return `this` return reference to the public interface of an object", 1, function() {
    var klass = jive.oo.Class.extend(function() {
        this.chain = function() { return this; };
    });
    var obj = new klass();
    ok( obj.chain() === obj, "chain() returns a reference to its receiver" );
});


module("inheritance");

test("public methods defined on a superclass are publicly accessible", 1, function() {
    var klass = jive.oo.Class.extend({
        hello: function() { return "hello"; }
    });
    var subklass = klass.extend({});
    var obj = new subklass();
    ok( obj.hello() == "hello", "called superclass method hello() externally" );
});

test("public methods can access protected members of a superclass", 1, function() {
    var klass = jive.oo.Class.extend(function(protect) {
        protect.greeting = function() { return "hello"; };
        protect.init = function() { this.name = "world"; };
    });
    var subklass = klass.extend(function() {
        this.hello = function() { return this.greeting() +" "+ this.name; };
    });
    var obj = new subklass();
    ok( obj.hello() == "hello world", "hello() calls into protected members of the superclass" );
});

test("protected methods can access protected members of a superclass", 1, function() {
    var klass = jive.oo.Class.extend(function(protect) {
        protect.init = function() { this.name = "world"; };
    });
    var subklass = klass.extend(function(protect) {
        this.hello = function() { return this.greeting(); };
        protect.greeting = function() { return "hello " + this.name; };
    });
    var obj = new subklass();
    ok( obj.hello() == "hello world", "greeting() reads from a superclass member" );
});

test("public methods can access public methods of a superclass", 1, function() {
    var klass = jive.oo.Class.extend(function(protect) {
        this.greeting = function() { return "hello"; };
    });
    var subklass = klass.extend(function(protect) {
        this.hello = function() { return this.greeting(); };
    });
    var obj = new subklass();
    ok( obj.hello() == "hello", "hello() calls superclass method greeting()" );
});

test("protected methods can access public methods of a superclass", 1, function() {
    var klass = jive.oo.Class.extend(function() {
        this.hello = function() { return "hello"; };
    });
    var subklass = klass.extend(function(protect) {
        this.goodbye = function() { return this.sayGoodbye(); };
        protect.sayGoodbye = function() { return this.hello() +"? goodbye!"; };
    });
    var obj = new subklass();
    ok( obj.goodbye() == "hello? goodbye!", "sayGoodbye() calls hello() on superclass" );
});

test("overridden public methods can invoke the super definition of the same method", 1, function() {
    var klass = jive.oo.Class.extend(function() {
        this.sum = function(a, b) { return a + b; };
    });
    var subklass = klass.extend(function(protect, _super) {
        this.sum = function(a, b) { return "sum is: "+ _super.sum.call(this, a, b); };
    });
    var obj = new subklass();
    ok( obj.sum(2, 3) == "sum is: 5", "sum() decorates its super definition" );
});

test("overridden protected methods can invoke the super definition of the same method", 1, function() {
    var klass = jive.oo.Class.extend(function(protect) {
        protect.sum = function(a, b) { return a + b; };
    });
    var subklass = klass.extend(function(protect, _super) {
        protect.sum = function(a, b) { return "sum is: "+ _super.sum.call(this, a, b); };
        this.getSum = function(a, b) { return this.sum(a, b); };
    });
    var obj = new subklass();
    ok( obj.getSum(2, 3) == "sum is: 5", "sum() decorates its super definition" );
});

test("stateful methods in a superclass affect the state of an instance", 1, function() {
    var klass = jive.oo.Class.extend(function() {
        this.init = function(n) { this.count = (n || 0); };
        this.inc  = function(n) { this.count += (n || 1); };
    });
    var subklass = klass.extend(function() {
        this.getCount = function() { return this.count; };
    });
    var obj = new subklass();
    obj.inc();
    obj.inc();
    equal( obj.getCount(), 2, "the count of obj is 2" );
});

test("classes have a 'superclass' property", 1, function() {
    var klass = jive.oo.Class.extend();
    var subklass = klass.extend();
    ok( subklass.superclass === klass, "the super class of subklass is klass" );
});


module("initializing");

test("Initialize method init() is called when a new instance is created", 1, function() {
    var initCalled = false;
    var klass = jive.oo.Class.extend(function(protect) {
        protect.init = function() {
            initCalled = true;
        };
    });
    var obj = new klass();
    ok( initCalled, "init() was called" );
});

test("Arguments given to the class constructer are passed to init()", 1, function() {
    var initCalled = false;
    var klass = jive.oo.Class.extend(function(protect) {
        protect.init = function(a, b) {
            initCalled = a && b;
        };
    });
    var obj = new klass(true, true);
    ok( initCalled, "init() was called" );
});


module("reflection");

test("An object is an instance of the class that constructed it", 1, function() {
    var klass = jive.oo.Class.extend({})
      , obj = new klass();
    ok( obj instanceof klass, "obj is an instance of klass" );
});

test("An instance of a subclass is also an instance of its parent class", 1, function() {
    var klass = jive.oo.Class.extend({})
      , subklass = klass.extend({})
      , obj = new subklass();
    ok( obj instanceof klass, "obj is an instance of klass" );
});

test("An instance of a subsubclass is also an instance of its grandparent class", 1, function() {
    var klass = jive.oo.Class.extend({})
      , subklass = klass.extend({})
      , subsubklass = subklass.extend({})
      , obj = new subsubklass();
    ok( obj instanceof klass, "obj is an instance of klass" );
});
