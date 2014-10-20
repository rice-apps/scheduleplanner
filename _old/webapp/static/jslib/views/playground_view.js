/**
 * @author mschurr@rice.edu (Matthew Schurr)
 */

jslib.provides('org.riceapps.scheduleplanner.views.PlaygroundView');

jslib.scope(function(){

/**
 * @constructor
 * @extends {org.riceapps.scheduleplanner.views.DroppableView}
 */
org.riceapps.scheduleplanner.views.PlaygroundView = function() {
	this.superConstructor();
	return this;
};
jslib.inherits(org.riceapps.scheduleplanner.views.PlaygroundView,
	           org.riceapps.scheduleplanner.views.DroppableView);
var PlaygroundView = org.riceapps.scheduleplanner.views.PlaygroundView;

/**
 * @override
 */
PlaygroundView.prototype.renderIn = function(target) {
	this.super('renderIn', target);

	var e = $('<div />', {
		'class' : 'handles'
	});

	$(this.dom_).addClass("playground");
	$(this.dom_).append(e);
};

/**
 * @override
 */
PlaygroundView.prototype.addChild = function(view) {
	this.super('addChild', view);
	view.renderIn($(this.dom_).find('.handles'));
}

});