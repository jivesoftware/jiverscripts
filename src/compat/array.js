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
 * Array#forEach(fun[, thisp]) -> undefined
 * - fun (Function(a[, i]) -> b): function that will be applied to each array
 *   element; the optional second argument is the index of the array element.
 * - thisp (Object): context in which fun will be invoked - `this` in `fun`
 *   will refer to `thisp`.
 *
 * Invokes `fun` on each element of the array in turn.
 *
 * This definition is compatible with the JavaScript 1.6 definition for
 * `Array#forEach` in Spidermonkey.
 *
 * This implementation comes from:
 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/forEach
 **/
if (typeof Array.prototype.forEach == 'undefined') {
    Array.prototype.forEach = function(fun /*, thisp*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function") {
            throw new TypeError();
        }

        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                fun.call(thisp, this[i], i, this);
            }
        }
    };
}

/**
 * Array#map(fun[, thisp]) -> [b]
 * - fun (Function(a[, i]) -> b): function that will be applied to each array
 *   element; the optional second argument is the index of the array element.
 * - thisp (Object): context in which fun will be invoked - `this` in `fun`
 *   will refer to `thisp`.
 *
 * Invokes `fun` on each element of the array and returns a new array of the
 * results of each application.
 *
 * This definition is compatible with the JavaScript 1.6 definition for
 * `Array#map` in Spidermonkey and with the definition in the Prototype library.
 *
 * This implementation comes from:
 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/map
 **/
if (typeof Array.prototype.map == 'undefined') {
    Array.prototype.map = function(fun /*, thisp*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function") {
            throw new TypeError();
        }

        var res = new Array(len);
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = fun.call(thisp, this[i], i);
            }
        }

        return res;
    };
}

/**
 * Array#reduce(fun[, initial]) -> a
 * - fun (Function(accumulator, element, index, array) -> a)
 *   - accumulator (a): result of application of `fun` to the previous
 *   array element, or `initial` for the first application
 *   - element (b): an element from the array
 *   - index (Number): index of `element` in the original array
 *   - array (Array): reference to the original array
 * - inititial (a): initial value
 *
 * Applies `fun` to `initial` and the first element of the array, and then to the
 * result and the second element, and so on.  Returns the result of applying
 * `fun` to the accumulated value and the last element of the array.
 *
 * The 'reduce' algorithm is also known as 'fold' and 'inject'.
 *
 * This definition is *not* compatible with the definitions of `Array#reduce`
 * or `Array#inject` in the Prototype library.  However it is compatible with
 * the JavaScript 1.6 definition of `Array#reduce` in Spidermonkey.
 *
 * This implementation comes from:
 * https://developer.mozilla.org/En/Core_JavaScript_1.5_Reference/Global_Objects/Array/Reduce
 **/
if (typeof Array.prototype.reduce == 'undefined') {
    Array.prototype.reduce = function(fun /*, initial*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function") {
            throw new TypeError();
        }

        // no value to return if no initial value and an empty array
        if (len == 0 && arguments.length == 1) {
            throw new TypeError();
        }

        var i = 0;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    rv = this[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= len) {
                    throw new TypeError();
                }
            } while (true);
        }

        for (; i < len; i++) {
            if (i in this) {
                rv = fun.call(null, rv, this[i], i, this);
            }
        }

        return rv;
    };
}

/**
 * Array#reduceRight()
 */
if (typeof Array.prototype.reduceRight == 'undefined') {
    Array.prototype.reduceRight = function(fun /*, initial*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function") {
            throw new TypeError();
        }

        // no value to return if no initial value, empty array
        if (len == 0 && arguments.length == 1) {
            throw new TypeError();
        }

        var i = len - 1;
        if (arguments.length >= 2) {
            var rv = arguments[1];
        } else {
            do {
                if (i in this) {
                    var rv = this[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0) {
                    throw new TypeError();
                }
            } while (true);
        }

        for (; i >= 0; i--) {
            if (i in this) {
                rv = fun.call(null, rv, this[i], i, this);
            }
        }

        return rv;
    };
}

/**
 * Array#filter(fun[, thisp]) -> [a]
 * - fun (Function(a[, i]) -> Boolean): function that will be applied to test
 *   each array element; the optional second argument is the index of the array
 *   element.
 * - thisp (Object): context in which fun will be invoked - `this` in `fun`
 *   will refer to `thisp`.
 *
 * Applies `fun` to each element of the array and returns a new array of all
 * the values for which `fun` returned `true`.
 *
 * This definition is compatible with the JavaScript 1.6 definition for
 * `Array#filter` in Spidermonkey and with the definition in the Prototype library.
 *
 * This implementation comes from:
 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/filter
 **/
if (typeof Array.prototype.filter == 'undefined') {
    Array.prototype.filter = function(fun /*, thisp*/) {
        var len = this.length >>> 0;
        if (typeof fun != "function") {
            throw new TypeError();
        }

        var res = new Array();
        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this) {
                var val = this[i]; // in case fun mutates this
                if (fun.call(thisp, val, i)) {
                    res.push(val);
                }
            }
        }

        return res;
    };
}

/**
 * Array#every(fun[, thisp]) -> boolean
 * - fun (Function(a[, i]) -> boolean): function that will be applied to each
 *   array element; the optional second argument is the index of the array
 *   element.
 * - thisp (Object): context in which fun will be invoked - `this` in `fun`
 *   will refer to `thisp`.
 *
 * Invokes `fun` on each element of the array.  Returns true if every
 * invocation of `fun` returns true or returns a truthy value.  Otherwise
 * returns false.
 *
 * This definition is compatible with the JavaScript 1.6 definition for
 * `Array#every` in Spidermonkey.
 *
 * This implementation comes from:
 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/every
 **/
if (typeof Array.prototype.every == 'undefined') {
    Array.prototype.every = function(fun /*, thisp*/)  {
        var len = this.length >>> 0;
        if (typeof fun != "function") {
            throw new TypeError();
        }

        var thisp = arguments[1];
        for (var i = 0; i < len; i++) {
            if (i in this &&
                !fun.call(thisp, this[i], i, this)) {
                return false;
            }
        }

        return true;
    };
}

/**
 * Array#some(fun[, thisp]) -> boolean
 * - fun (Function(a[, i]) -> boolean): function that will be applied to each
 *   array element; the optional second argument is the index of the array
 *   element.
 * - thisp (Object): context in which fun will be invoked - `this` in `fun`
 *   will refer to `thisp`.
 *
 * Invokes `fun` on each element of the array.  Returns true if at least one
 * invocation of `fun` returns true or returns a truthy value.  Otherwise
 * returns false.
 *
 * This definition is compatible with the JavaScript 1.6 definition for
 * `Array#every` in Spidermonkey.
 *
 * This implementation comes from:
 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/some
 **/
if (typeof Array.prototype.some == 'undefined') {
    Array.prototype.some = function(fun /*, thisp*/) {
        var i = 0,
            len = this.length >>> 0;

        if (typeof fun != "function") {
            throw new TypeError();
        }

        var thisp = arguments[1];
        for (; i < len; i++) {
            if (i in this &&
                fun.call(thisp, this[i], i, this)) {
                return true;
            }
        }

        return false;
    };
}

/**
 * Array#indexOf(searchElement[, fromIndex]) -> number
 * - searchElement (any): element to search for within the array
 * - fromIndex (number): index at which to begin the search
 *
 * Compares elements in the array with `searchElement` using strict equality
 * (===).  If any element matches `searchElement` the lowest matching index is
 * returned.  Otherwise -1 is returned.
 *
 * You can optionally restrict the search by passing a `fromIndex` argument.
 *
 * This definition is compatible with the JavaScript 1.6 definition for
 * `Array#indexOf` in Spidermonkey.
 *
 * This implementation comes from:
 * https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Array/indexOf
 */
if (typeof Array.prototype.indexOf == 'undefined') {
    Array.prototype.indexOf = function(elt /*, from*/) {
        var len = this.length >>> 0;

        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0) {
            from += len;
        }

        for (; from < len; from++) {
            if (from in this &&
                this[from] === elt) {
                return from;
            }
        }
        return -1;
    };
}

/**
 * Array#lastIndexOf()
 */
if (typeof Array.prototype.lastIndexOf == 'undefined') {
    Array.prototype.lastIndexOf = function(elt /*, from*/)  {
        var len = this.length;

        var from = Number(arguments[1]);
        if (isNaN(from)) {
            from = len - 1;
        } else {
            from = (from < 0)
                ? Math.ceil(from)
                : Math.floor(from);
            if (from < 0) {
                from += len;
            } else if (from >= len) {
                from = len - 1;
            }
        }

    for (; from > -1; from--) {
        if (from in this &&
            this[from] === elt)
            return from;
        }
        return -1;
    };
}
