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

module("jive.oo.compose", {
    setup: function() {
        this.Foo = jive.oo.Class.extend(function(protect) {
            this.foo = function() {};
        });

        this.Bar = jive.oo.Class.extend(function(protect) {
            this.bar = function() {};
        });

        this.BaseOutput = jive.oo.Class.extend(function(protect) {
            this.output = function(str) {
                this.last = str;
                return str;
            };

            this.lastOutput = function() {
                return this.last;
            };
        });

        this.Doubler = this.BaseOutput.extend(function(protect, _super) {
            this.output = function(str) {
                var doubled = this.concat(str, str);
                return _super.output.call(this, doubled);
            };

            protect.concat = function(a, b) {
                return a + b;
            };
        });

        this.Quieter = this.BaseOutput.extend(function(protect, _super) {
            this.output = function(str) {
                var quiet = str.toLowerCase();
                return _super.output.call(this, quiet);
            };
        });

        this.Exclaimer = this.BaseOutput.extend(function(protect, _super) {
            this.output = function(str) {
                var exclaimed = this.concat(str, "!!");
                return _super.output.call(this, exclaimed);
            };

            protect.concat = function(a, b) {
                return a + b;
            };
        });
    }
});

test("composes classes", 2, function() {
    var FooBar = jive.oo.compose(this.Foo, this.Bar)
      , foobar = new FooBar();
    ok( typeof foobar.foo == 'function', "new class inherits method foo()" );
    ok( typeof foobar.bar == 'function', "new class inherits method bar()" );
});

test("composes classes that share a parent class", 1, function() {
    var QuietlyDoubled = jive.oo.compose(this.Doubler, this.Quieter)
      , filter = new QuietlyDoubled();
    ok( filter.output("Hello") == "hellohello", "output is downcased and doubled" );
});

test("orders classes so that rightmost classes inherit from leftmost classes", 2, function() {
    var DoublyExclaimed = jive.oo.compose(this.Doubler, this.Exclaimer);
    var DoubledFirst = jive.oo.compose(this.Exclaimer, this.Doubler);
    ok( (new DoublyExclaimed).output("Hello") == "Hello!!Hello!!", "exclamation marks are added before doubling" );
    ok( (new DoubledFirst).output("Hello") == "HelloHello!!", "exclamation marks are added after doubling" );
});

test("throws an error if inheritance chain cannot be made linear", 1, function() {
    var SomeClass = jive.oo.Class.extend()
      , SomeChildClass = SomeClass.extend()
      , NonLinear;
    try {
        NonLinear = jive.oo.compose(this.Doubler, this.Quieter, SomeChildClass);
    } catch(e) {
        ok( true, "jive.oo.compose() threw an exception" );
    }
});

test("creates instances with their own state", 3, function() {
    var DoubledFirst = jive.oo.compose(this.Exclaimer, this.Doubler)
      , DoublyExclaimed = jive.oo.compose(this.Doubler, this.Exclaimer)
      , first = new DoubledFirst()
      , second = new DoublyExclaimed();
    ok( first.output("Hello") == "HelloHello!!", "exclamation marks are added before doubling" );
    ok( second.output("Hello") == "Hello!!Hello!!", "exclamation marks are added after doubling" );
    ok( first.lastOutput() == "HelloHello!!", "state of `second` does not clobber state of `first`" );
});
