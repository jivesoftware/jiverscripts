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

module("Array#forEach()", {
    setup: function() {
        this.a = [1, 2, 3, 4];

        // Helper function for comparing arrays.
        this.equals = function(a, b) {
            if (a.length === b.length) {
                for (var i = 0; i < a.length; i += 1) {
                    if (a[i] !== b[i]) { return false; }
                }
                return true;
            } else {
                return false;
            }
        };
    }
});

test("runs a callback on every element in an array", 4, function() {
    var val = 0;
    this.a.forEach(function(e) {
        val += 1
        ok( e === val, "callback called with value "+ val );
    });
});

test("passes the index of each element to the callback", 4, function() {
    var idx = -1;
    this.a.forEach(function(e, i) {
        idx += 1
        ok( i === idx, "callback called with index "+ idx );
    });
});

test("passes the original array to the callback on each iteration", 4, function() {
    var that = this;
    this.a.forEach(function(e, i, orig) {
        ok( that.equals(orig, that.a), "original array was given as the third argument" );
    });
});

test("invokes callback in the context of the given object", 4, function() {
    var obj = {};
    this.a.forEach(function() {
        ok( this === obj, "callback called with context of obj" );
    }, obj);
});

test("throws a type error if no callback is given", 1, function() {
    try {
        this.a.forEach();
    } catch(e) {
        ok( e instanceof TypeError, "a type error was thrown" );
    }
});

module("Array#map()", {
    setup: function() {
        this.a = [1, 2, 3, 4];

        // Helper function for comparing arrays.
        this.equals = function(a, b) {
            if (a.length === b.length) {
                for (var i = 0; i < a.length; i += 1) {
                    if (a[i] !== b[i]) { return false; }
                }
                return true;
            } else {
                return false;
            }
        };
    }
});

test("runs a callback on every element in an array", 4, function() {
    var val = 0;
    this.a.map(function(e) {
        val += 1
        ok( e === val, "callback called with value "+ val );
    });
});

test("returns a new array", 1, function() {
    ok( this.equals(this.a.map(function(e) { return e + 1 }), [2, 3, 4, 5]),
        "map() returned a transformed array" );
});

test("passes the index of each element to the callback", 4, function() {
    var idx = -1;
    this.a.map(function(e, i) {
        idx += 1
        ok( i === idx, "callback called with index "+ idx );
    });
});

test("invokes callback in the context of the given object", 4, function() {
    var obj = {};
    this.a.map(function() {
        ok( this === obj, "callback called with context of obj" );
    }, obj);
});

test("throws a type error if no callback is given", 1, function() {
    try {
        this.a.map();
    } catch(e) {
        ok( e instanceof TypeError, "a type error was thrown" );
    }
});

module("Array#reduce()", {
    setup: function() {
        this.a = [1, 2, 3, 4];

        // Helper function for comparing arrays.
        this.equals = function(a, b) {
            if (a.length === b.length) {
                for (var i = 0; i < a.length; i += 1) {
                    if (a[i] !== b[i]) { return false; }
                }
                return true;
            } else {
                return false;
            }
        };
    }
});

test("passes an initial value and the first array element to the given function", 1, function() {
    var values,
        fun = function(a, b) {
            if (typeof values == 'undefined') {
                values = [a, b];
            }
        };
    this.a.reduce(fun, 0);
    ok( this.equals(values, [0, 1]), "reduce function called initially with arguments 0 and 1" );
});

test("passes the result of each function application as the first argument to the next function invocation", 2,
   function() {
    function fun(a, b) {
        if (b == 2) {
            ok( a == 1, "second invocation of reduce function called with 1 and 2" );
        } else if (b == 3) {
            ok( a == 3, "second invocation of reduce function called with 3 and 3" );
        }
        return a + b;
    }
    this.a.reduce(fun, 0);
});

test("passes every array element to the given function", 1, function() {
    var values = [],
        fun = function(a, b) { values.push(b); };
    this.a.reduce(fun, 0);
    ok( this.equals(values, this.a), "every value in the array was passed to the reduce function" );
});

test("returns the result of the function invocation on the last array element", 1, function() {
    function fun(a, b) { return a + b; }
    ok( this.a.reduce(fun, 0) == 10, "the sum of the elements in the array is 10" );
});

test("passes array element indexes as the third argument to the given function", 1, function() {
    var values = [],
        fun = function(a, b, c) {
            values.push(c);
        };
    this.a.reduce(fun, 0);
    ok( this.equals(values, [0, 1, 2, 3]), "the reduce function was passed indexes for each element" );
});

test("passes the original array as the fourth argument to the given function", 1, function() {
    var values = [],
        fun = function(a, b, c, d) {
            values.push(d);
        },
        that = this;
    this.a.reduce(fun, 0);
    ok( values.every(function(e) { return that.equals(e, that.a); }),
        "the original array is passed to the reduce function on every invocation" );
});

test("uses the first array element as an initial value if none is given", 2, function() {
    var values,
        fun = function(a, b) {
            if (typeof values == 'undefined') {
                values = [a, b];
            }
            return a + b;
        };
    this.a.reduce(fun);
    ok( this.equals(values, [1, 2]), "the first invocation of the reduce function was given 1 and 2 as arguments" );
    ok( this.a.reduce(fun) == 10, "the sum of every element in the array is 10" );
});

test("throws a `TypeError` if no function is given", 1, function() {
    try {
        this.a.reduce('foo');
    } catch(e) {
        ok( e instanceof TypeError, "a TypeError was thrown" );
    }
});

test("returns the initial value if the receiver is empty", 1, function() {
    ok( [].reduce(function() {}, 3) == 3, "reduce() returned the given initial value" );
});

test("throws a `TypeError` if the receiver is empty and no initial value is given", 1, function() {
    try {
        [].reduce(function() {});
    } catch(e) {
        ok( e instanceof TypeError, "a TypeError was thrown" );
    }
});

module("Array#reduceRight()", {
    setup: function() {
        this.a = [1, 2, 3, 4];

        // Helper function for comparing arrays.
        this.equals = function(a, b) {
            if (a.length === b.length) {
                for (var i = 0; i < a.length; i += 1) {
                    if (a[i] !== b[i]) { return false; }
                }
                return true;
            } else {
                return false;
            }
        };
    }
});

test("passes an initial value and the first array element to the given function", 1, function() {
    var values,
        fun = function(a, b) {
            if (typeof values == 'undefined') {
                values = [a, b];
            }
        };
    this.a.reduceRight(fun, 0);
    ok( this.equals(values, [0, 4]), "reduceRight function called initially with arguments 0 and 4" );
});

test("passes the result of each function application as the first argument to the next function invocation", 2,
   function() {
    function fun(a, b) {
        if (b == 2) {
            ok( a == 7, "second invocation of reduceRight function called with 7 and 2" );
        } else if (b == 1) {
            ok( a == 9, "second invocation of reduceRight function called with 9 and 1" );
        }
        return a + b;
    }
    this.a.reduceRight(fun, 0);
});

test("passes every array element to the given function", 1, function() {
    var values = [],
        reverse = [4, 3, 2, 1],
        fun = function(a, b) { values.push(b); };
    this.a.reduceRight(fun, 0);
    ok( this.equals(values, reverse), "every value in the array was passed to the reduceRight function" );
});

test("returns the result of the function invocation on the last array element", 1, function() {
    function fun(a, b) { return a + b; }
    ok( this.a.reduceRight(fun, 0) == 10, "the sum of the elements in the array is 10" );
});

test("passes array element indexes as the third argument to the given function", 1, function() {
    var values = [],
        fun = function(a, b, c) {
            values.push(c);
        };
    this.a.reduceRight(fun, 0);
    ok( this.equals(values, [3, 2, 1, 0]), "the reduceRight function was passed indexes for each element" );
});

test("passes the original array as the fourth argument to the given function", 1, function() {
    var values = [],
        fun = function(a, b, c, d) {
            values.push(d);
        },
        that = this;
    this.a.reduceRight(fun, 0);
    ok( values.every(function(e) { return that.equals(e, that.a); }),
        "the original array is passed to the reduceRight function on every invocation" );
});

test("uses the last array element as an initial value if none is given", 2, function() {
    var values,
        fun = function(a, b) {
            if (typeof values == 'undefined') {
                values = [a, b];
            }
            return a + b;
        };
    this.a.reduceRight(fun);
    ok( this.equals(values, [4, 3]), "the first invocation of the reduceRight function was given 1 and 2 as arguments" );
    ok( this.a.reduceRight(fun) == 10, "the sum of every element in the array is 10" );
});

test("throws a `TypeError` if no function is given", 1, function() {
    try {
        this.a.reduceRight('foo');
    } catch(e) {
        ok( e instanceof TypeError, "a TypeError was thrown" );
    }
});

test("returns the initial value if the receiver is empty", 1, function() {
    ok( [].reduceRight(function() {}, 3) == 3, "reduceRight() returned the given initial value" );
});

test("throws a `TypeError` if the receiver is empty and no initial value is given", 1, function() {
    try {
        [].reduceRight(function() {});
    } catch(e) {
        ok( e instanceof TypeError, "a TypeError was thrown" );
    }
});

module("Array#filter()", {
    setup: function() {
        this.a = [1, 2, 3, 4];

        // Helper function for comparing arrays.
        this.equals = function(a, b) {
            if (a.length === b.length) {
                for (var i = 0; i < a.length; i += 1) {
                    if (a[i] !== b[i]) { return false; }
                }
                return true;
            } else {
                return false;
            }
        };
    }
});

test("returns an array of values that match a given predicate", 1, function() {
    var r = this.a.filter(function(e) {
        return e % 2 === 0;
    });
    ok( this.equals(r, [2, 4]), "resulting array contains only even numbers" );
});

test("passes the index of each element to the callback", 4, function() {
    var idx = -1;
    this.a.filter(function(e, i) {
        idx += 1
        ok( i === idx, "callback called with index "+ idx );
    });
});

test("invokes callback in the context of the given object", 4, function() {
    var obj = {};
    this.a.filter(function() {
        ok( this === obj, "callback called with context of obj" );
    }, obj);
});

test("throws a type error if no callback is given", 1, function() {
    try {
        this.a.filter();
    } catch(e) {
        ok( e instanceof TypeError, "a type error was thrown" );
    }
});

module("Array#every()", {
    setup: function() {
        this.a = [1, 2, 3, 4];

        // Helper function for comparing arrays.
        this.equals = function(a, b) {
            if (a.length === b.length) {
                for (var i = 0; i < a.length; i += 1) {
                    if (a[i] !== b[i]) { return false; }
                }
                return true;
            } else {
                return false;
            }
        };
    }
});

test("returns true if every element in the array matches a given predicate", 1, function() {
    var r = this.a.every(function(e) {
        return e < 5;
    });
    ok( r, "every element in the array is less than 5" );
});

test("returns false if some element in the array does not match a given predicate", 1, function() {
    var r = this.a.every(function(e) {
        return e % 2 === 0;
    });
    ok( !r, "not all elements in the array are even" );
});

test("passes the index of each element to the callback", 4, function() {
    var idx = -1;
    this.a.every(function(e, i) {
        idx += 1
        ok( i === idx, "callback called with index "+ idx );
        return true;
    });
});

test("passes the original array to the callback on each iteration", 4, function() {
    var that = this;
    this.a.every(function(e, i, orig) {
        ok( that.equals(orig, that.a), "original array was given as the third argument" );
        return true;
    });
});

test("invokes callback in the context of the given object", 4, function() {
    var obj = {};
    this.a.every(function() {
        ok( this === obj, "callback called with context of obj" );
        return true;
    }, obj);
});

test("throws a type error if no callback is given", 1, function() {
    try {
        this.a.every();
    } catch(e) {
        ok( e instanceof TypeError, "a type error was thrown" );
    }
});

module("Array#some()", {
    setup: function() {
        this.a = [1, 2, 3, 4];

        // Helper function for comparing arrays.
        this.equals = function(a, b) {
            if (a.length === b.length) {
                for (var i = 0; i < a.length; i += 1) {
                    if (a[i] !== b[i]) { return false; }
                }
                return true;
            } else {
                return false;
            }
        };
    }
});

test("returns true if some element in the array matches a given predicate", 1, function() {
    var r = this.a.some(function(e) {
        return e % 2 === 0;
    });
    ok( r, "some element in the array is even" );
});

test("returns false if no element in the array matches a given predicate", 1, function() {
    var r = this.a.some(function(e) {
        return e > 5;
    });
    ok( !r, "no element in the array is greater than 5" );
});

test("passes the index of each element to the callback", 4, function() {
    var idx = -1;
    this.a.some(function(e, i) {
        idx += 1
        ok( i === idx, "callback called with index "+ idx );
    });
});

test("passes the original array to the callback on each iteration", 4, function() {
    var that = this;
    this.a.some(function(e, i, orig) {
        ok( that.equals(orig, that.a), "original array was given as the third argument" );
    });
});

test("invokes callback in the context of the given object", 4, function() {
    var obj = {};
    this.a.some(function() {
        ok( this === obj, "callback called with context of obj" );
    }, obj);
});

test("throws a type error if no callback is given", 1, function() {
    try {
        this.a.some();
    } catch(e) {
        ok( e instanceof TypeError, "a type error was thrown" );
    }
});

module("Array#indexOf()", {
    setup: function() {
        this.a = [1, 3, 3, 4];

        // Helper function for comparing arrays.
        this.equals = function(a, b) {
            if (a.length === b.length) {
                for (var i = 0; i < a.length; i += 1) {
                    if (a[i] !== b[i]) { return false; }
                }
                return true;
            } else {
                return false;
            }
        };
    }
});

test("returns the index of a matching element", 1, function() {
    ok( this.a.indexOf(4) == 3, "the index of the value 4 is 3" );
});

test("returns the lowest index if multiple elements match", 1, function() {
    ok( this.a.indexOf(3) == 1, "the first index of the value 3 is 1" );
});

test("returns -1 if no element in the array matches", 1, function() {
    ok( this.a.indexOf(5) == -1, "array does not contain the value 5" );
});

test("returns the index of a matching element starting from a given index", 1, function() {
    ok( this.a.indexOf(3, 2) == 2, "the first index of the value 3 starting from index 2 is 2" );
});

test("returns the index of a matching element starting from a given index measured from the end of the array", 1,
    function() {
    ok( this.a.indexOf(3, -2) == 2, "the first index of the value 3 starting from index 2 is 2" );
});

module("Array#lastIndexOf()", {
    setup: function() {
        this.a = [1, 3, 3, 4];

        // Helper function for comparing arrays.
        this.equals = function(a, b) {
            if (a.length === b.length) {
                for (var i = 0; i < a.length; i += 1) {
                    if (a[i] !== b[i]) { return false; }
                }
                return true;
            } else {
                return false;
            }
        };
    }
});

test("returns the index of a matching element", 1, function() {
    ok( this.a.lastIndexOf(4) == 3, "the index of the value 4 is 3" );
});

test("returns the highest index if multiple elements match", 1, function() {
    ok( this.a.lastIndexOf(3) == 2, "the last index of the value 3 is 2" );
});

test("returns -1 if no element in the array matches", 1, function() {
    ok( this.a.lastIndexOf(5) == -1, "array does not contain the value 5" );
});

test("returns the index of a matching element starting from a given index", 1, function() {
    ok( this.a.lastIndexOf(3, 2) == 2, "the first index of the value 3 starting from index 2 is 2" );
});

test("returns the index of a matching element starting from a given index measured from the end of the array", 1,
    function() {
    ok( this.a.lastIndexOf(3, -2) == 2, "the first index of the value 3 starting from index 2 is 2" );
});
