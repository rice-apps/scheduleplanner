/**
 * JSLib: Simplified JavaScript Dependency Management
 * @author mschurr@rice.edu (Matthew Schurr)
 */

/**
 * The main namespace exported by the library.
 * @exports
 * @public
 */
jslib = {};

/**
 * The dependency graph.
 * @public
 */
jslib.sources = {
	'org.riceapps.scheduleplanner.JSObject' : {
		src: 'jsobject.js',
		deps : []
	},
	'org.riceapps.scheduleplanner.Promise' : {
		src : 'promise.js',
		deps : [
			'org.riceapps.scheduleplanner.JSObject'
		]
	},
	'org.riceapps.scheduleplanner.views.View' : {
		src : 'views/view.js',
		deps : [
			'org.riceapps.scheduleplanner.JSObject'
		]
	},
	'org.riceapps.scheduleplanner.views.ModalView' : {
		src : 'views/modal_view.js',
		deps : [
			'org.riceapps.scheduleplanner.views.View'
		]
	},
	'org.riceapps.scheduleplanner.controllers.Controller' : {
		src : 'controllers/controller.js',
		deps : [
			'org.riceapps.scheduleplanner.JSObject'
		]
	},
	'org.riceapps.scheduleplanner.models.Model' : {
		src : 'models/model.js',
		deps : [
			'org.riceapps.scheduleplanner.JSObject'
		]
	},
	'org.riceapps.scheduleplanner.models.CourseModel' : {
		src : 'models/course_model.js',
		deps : [
			'org.riceapps.scheduleplanner.models.Model'
		]
	},
	'org.riceapps.scheduleplanner.models.UserModel' : {
		src : 'models/user_model.js',
		deps : [
			'org.riceapps.scheduleplanner.models.Model'
		]
	},



	'org.riceapps.scheduleplanner.controllers.MainController' : {
		src : 'controllers/main_controller.js',
		deps : [
			'org.riceapps.scheduleplanner.models.UserModel',
			'org.riceapps.scheduleplanner.controllers.Controller',
			'org.riceapps.scheduleplanner.views.CalendarView',
			'org.riceapps.scheduleplanner.views.PlaygroundView',
			'org.riceapps.scheduleplanner.views.DraggableView',
			'org.riceapps.scheduleplanner.views.DroppableView',
			'org.riceapps.scheduleplanner.views.DraggableCourseView',
			'org.riceapps.scheduleplanner.views.DraggableCalendarItemView',
			'org.riceapps.scheduleplanner.views.ModalView',
			'org.riceapps.scheduleplanner.views.DroppableCalendarItemView',
			'org.riceapps.scheduleplanner.views.TrashView',
		]
	},
	'org.riceapps.scheduleplanner.views.CalendarView' : {
		src: 'views/calendar_view.js',
		deps : [
			'org.riceapps.scheduleplanner.views.View',
			'org.riceapps.scheduleplanner.views.DraggableView',
			'org.riceapps.scheduleplanner.views.DroppableCalendarItemView',
			'org.riceapps.scheduleplanner.views.DraggableCalendarItemView',
		]
	},
	'org.riceapps.scheduleplanner.views.DraggableView' : {
		src : 'views/draggable_view.js',
		deps : [
			'org.riceapps.scheduleplanner.views.View',
		]
	},
	'org.riceapps.scheduleplanner.views.DroppableView' : {
		src : 'views/droppable_view.js',
		deps : [
			'org.riceapps.scheduleplanner.views.View',
			'org.riceapps.scheduleplanner.views.DraggableView'
		]
	},

	'org.riceapps.scheduleplanner.views.DroppableCalendarItemView' : {
		src : 'views/droppable_calendar_item_view.js',
		deps : [
			'org.riceapps.scheduleplanner.views.DroppableView'
		]
	},
	'org.riceapps.scheduleplanner.views.DraggableCalendarItemView' : {
		src : 'views/draggable_calendar_item_view.js',
		deps : [
			'org.riceapps.scheduleplanner.views.DraggableView'
		]
	},
	'org.riceapps.scheduleplanner.views.PlaygroundView' : {
		'src' : 'views/playground_view.js',
		deps : [
			'org.riceapps.scheduleplanner.views.DroppableView'
		]
	},
	'org.riceapps.scheduleplanner.views.TrashView' : {
		'src' : 'views/trash_view.js',
		deps : [
			'org.riceapps.scheduleplanner.views.DroppableView'
		]
	},
	'org.riceapps.scheduleplanner.views.DraggableCourseView' : {
		'src' : 'views/draggable_course_view.js',
		'deps' : [
			'org.riceapps.scheduleplanner.views.DraggableView'
		]
	}
};

/**
 * Indicates that a class inherits from another class.
 * @param {Function} childCtor
 * @param {Function} parentCtor
 */
jslib.inherits = function(childCtor, parentCtor) {
  function tempCtor() {};
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.superConstructor_ = parentCtor;
  childCtor.prototype = new tempCtor();
  childCtor.prototype.constructor = childCtor;
  childCtor.prototype.superConstructor = function(var_args) {
  	var ctr = childCtor.prototype.superConstructor;
  	delete childCtor.prototype.superConstructor;
  	parentCtor.apply(this);
  	childCtor.prototype.superConstructor = ctr;
  };
  childCtor.prototype.super = function(methodName, var_args) {
  	var method = childCtor.prototype.super;
  	delete childCtor.prototype.super;
  	var args = Array.prototype.slice.call(arguments, 1);
  	var ret = parentCtor.prototype[methodName].apply(this, args);
  	childCtor.prototype.super = method;
  	return ret;
  };
};


/**
 * Returns whether or not an object is an instance of a class.
 * @param {Object} object
 * @param {Function} constructor
 */
jslib.is = function(object, constructor) {
	return object instanceof constructor;
}

/**
 * Holds namespaces that have been loaded.
 * @private {Object.<string, boolean>}
 */
jslib.provided = {};

/**
 * Holds the web-accessible path to this file.
 * @private {?string}
 */
jslib.path = null;

/**
 * Holds namespaces that are waiting to be written to the document.
 * @private {Array.<string>}
 */
jslib.pending = [];

/**
 * Logs a string to the console.
 * @param {string} text
 */
jslib.log = function(text) {
	window.console.log(text);
};

/**
 * Logs an error to the console.
 * @param {string} text
 */
jslib.error = function(text) {
	window.console.log(text);
};

/**
 * Provides an anonymous scope by executing the provided closure.
 * @param {function(): void} closure
 */
jslib.scope = function(closure) {
	closure();
};

/**
 * Indicates that the containing file provide a namespace.
 * @param {string} namespace
 */
jslib.provides = function(namespace) {
	jslib.provided[namespace] = true;

	// Ensure that the name space exists.
	var parts = namespace.split('.');
	var cur = window;

	if (!(parts[0] in cur) && cur.execScript) {
		cur.execScript('var ' + parts[0]);
	}

	for (var part; parts.length && (part = parts.shift());) {
		if (cur[part]) {
			cur = cur[part];
		} else {
			cur = cur[part] = {};
		}
	}
};

/**
 * Returns the  web-accessible path to this file.
 * @return {string}
 */
jslib.getBasePath = function() {
	if(jslib.path) {
		return jslib.path;
	}

	var scripts = document.getElementsByTagName('script');

	for (var i = scripts.length - 1; i >= 0; --i) {
		var src = scripts[i].src;
		var qmark = src.lastIndexOf('?');
		var l = qmark == -1 ? src.length : qmark;
		if (src.substr(l - 9, 9) == 'master.js') {
			jslib.path = src.substr(0, l - 9);
			return jslib.path;
		}
	}
};

/**
 * Loads the methods and classes from a namespace.
 * @param {string} namespace
 */
jslib.require = function(namespace) {
	if (jslib.provided[namespace]) {
		return;
	}

	if (!jslib.sources[namespace]) {
		jslib.error("Unable to load namespace " + namespace);
		return;
	}

	var inDocument = typeof window.document != 'undefined' &&
                     'write' in  window.document;

    jslib.pushDeps_(namespace);

    if (inDocument) {
    	if(document.readyState == 'complete') {
    		jslib.error("Attempted to load dependency after ready");
    		return;
    	}

    	for (var i = 0; i < jslib.pending.length; i++)
    	{
    		var src = jslib.getBasePath() + jslib.sources[jslib.pending[i]].src;
    		document.write('<script type="text/javascript" src="' + src + '"></' + 'script>');
    	}

    	jslib.pending = [];
    }
};

/**
 * Pushes dependencies from the dependency graph.
 * @param {string} namespace
 * @private
 */
jslib.pushDeps_ = function(namespace) {
	if(!jslib.sources[namespace]) {
		return;
	}
	var deps = jslib.sources[namespace].deps;
	for (var i = 0; i < deps.length; i++) {
		if(!jslib.provided[deps[i]]) {
			jslib.pushDeps_(deps[i]);
		}
	}
	jslib.pending.push(namespace);
	jslib.provided[namespace] = true;
};
