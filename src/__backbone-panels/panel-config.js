/**
 * Logic for positioning the panels at the right starting place.
 *
 * @module backbone-panels
 * @submodule positioners
 */
define(function (require, exports, module) {
	'use strict';



	exports.sumBefore = function sumBefore(attr, index) {
		return this.reduceBefore(index, function (value, panel) {
			return value + panel.get(attr);
		}, 0);
	};

	exports.sumAfter = function sumAfter(attr, index) {
		return this.reduceAfter(index, function (value, panel) {
			return value + panel.get(attr);
		}, 0);
	};


	/**
	 * Returns the left position at which a given
	 * panel should be placed.
	 *
	 * @method calculateLeftPos
	 * @param panel {Bakcbone Model}
	 */
	exports.calculateLeftPos = function calculateLeftPos(index) {
		return this.sumBefore('width', index)
	};

	/**
	 * Set the place for the panel.
	 *
	 * @method postitionPanel
	 * @param panel {Backbone Model}
	 */
	exports.postitionPanel = function postitionPanel(panel) {
		var index = panel.index,
			left = this.calculateLeftPos(index);

		panel.model.set({
			left: left,
			top: 0
		});
	};


	exports.setPanelMaxRight = function setPanelMaxRight(panel) {
		var index = panel.index,
			minWidthAfter = this.sumAfter('minWidth', index);

		var totalWidth = this.sumAfter('width', -1);

		panel.model.set('maxRight', totalWidth - minWidthAfter);
	}

	exports.setPanelMaxLeft = function setPanelMaxLeft(panel) {
		var index = panel.index,
			maxWidthBefore = this.sumBefore('maxWidth', index);

		panel.model.set('maxLeft', maxWidthBefore);
	};

	/**
	 * Puts all panels in their places
	 * by calculating left positions on them all.
	 *
	 * @method arrange
	 */
	exports.arrange = function arrange() {
		this.each(function (panel) {
			this.postitionPanel(panel);

			this.setPanelMaxRight(panel);

			this.setPanelMaxLeft(panel);
		}, this);
	};
});
