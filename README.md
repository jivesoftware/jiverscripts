# JiverScripts

A set of small, reusable JavaScript utilities.  These tools have no external
dependencies.  They are designed so that they can be easily included with a
JavaScript framework or with other libraries.

## jive.oo.Class

This is an implementation of classical inheritance.  It is based on [John
Resig's][Simple Inheritance] implemantion, but is adapted to support true
protected members.  Here is a quick example of how jive.oo.Class is used:

[Simple Inheritance]: http://ejohn.org/blog/simple-javascript-inheritance/  "Simple Inheritance"

    var Button = jive.oo.Class.extend(function(protected) {
        this.init = function(interval) {
            this.interval = interval;
            this.lastPushed = new Date();
        };

        this.push = function() {
            if (this.intervalElapsed()) {
                this.badThings();
            } else {
                this.lastPushed = new Date();
            }
        };

        protected.intervalElapsed = function() {
            var now = new Date();
            return (now - this.lastPushed) < this.interval;
        };

        protected.badThings = function() {
            throw "You waited too long";
        };
    });

    var EventedButton = Button.extend(function(protected) {
        this.init = function(interval) {
            this._super(interval);
            this.startCount();
        };

        this.push = function() {
            clearTimeout(this.timeout);
            this.startCount();
        };

        protected.startCount = function() {
            var self = this;
            this.timeout = setTimeout(function() {
                self.badThings();
            }, this.interval);
        };
    });

    var button = new EventedButton(108);
    setInterval(function() {
        button.push();
    }, 104);

To use jive.oo.Class include the file `class.js` in your project.  It has no
dependencies.

## jive.conc

### jive.conc.observable

This is a mixin that can allow any object to emit events.  This library is
based on the [Node.js EventEmitter API][nodejs].  This implementation is
adapted to run in the browser.

[nodejs]: http://nodejs.org/  "node.js"

Browsers already include a native event system that can be enriched by various
JavaScript frameworks.  But that event system is designed to model user
interactions with DOM events.  jive.conc.observable is oriented at events
emitted by JavaScript objects rather than DOM nodes.

You can use jive.conc.observable to allow JavaScript classes to communicate in
a more loosely coupled fashion than you would get with method calls and
callback arguments.

jive.conc.observable has no dependencies; however if you include
jive.conc.nextTick you will get better performance.

See the comments in observable.js for more documentation.

### jive.conc.nextTick

You can defer execution in the browser using the native setTimeout method.
However a callback scheduled with setTimeout has a minimum delay of 10
milliseconds before it runs in many browsers.  This is true even if the delay
argument given to setTimeout is 0 or 1.

jive.conc.nextTick functions similarly to setTimeout - it schedules a callback
to be run without blocking the calling code.  But it can run callbacks with
less than a 1 millisecond delay in browsers that support the postMessag API.

jive.conc.nextTick is based on work by [David Baron][].

[David Baron]: http://dbaron.org/log/20100309-faster-timeouts  "David Baron's blog"

jive.conc.nextTick has no dependencies.  See the comments in `next_tick.js` for
more information.

### jive.conc.Promise

jive.conc.Promise is an implementation of the Promise API formerly implemented
in [Node.js][nodejs] adapted for use in the browser.  It is useful for
abstracting asynchronous patterns.

jive.conc.Promise depends on jive.conc.observable.  See the comments in
`promise.js` for more documentation.

### jive.conc.synchronize

jive.conc.synchronize is a helper function that can greatly simplify code where
you need to pull values from multiple asynchronous operations into one
function call.  It builds on the Promise API.

jive.conc.synchronize depends on jive.conc.observable and jive.conc.Promise.
See the comments in `synchronize.js` for more documentation.

## jive.compat

`array.js` and `object.js` provide definitions for various Array and Object
methods that are defined in the ECMAScript 5th edition specification but that
are not implemented in every browser.  These methods include Array#forEach,
Array#map, Array#reduce, Array#indexOf, and Object#create among others.

These files have no dependencies.  See the documents in each file for
documentation on each method.

## running the tests

JiverScripts comes with a full suite of unit tests based on [QUnit][].  You
will need to check out a copy of QUnit to run the tests.  If you have checked
out this code using git you can check out QUnit with this command:

[QUnit]: http://docs.jquery.com/QUnit  "QUnit"

    git submodule update --init

Once that is done you can run the tests by opening `test/index.html` in any web
browser.
