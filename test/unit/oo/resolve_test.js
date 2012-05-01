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

/*jslint laxbreak:true forin:true browser:true */
/*globals jive module test ok equal */

module('jive.oo.resolve', {
    setup: function() {
        this.superKlass = jive.oo.Class.extend(function(protect) {
            this.doubled = function(v) {
                return v * 2;
            };
        });

        this.klass = this.superKlass.extend(function(protect, _super) {
            protect.protectedMember = function() {
                return 'foo';
            };

            this.publicMember = function() {
                return 'bar';
            };

            this.invokeRenamed = function() {
                return this.renamedProtectedMember();
            };

            this.doubled = function(v) {
                return _super.doubled.call(this, v);
            };
        });
    }
});

test('renames a protected member', 1, function() {
    var ModifiedKlass = jive.oo.resolve({
        protectedMember: 'renamedProtectedMember'
    }, this.klass);
    var instance = new ModifiedKlass();

    equal( instance.invokeRenamed(), 'foo', 'invoked the renamed method' );
});

test('renames a public member', 1, function() {
    var ModifiedKlass = jive.oo.resolve({
        publicMember: 'renamedPublicMember'
    }, this.klass);
    var instance = new ModifiedKlass();

    equal( instance.renamedPublicMember(), 'bar', 'invoked the renamed method' );
});

test('preserves the parent of the original class', 1, function() {
    var ModifiedKlass = jive.oo.resolve({
        publicMember: 'renamedPublicMember'
    }, this.klass);

    equal( ModifiedKlass.superclass, this.superKlass, 'the parent of ModifiedKlass is superKlass' );
});

test('preserves members that are not renamed', 1, function() {
    var ModifiedKlass = jive.oo.resolve({
        protectedMember: 'renamedProtectedMember'
    }, this.klass);
    var instance = new ModifiedKlass();

    equal( instance.publicMember(), 'bar', 'invoked ModifiedKlass#publicMember()' );
});

test('renames members of a class that was defined with an object literal', 1, function() {
    var klass = jive.oo.Class.extend({
        publicMember: function() {
            return 'bar';
        }
    });

    var ModifiedKlass = jive.oo.resolve({ publicMember: 'renamed' }, klass);
    var instance = new ModifiedKlass();

    equal( instance.renamed(), 'bar', 'invoked ModifiedKlass#renamed()' );
});

test('excludes a member if `undefined` is given instead of a new name', 2, function() {
    var undef;

    var ModifiedKlass = jive.oo.resolve({
        publicMember: undef
    }, this.klass);
    var instance = new ModifiedKlass();

    ok( !instance.hasOwnProperty('publicMember'), 'instance does not have its own "publicMember" property' );
    ok( typeof instance.publicMember == 'undefined', '`instance.publicMember` is undefined' );
});

test('excludes members before renaming members', 1, function() {
    var undef;

    var ModifiedKlass = jive.oo.resolve({
        protectedMember: 'renamedProtectedMember',
        invokeRenamed: 'publicMember',
        publicMember: undef
    }, this.klass);
    var instance = new ModifiedKlass();

    equal( instance.publicMember(), 'foo', 'ModifiedKlass#publicMember() now returns "foo"' );
});

test('preserves _super references', 1, function() {
    var undef;

    var ModifiedKlass = jive.oo.resolve({
        protectedMember: 'renamedProtectedMember',
        invokeRenamed: 'publicMember',
        publicMember: undef
    }, this.klass);
    var instance = new ModifiedKlass();

    equal( instance.doubled(2), 4, 'invoked doubled() implementation from superclass' );
});

test('updates _super references when stacking mixins', 1, function() {
    var undef;

    var ExtraDoubler = this.superKlass.extend(function(protect, _super) {
        this.doubled = function(v) {
            var extra = v + 1;
            return _super.doubled.call(this, extra);
        };
    });

    var ModifiedKlass = jive.oo.compose(
        ExtraDoubler,
        jive.oo.resolve({
            protectedMember: 'renamedProtectedMember',
            invokeRenamed: 'publicMember',
            publicMember: undef
        }, this.klass)
    );
    var instance = new ModifiedKlass();

    equal( instance.doubled(2), 6, 'new implementation of doubled() passes through odd adjustment from ExtraDoubler' );
});
