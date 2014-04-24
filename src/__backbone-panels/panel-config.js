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
			return panel.panelEnabled() ? value + panel.get(attr) : value + panel.get('width');
		}, 0);
	};

	exports.sumAfter = function sumAfter(attr, index) {
		return this.reduceAfter(index, function (value, panel) {
			return panel.panelEnabled() ? value + panel.get(attr) : value + panel.get('width');
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
		return this.sumBefore('width', index);
	};

	/**
	 * Set the place for the panel.
	 *
	 * @method postitionPanel
	 * @param panel {Backbone Model}
	 */
	exports.postitionPanel = function postitionPanel(panel) {
		var index = this.panelIndex(panel),
			left = this.calculateLeftPos(index);

		panel.model.set({
			left: left,
			top: 0
		});
	};


	exports.setPanelRightBoundaries = function setPanelRightBoundaries(panel) {
		var index = this.panelIndex(panel),
			minWidthAfter = this.sumAfter('minWidth', index),
			maxWidthAfter = this.sumAfter('maxWidth', index);

		var totalWidth = this.sumAfter('width', -1);

		panel.model.set('maxRight', totalWidth - minWidthAfter);

		panel.model.set('minRight', totalWidth - maxWidthAfter);
	};

	exports.setPanelLeftBoundaries = function setPanelLeftBoundaries(panel) {
		var index = this.panelIndex(panel),
			maxWidthBefore = this.sumBefore('maxWidth', index),
			minWidthBefore = this.sumBefore('minWidth', index);

		panel.model.set('maxLeft', maxWidthBefore);

		panel.model.set('minLeft', minWidthBefore);
	};


	/**
	 * Puts all panels in their places
	 * by calculating left positions on them all.
	 *
	 * @method arrange
	 */
	exports.arrange = function arrange() {

		this.each(function (panel, index) {

			// disable limit handles
			if (index === 0) {
				panel.disableHandle('w');
			} else if (index === this.panels.length - 1) {
				panel.disableHandle('e');
			}


			this.postitionPanel(panel);

			this.setPanelRightBoundaries(panel);

			this.setPanelLeftBoundaries(panel);

		}, this);
	};
});
