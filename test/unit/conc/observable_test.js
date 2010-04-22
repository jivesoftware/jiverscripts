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

module("jive.conc.observable", {
    setup: function() {
        this.emitter = {};
        jive.conc.observable(this.emitter);
    }
});

test("mixes into an existing object", 4, function() {
    ok( typeof this.emitter.listeners == 'function', "emitter has a method called listeners()" );
    ok( typeof this.emitter.addListener == 'function', "emitter has a method called addListener()" );
    ok( typeof this.emitter.removeListener == 'function', "emitter has a method called removeListener()" );
    ok( typeof this.emitter.emit == 'function', "emitter has a method called emit()" );
});

test("binds event handlers", 1, function() {
    var handler = function() {};
    this.emitter.addListener('foo', handler);
    ok( this.emitter.listeners('foo')[0] === handler, "bound a handler to the 'foo' event" );
});

test("unbinds event handlers from a given event", 2, function() {
    var handler_a = function() {}
      , handler_b = function() {};
    this.emitter.addListener('foo', handler_a).addListener('foo', handler_b);
    ok( this.emitter.listeners('foo').length === 2, "bound two handlers to the 'foo' event" );
    this.emitter.removeListener('foo');
    ok( this.emitter.listeners('foo').length === 0, "unbound handlers from the 'foo' event" );
});

test("unbinds a specific event handler from a given event", 3, function() {
    var handler_a = function() {}
      , handler_b = function() {};
    this.emitter.addListener('foo', handler_a).addListener('foo', handler_b);
    ok( this.emitter.listeners('foo').length === 2, "bound two handlers to the 'foo' event" );
    this.emitter.removeListener('foo', handler_a);
    ok( this.emitter.listeners('foo').length === 1, "one event handler remains bound to the 'foo' event" );
    ok( this.emitter.listeners('foo')[0] === handler_b, "handler_b remains bound to the 'foo' event" );
});

asyncTest("emits events", 1, function() {
    this.emitter.addListener('testEvent', function() {
        ok( true, "event handler was called" );
        start();
    });
    this.emitter.emit('testEvent');
});

asyncTest("event handlers do not block", 1, function() {
    var evented = false;
    this.emitter.addListener('testEvent', function() {
        evented = true;
        start();
    });
    this.emitter.emit('testEvent');
    ok( !evented, "event handler has not been called yet" );
});

asyncTest("event handlers run in separate execution contexts", 1, function() {
    var calledLast = false;
    this.emitter.addListener('testEvent', function() {
        calledLast = true;
        throw "handlers that throw an error do not prevent other handlers from running";
    });
    this.emitter.addListener('testEvent', function() {
        ok( calledLast, "the event handler that does not throw an error was called last" );
        start();
    });
    this.emitter.emit('testEvent');
});

asyncTest("passes extra arguments to event handlers", 2, function() {
    this.emitter.addListener('testEvent', function(a, b) {
        ok( a == 'foo', "handler called with argument 'foo'" );
        ok( b == 'bar', "handler called with argument 'bar'" );
        start();
    });
    this.emitter.emit('testEvent', 'foo', 'bar');
});

asyncTest("event handlers are executed in the context of the object emitting the event", 1, function() {
    var that = this;
    this.emitter.addListener('testEvent', function() {
        ok( this === that.emitter, "event handler was called in the context of emitter" );
        start();
    });
    this.emitter.emit('testEvent');
});

asyncTest("emits a 'newListener' event when an event is bound", 2, function() {
    var handler = function() {};
    this.emitter.addListener('newListener', function(eventType, newHandler) {
        ok( eventType == 'testEvent', "'newListener' event was emitted with event type the listener was bound to" );
        ok( newHandler === handler, "'newListener' event was emitted with reference to the new event handler" );
        start();
    });
    this.emitter.addListener('testEvent', handler);
});

test("method calls return the receiver so that calls can be chained", 3, function() {
    ok( this.emitter.addListener('testEvent', function() {}) === this.emitter, "addListener() is chainable" );
    ok( this.emitter.removeListener('testEvent') === this.emitter, "removeListener() is chainable" );
    ok( this.emitter.emit('testEvent') === this.emitter, "emit() is chainable" );
});
