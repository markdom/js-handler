/**
 *
 * Markdom Common Class v1.0.0
 *
 * Includes
 * - js.class.min 2.2.1 (C) 2011 by lunereaper <![[dawid.kraczkowski[at]gmail[dot]com]]>
 * - BindedJsClass by Markenwerk GmbH
 * - Common Stack Util by Markenwerk GmbH
 *
 * Copyright (c) 2017 Martin Brecht-Precht, Markenwerk GmbH
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 **/

var JS = {
	VERSION: '2.2.1'
};

JS.Class = function (classDefinition) {
	/**
	 * Creates base constructor for JS.Class
	 */
	function getClassBase() {
		return function () {
			//console.log(preventJSClassConstructorCall);
			//apply constructor pattern
			if (typeof this['construct'] === 'function' && preventJSClassConstructorCall === false) {
				this.construct.apply(this, arguments);
			}
		};
	}

	/**
	 * Extends class definition
	 */
	function createClassDefinition(classDefinition) {
		//rewrite properties
		for (prop in classDefinition) {
			if (prop === 'statics') {
				for (sprop in classDefinition.statics) {
					this.constructor[sprop] = classDefinition.statics[sprop];
				}
			} else {
				//provide parent calls if method is overrwritten
				if (typeof this.constructor.prototype[prop] == 'function') {
					var parentMethod = this.constructor.prototype[prop];
					var scope = this;
					delete this.constructor.prototype[prop];
					(this.constructor.prototype['parent'] = this.constructor.prototype['parent'] || {})[prop] = parentMethod;
					this.constructor.prototype[prop] = classDefinition[prop];
				} else {
					this.constructor.prototype[prop] = classDefinition[prop];
				}
			}
		}
	}

	var preventJSClassConstructorCall = true;
	//create class constructor & class definition
	this.constructor = getClassBase();
	preventJSClassConstructorCall = false;
	createClassDefinition.call(this, classDefinition);

	/**
	 * provide extend option in JS.Class
	 */
	this.constructor.extend = function (classDefinition) {
		preventJSClassConstructorCall = true;
		//create class constructor & extend class by parent
		this.constructor = getClassBase();
		this.constructor.prototype = new new this().constructor;
		preventJSClassConstructorCall = false;
		//create class definition
		createClassDefinition.call(this, classDefinition);
		//provide infinity extend scope
		this.constructor.extend = function (classDefinition) {
			//option for preventing calling parent constructor
			var parentConstructor;
			//create infinity extend scope
			var infinityExtendScope = this;
			preventJSClassConstructorCall = true;
			//create class constructor & extend it
			this.constructor = getClassBase();
			this.constructor.prototype = new this();
			if (parentConstructor !== undefined) {
				this.constructor.prototype['construct'] = parentConstructor;
			}
			preventJSClassConstructorCall = false;
			//add class body
			createClassDefinition.call(this, classDefinition);
			//infinity extend!
			this.constructor.extend = function (classDefinition) {
				return infinityExtendScope.extend.apply(this, [classDefinition]);
			};
			return this.constructor;
		};
		return this.constructor;
	};
	return this.constructor;
};

var BindedJsClass = JS.Class({
	bind: function (fnmethod) {
		var that = this;
		return ( function () {
			return fnmethod.apply(that, arguments);
		});
	}
});

var Stack = BindedJsClass.extend({
	_items: [],
	size: function () {
		return this._items.length;
	},
	get: function (index) {
		if (!index) {
			index = this.size() - 1;
		}
		return this._items[index];
	},
	set: function (value, index) {
		if (!index) {
			// Find last item
			index = this.size() - 1;
		}
		if (index > this.size()) {
			// Index too large; append item
			this._items.push(value);
		} else {
			this._items[index] = value;
		}
		return this;
	},
	push: function (item) {
		this._items.push(item);
		return this;
	},
	pop: function () {
		return this._items.pop();
	}
});

var StringBuilder = BindedJsClass.extend({
	_string: '',
	append: function (string) {
		this._string += string.toString();
		return this;
	},
	size: function () {
		return this._string.length;
	},
	build: function () {
		return this._string;
	}
});
