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

module("jive.conc.Promise", {
    setup: function() {
        this.promise = new jive.conc.Promise();
    }
});

asyncTest("emits a success event", 1, function() {
    this.promise.addCallback(function() {
        ok( true, "success callback was called" );
        start();
    });
    this.promise.emitSuccess();
});

asyncTest("passes arguments with its success event", 1, function() {
    this.promise.addCallback(function(a, b) {
        ok( a == "foo" && b == "bar", "success callback was given 'foo' and 'bar'" );
        start();
    });
    this.promise.emitSuccess("foo", "bar");
});

asyncTest("does not emit success more than once", 1, function() {
    var callCount = 0;
    this.promise.addCallback(function() {
        callCount += 1;
        ok( callCount === 1, "success callback was called once" );
        start();
    });

    this.promise.emitSuccess();
    this.promise.emitSuccess();
});

test("addCallback() returns the receiver so that calls can be chained", 1, function() {
    ok(this.promise.addCallback(function() {}) === this.promise,
       "promise.addCallback(...) === promise" );
});

asyncTest("emits an error event", 1, function() {
    this.promise.addErrback(function() {
        ok( true, "error callback was called" );
        start();
    });
    this.promise.emitError();
});

asyncTest("passes arguments with its error event", 1, function() {
    this.promise.addErrback(function(a, b) {
        ok( a === "foo" && b === "bar", "error callback was called with 'foo' and 'bar'" );
        start();
    });
    this.promise.emitError("foo", "bar");
});

asyncTest("does not emit error more than once", 1, function() {
    var callCount = 0;
    this.promise.addErrback(function() {
        callCount += 1;
        ok( callCount === 1, "error callback was called once" );
        start();
    });

    this.promise.emitError();
    this.promise.emitError();
});

asyncTest("does not emit success after an error", 1, function() {
    this.promise.addCallback(function() {
        ok( false, "success callback was called" );
        start();
    });
    this.promise.addErrback(function() {
        ok( true, "error callback was called" );
        start();
    });

    this.promise.emitError();
    this.promise.emitSuccess();
});

asyncTest("does not emit error after a success", 1, function() {
    this.promise.addCallback(function() {
        ok( true, "success callback was called" );
        start();
    });
    this.promise.addErrback(function() {
        ok( false, "error callback was called" );
        start();
    });

    this.promise.emitSuccess();
    this.promise.emitError();
});

test("addErrback() returns the receiver so that calls can be chained", 1, function() {
    ok( this.promise.addErrback(function() {}) === this.promise,
       "promise.addErrback(...) === promise" );
});

asyncTest("emits a cancel event", 1, function() {
    this.promise.addCancelback(function() {
        ok( true, "cancel callback was called" );
        start();
    });
    this.promise.cancel();
});

asyncTest("does not pass arguments with its cancel event", 2, function() {
    var calledWith;
    this.promise.addCancelback(function(a, b) {
        ok( typeof a == 'undefined', "the first argument is undefined" );
        ok( typeof b == 'undefined', "the second argument is undefined" );
        start();
    });
    this.promise.cancel("foo", "bar");
});

asyncTest("does not emit cancel more than once", 1, function() {
    var callCount = 0;
    this.promise.addCancelback(function() {
        callCount += 1;
        ok( callCount === 1, "cancel callback was called once" );
        start();
    });

    this.promise.cancel();
    this.promise.cancel();
    this.promise.cancel();
});

asyncTest("does not emit success after being cancelled", 1, function() {
    this.promise.addCallback(function() {
        ok( false, "success callback was called" );
        start();
    });
    this.promise.addCancelback(function() {
        ok( true, "cancel callback was called" );
        start();
    });

    this.promise.cancel();
    this.promise.emitSuccess();
});

asyncTest("does not emit error after being cancelled", 1, function() {
    this.promise.addErrback(function() {
        ok( false, "error callback was called" );
        start();
    });
    this.promise.addCancelback(function() {
        ok( true, "cancel callback was called" );
        start();
    });

    this.promise.cancel();
    this.promise.emitError();
});

asyncTest("can emit cancel after a success", 2, function() {
    this.promise.addCallback(function() {
        ok( true, "success callback was called" );
    });
    this.promise.addCancelback(function() {
        ok( true, "cancel callback was called" );
        start();
    });

    this.promise.emitSuccess();
    this.promise.cancel();
});

asyncTest("can emit cancel after an error", 2, function() {
    this.promise.addErrback(function() {
        ok( true, "error callback was called" );
    });
    this.promise.addCancelback(function() {
        ok( true, "cancel callback was called" );
        start();
    });

    this.promise.emitError();
    this.promise.cancel();
});

test("addCancelback() returns the receiver so that calls can be chained", 1, function() {
    ok( this.promise.addCancelback(function() {}) === this.promise,
       "promise.addCancelback() === promise");
});

asyncTest("times out after a given delay", 1, function() {
    var begin = new Date();
    this.promise.addErrback(function() {
        var interval = (new Date()) - begin;
        ok( interval >= 25, "error callback was called after 25 ms elapsed" );
        start();
    });
    this.promise.timeout(25);
});

asyncTest("emits an error with an exception argument on timeout", 2, function() {
    this.promise.addErrback(function(a) {
        ok( a instanceof Error, "error callback is given an error object" );
        ok( a.message.match(/timeout/), "the error message mentions a timeout" );
        start();
    });
    this.promise.timeout(25);
});

asyncTest("does not emit a timeout error after a success", 1, function() {
    this.promise.addErrback(function() {
        ok( false, "error callback was called" );
    }).addCallback(function() {
        ok( true, "success callback was called" );
    });

    this.promise.timeout(20);
    this.promise.emitSuccess();

    setTimeout(function() { start(); }, 25);
});

asyncTest("does not emit a timeout error after another error", 1, function() {
    this.promise.addErrback(function(msg) {
        ok( !String(msg).match(/timeout/), "non-timeout error was emitted" );
    });

    this.promise.timeout(20);
    this.promise.emitError();

    setTimeout(function() { start(); }, 25);
});

asyncTest("does not emit a timeout error after being cancelled", 1, function() {
    this.promise.addErrback(function() {
        ok( false, "error callback was called" );
    }).addCancelback(function() {
        ok( true, "cancel callback was called" );
    });

    this.promise.timeout(20);
    this.promise.cancel();

    setTimeout(function() { start(); }, 25);
});

test("returns the previously set timeout if timeout() called with no arguments", 1, function() {
    this.promise.timeout(10000);
    ok( this.promise.timeout() === 10000, "promise timeout set to 10 seconds" );
});

test("returns `undefined` if timeout() called with no arguments and no timeout was set", 1, function() {
    ok( typeof this.promise.timeout() == 'undefined', "no timeout has been set" );
});

asyncTest("replaces a previous timeout if called with delay values twice", 1, function() {
    var begin = new Date();

    this.promise.addErrback(function() {
        var interval = (new Date()) - begin;
        ok( interval < 100, "error callback called after 25 ms delay" );
        start();
    });

    this.promise.timeout(101);
    this.promise.timeout(25);
});

test("timeout() returns the receiver so that calls can be chained if called with a delay value", 1, function() {
    ok( this.promise.timeout(10000) === this.promise,
       "promise.timeout(n) === promise" );
});

asyncTest("emits a 'complete' event after emitting a 'success' event", 1, function() {
    this.promise.always(function() {
        ok( true, "the 'complete' event handler was called" );
        start();
    });

    this.promise.emitSuccess('foo');
});

asyncTest("emits a 'complete' event after emitting an 'error' event", 1, function() {
    this.promise.always(function() {
        ok( true, "the 'complete' event handler was called" );
        start();
    });

    this.promise.emitError('bar');
});

asyncTest("does not emit a 'complete' event after emitting a 'cancel' event", 0, function() {
    this.promise.always(function() {
        ok( false, "the 'complete' event handler was called" );
    });

    this.promise.cancel();

    setTimeout(function() {
        start();
    }, 10);
});

asyncTest("does not emit a 'complete' event after emitting a 'cancel' event even if emitSuccess() is called", 0, function() {
    this.promise.always(function() {
        ok( false, "the 'complete' event handler was called" );
    });

    this.promise.cancel();
    this.promise.emitSuccess();

    setTimeout(function() {
        start();
    }, 10);
});

asyncTest("exposes then() method for binding success callbacks", 1, function() {
    this.promise.then(function() {
        ok( true, "the success handler was called" );
        start();
    });
    this.promise.emitSuccess();
});

asyncTest("accepts error callbacks via the then() method", 1, function() {
    this.promise.then(null, function() {
        ok( true, "the error handler was called" );
        start();
    });
    this.promise.emitError();
});

asyncTest("returns a new promise from the then() method", 1, function() {
    var newPromise = this.promise.then(function(v) {
        return v + 1;
    });
    newPromise.then(function(v) {
        equal( v, 3, "new promise resolved with value 3" );
        start();
    });
    this.promise.emitSuccess(2);
});

asyncTest("forwards errors to new promise created by then()", 1, function() {
    var newPromise = this.promise.then(function(v) {
        return v + 1;
    });
    newPromise.then(null, function(msg) {
        equal( msg, "error message", "new promise fails and gets error message" );
        start();
    });
    this.promise.emitError("error message");
});

asyncTest("fails new promise from then() when success callback throws an error", 1, function() {
    var newPromise = this.promise.then(function(v) {
        throw "synthetic error";
    });
    newPromise.then(null, function(msg) {
        ok( true, "new promise failed" );
        start();
    });
    this.promise.emitSuccess();
});
