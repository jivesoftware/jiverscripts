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

module("jive.conc.nextTick()");

asyncTest("executes a callback", 1, function() {
    jive.conc.nextTick(function() {
        ok( true, "callback was called" );
        start();
    });
});

asyncTest("does not block", 1, function() {
    var callback = false;
    jive.conc.nextTick(function() {
        callback = true;
        start();
    });
    ok( !callback, "callback has not been called yet" );
});

asyncTest("callback is called within 10 milliseconds - this will not pass in every browser but that is ok", 1, function() {
    var begin = new Date();
    jive.conc.nextTick(function() {
        var interval = (new Date()) - begin;
        ok( interval < 10, "callback was delayed by fewer than 10 milliseconds" );
        start();
    });
});

asyncTest("callback is called within 2 milliseconds - this will not pass in every browser but that is ok", 1, function() {
    var begin = new Date();
    jive.conc.nextTick(function() {
        var interval = (new Date()) - begin;
        ok( interval < 2, "callback was delayed by fewer than 2 milliseconds" );
        start();
    });
});
