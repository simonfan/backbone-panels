/**
 * Logic for positioning the panels at the right starting place.
 *
 * @module backbone-panels
 * @submodule positioners
 */
define(function (require, exports, module) {
	'use strict';

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
