/**
 * - js.class.min 2.2.1 (C) 2011 by lunereaper <![[dawid.kraczkowski[at]gmail[dot]com]]>
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
