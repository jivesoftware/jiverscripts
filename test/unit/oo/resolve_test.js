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
/*extern jive */

module('jive.oo.resolve', {
    setup: function() {
        this.superKlass = jive.oo.Class.extend({});

        this.klass = this.superKlass.extend(function(protect) {
            protect.protectedMember = function() {
                return 'foo';
            };

            this.publicMember = function() {
                return 'bar';
            };

            this.invokeRenamed = function() {
                return this.renamedProtectedMember();
            };
        });
    }
});

test('renames a protected member', 1, function() {
    var modifiedKlass = jive.oo.resolve({
        protectedMember: 'renamedProtectedMember'
    }, this.klass);
    var instance = new modifiedKlass();

    equal( instance.invokeRenamed(), 'foo', 'invoked the renamed method' );
});

test('renames a public member', 1, function() {
    var modifiedKlass = jive.oo.resolve({
        publicMember: 'renamedPublicMember'
    }, this.klass);
    var instance = new modifiedKlass();

    equal( instance.renamedPublicMember(), 'bar', 'invoked the renamed method' );
});

test('preserves the parent of the original class', 1, function() {
    var modifiedKlass = jive.oo.resolve({
        publicMember: 'renamedPublicMember'
    }, this.klass);

    equal( modifiedKlass.superclass, this.superKlass, 'the parent of modifiedKlass is superKlass' );
});

test('preserves members that are not renamed', 1, function() {
    var modifiedKlass = jive.oo.resolve({
        protectedMember: 'renamedProtectedMember'
    }, this.klass);
    var instance = new modifiedKlass();

    equal( instance.publicMember(), 'bar', 'invoked modifiedKlass#publicMember()' );
});

test('renames members of a class that was defined with an object literal', 1, function() {
    var klass = jive.oo.Class.extend({
        publicMember: function() {
            return 'bar';
        }
    });

    var modifiedKlass = jive.oo.resolve({ publicMember: 'renamed' }, klass);
    var instance = new modifiedKlass();

    equal( instance.renamed(), 'bar', 'invoked modifiedKlass#renamed()' );
});

test('excludes a member if `undefined` is given instead of a new name', 2, function() {
    var undefined;

    var modifiedKlass = jive.oo.resolve({
        publicMember: undefined
    }, this.klass);
    var instance = new modifiedKlass();

    ok( !instance.hasOwnProperty('publicMember'), 'instance does not have its own "publicMember" property' );
    ok( typeof instance.publicMember == 'undefined', '`instance.publicMember` is undefined' );
});

test('excludes members before renaming members', 1, function() {
    var undefined;

    var modifiedKlass = jive.oo.resolve({
        protectedMember: 'renamedProtectedMember',
        invokeRenamed: 'publicMember',
        publicMember: undefined
    }, this.klass);
    var instance = new modifiedKlass();

    equal( instance.publicMember(), 'foo', 'modifiedKlass#publicMember() now returns "foo"' );
});
