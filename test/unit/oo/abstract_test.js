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

module('jive.oo._abstract', {
    setup: function() {
        this.AbstractClass = jive.oo.Class.extend(function(protect) {
            this.publicMember = jive.oo._abstract;
            protect.protectedMember = jive.oo._abstract;
        });
    }
});

test('An abstract class cannot be instantiated', 1, function() {
    try {
        var instance = new this.AbstractClass();
    } catch(_) {
        ok( true, 'AbstractClass throws an error when you try to instantiate it' );
    }
});

test('abstract classes can be subclassed', 1, function() {
    try {
        var ConcreteClass = this.AbstractClass.extend(function(protect) {
            this.publicMember = function() { return 'foo'; };
            protect.protectedMember = function() { return 'bar'; };
        });
    } catch(_) {
        ok( false, 'An error occurred creating a subclass of AbstractClass' );
    }

    ok( typeof ConcreteClass != 'undefined', 'successfully created a subclass of AbstractClass' );
});

test('concrete subclasses can be instantiated', 1, function() {
    try {
        var ConcreteClass = this.AbstractClass.extend(function(protect) {
            this.publicMember = function() { return 'foo'; };
            protect.protectedMember = function() { return 'bar'; };
        });

        var instance = new ConcreteClass();
    } catch(_) {
        ok( false, 'An error occurred creating an instance of ConcreteClass' );
    }

    ok( instance instanceof ConcreteClass, 'successfully created an instance of ConcreteClass' );
});
