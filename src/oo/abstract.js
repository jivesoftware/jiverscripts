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

this.jive = this.jive || {};
jive.oo = jive.oo || {};

/**
 * Singleton representing an abstract member.  You can set the value of a field
 * or method of a class implemented with jive.oo.Class to jive.oo._abstract to
 * make that class abstract.  An abstract class or a subclass of an abstract
 * class cannot be instantiated unless any abstract members are overridden with
 * concrete definitions.
 *
 * @field
 * @requires jive.oo.Class
 */
jive.oo['abstract'] = function() {};
jive.oo._abstract = jive.oo['abstract'];  // Alias to non-reserved word.
