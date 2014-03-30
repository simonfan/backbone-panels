//     backbone-panels
//     (c) simonfan
//     backbone-panels is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module backbone-panels
 */

define(function (require, exports, module) {
	'use strict';

	/**
	 * Retrieve all models before the given one.
	 *
	 * @method before
	 * @param index {Backbone Model|Number}
	 */
	exports.before = function before(index) {
		return this.first(index);
	};

	/**
	 * Retrieve all models after the given one.
	 *
	 * @method after
	 * @param index {Backbone Model|Number}
	 */
	exports.after = function after(index) {
		return this.rest(index + 1);
	};

	/**
	 *
	 * @method reduceBefore
	 * @param index {Backbone Model|Number}
	 * @param iter {Function}
	 * @param memo {*}
	 * @param [context] {Object}
	 */
	exports.reduceBefore = function reduceBefore(index, iter, memo, context) {
		var before = this.before(index);
		return _.reduce(before, iter, memo, context);
	};

	/**
	 *
	 * @method reduceAfter
	 * @param index {Backbone Model|Number}
	 * @param iter {Function}
	 * @param memo {*}
	 * @param [context] {Object}
	 */
	exports.reduceAfter = function reduceAfter(index, iter, memo, context) {
		var after = this.after(index);
		return _.reduce(after, iter, memo, context);
	};

	/**
	 * Returns the left position at which a given
	 * panel should be placed.
	 *
	 * @method calculateLeftPos
	 * @param panel {Bakcbone Model}
	 */
	exports.calculateLeftPos = function calculateLeftPos(panel) {

		var index = this.collection.indexOf(panel.model);

		return this.reduceBefore(index, function(distance, panel) {
			return distance + panel.model.get('width');
		}, 0);
	};

	/**
	 * Set the place for the panel.
	 *
	 * @method postitionPanel
	 * @param panel {Backbone Model}
	 */
	exports.postitionPanel = function postitionPanel(panel) {
		var left = this.calculateLeftPos(panel);

		panel.model.set({
			left: left,
			top: 0
		});
	};

	/**
	 * Puts all panels in their places
	 * by calculating left positions on them all.
	 *
	 * @method arrange
	 */
	exports.arrange = function arrange() {
		this.each(this.postitionPanel, this);
	};
});
