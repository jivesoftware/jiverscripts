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
 * jive.conc.observable
 *
 * no dependencies
 *
 * This is a mix in that can add methods to any object for emitting events and
 * for registering event listeners.  This can be useful, for example, to create
 * view classes that emit events that a controller class can listen to and
 * handle.  That way view classes can push information to the controller
 * without having to know about the implementation of the controller.
 *
 * jive.conc.observable is a function.  Call it with some object as an argument
 * and it will add methods to that object.  For example:
 *
 *     var MyClass = function(...) { ... };
 *     jive.conc.observable(MyClass.prototype);
 *
 *     var myObj = new MyClass();
 *     myObj.addListener('someChange', function(changedValue) {
 *         alert(changedValue + ' just changed!');
 *     });
 *     myObj.listeners('someChange');  //=> [function(changedValue) { ... }]
 *
 * The events that jive.conc.observable makes possible are completely distinct
 * from DOM events.  These events are triggered on JavaScript objects, not DOM
 * elements.  However as with DOM events, listeners registered via
 * jive.conc.observable will be called asynchronously.  That means that
 * whatever bit of code emits an event will have to return control to the event
 * loop before any event listeners are called.
 *
 * Events may include any number of event parameters, which will be passed as
 * arguments to event listeners.
 *
 * Event listeners will be invoked in the context of the observable object.  So
 * in the body of an event listener `this` will refer to the object that
 * emitted the event.
 */

/*jslint browser:true */
/*extern jive */

jive = this.jive || {};
jive.conc = jive.conc || {};

jive.conc.observable = function(klass) {

    /**
     * listeners(type) -> [Function]
     * - type (String): listeners for this type of event will be returned
     *
     * Returns an arry of event listeners (functions) registered on the
     * receiver for the given type of event.  Returns an empty array if no
     * listeners are registered.
     */
    function listeners(type) {
        if (!this._events) {
            this._events = {};
        }
        if (!this._events[type]) {
            this._events[type] = [];
        }
        return this._events[type];
    }

    /**
     * addListener(event, listener) -> receiver
     * - event (String): event to listen for
     * - listener (Function): function to invoke when the given event occurs
     *
     * Registers an event listener on the receiver for the given type of event.
     * When that event is emitted by the receiver `listener` will be invoked
     * asynchronously with any event parameters as arguments.
     *
     * Returns the receiver so that this method can be cascaded.
     */
    function addListener(event, listener) {
        // Emit a 'newListener' event.  It is important to emit this event
        // before adding the listener to prevent a 'newListener' listener from
        // being called as soon as it is added.
        this.emit('newListener', event, listener);
        this.listeners(event).push(listener);
        return this;
    }

    /**
     * removeListener(event, listener) -> receiver
     * - event (String): event to unregister from
     * - listener (Function): specific listener to unregister
     *
     * Un-registers the given listener from the receiver as a listener for the
     * given type of event.
     *
     * Returns the receiver so that this method can be cascaded.
     */
    function removeListener(event, listener) {
        var listeners = this.listeners(event);
        for (var i = 0; i < listeners.length; i += 1) {
            if (listeners[i] === listener || typeof listener == 'undefined') {
                listeners.splice(i, 1);  // Removes the matching listener from the array.
                i -= 1;  // Compensate for array length changing within the loop.
            }
        }
        return this;
    }

    // Include jive.conc.nextTick for improved event dispatch performance.
    var nextTick = jive.conc.nextTick || function(callback) {
        // Setting the timeout to `0` prevents any unnecessary delay.
        setTimeout(callback, 0);
    };

    /**
     * emit(event[, eventParam, ...]) -> receiver
     * - event (String): event to emit
     * - eventParam (*): zero or more event parameters to pass as arguments to event listeners
     *
     * Emits an event, thus causing any event listeners registered on the
     * receiver for that event to be invoked asynchronously.  Any event
     * parameters that are given will be passed as arguments to event
     * listeners.
     *
     * Returns the receiver so that this method can be cascaded.
     */
    function emit(event/*, eventParams */) {
        var eventParams = Array.prototype.slice.call(arguments, 1),
            listeners = this.listeners(event),
            that = this;

        function execute(listener) {
            // Wrapping callbacks in a `nextTick()` causes callbacks to be run
            // asynchronously.  This means that event listeners will not block
            // the function that emits an event.  It also means that if one
            // listener throws an exception it will not prevent other listeners
            // from running.
            nextTick(function() {
                listener.apply(that, eventParams);
            });
        }

        for (var i = 0; i < listeners.length; i += 1) {
            execute(listeners[i]);
        }

        return this;
    }

    klass.listeners      = listeners;
    klass.addListener    = addListener;
    klass.removeListener = removeListener;
    klass.emit           = emit;
};
