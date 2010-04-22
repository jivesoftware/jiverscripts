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

module("jive.conc.synchronize", {
    setup: function() {
        this.promise_foo = new jive.conc.Promise();
        this.promise_bar = new jive.conc.Promise();

        this.obj = {
            foo: this.promise_foo,
            bar: this.promise_bar,
            nao: 3
        };

        this.array = [this.promise_foo, this.promise_bar, 3];
    }
});

asyncTest("synchronizes an object with promises as values", 3, function() {
    jive.conc.synchronize(this.obj).addCallback(function(fulfilled) {
        ok( fulfilled.foo == 1, "property 'foo' fulfilled with value 1" );
        ok( fulfilled.bar == 2, "property 'bar' fulfilled with value 2" );
        ok( fulfilled.nao == 3, "property 'nao' retained value 3" );
        start();
    });

    this.promise_foo.emitSuccess(1);
    this.promise_bar.emitSuccess(2);
});

asyncTest("synchronizes an array of promises", 4, function() {
    jive.conc.synchronize(this.array).addCallback(function(fulfilled) {
        ok( fulfilled[0] == 1, "first value fulfilled with value 1" );
        ok( fulfilled[1] == 2, "second value fulfilled with value 2" );
        ok( fulfilled[2] == 3, "third value retained value 3" );
        ok( Object.prototype.toString.call(fulfilled) == "[object Array]",
            "fulfilled value is an array" );
        start();
    });

    this.promise_foo.emitSuccess(1);
    this.promise_bar.emitSuccess(2);
});

asyncTest("emits an error if any one promise emits an error", 1, function() {
    jive.conc.synchronize(this.obj).addErrback(function(a, b) {
        ok( a == 'foo' && b == 'bar', "synchronize() was interrupted by an error" );
        start();
    });

    this.promise_foo.emitSuccess(1);
    this.promise_bar.emitError('foo', 'bar');
});

asyncTest("emits 'cancel' if any one promise emits 'cancel'", 1, function() {
    jive.conc.synchronize(this.obj).addCancelback(function() {
        ok( true, "synchronize() was interrupted by a cancellation" );
        start();
    });

    this.promise_foo.emitSuccess(1);
    this.promise_bar.cancel('foo', 'bar');
});
