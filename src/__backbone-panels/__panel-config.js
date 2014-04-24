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
	 * Set the place for the panel.
	 *
	 * @method postitionPanel
	 * @param panel {Backbone Model}
	 */
	exports.postitionPanel = function postitionPanel(panel) {
		var index = this.panelIndex(panel),
			left = this.sumBefore('width', index);

		panel.model.set({
			left: left,
			top: 0
		});
	};


	exports.panelMinRight = function panelMaxRight(panel) {
		var index = this.panelIndex(panel),
			totalWidth = this.sumAfter('width', -1);

		var maxWidthAfter = this.reduceAfter(index, function (res, panel) {
			return panel.panelEnabled() ? res + panel.model.get('maxWidth') : res + panel.model.get('width');
		}, 0);

		panel.model.set('minRight', totalWidth - maxWidthAfter);
	};


	exports.panelMaxRight = function panelMinRight(panel) {
		var index = this.panelIndex(panel),
			totalWidth = this.sumAfter('width', -1);

		var minWidthAfter = this.reduceAfter(index, function (res, panel) {
			return panel.panelEnabled() ? res + panel.model.get('minWidth') : res + panel.model.get('width');
		}, 0);

		panel.model.set('maxRight', totalWidth - minWidthAfter);
	};




	exports.panelMinLeft = function panelsMinLeft(panel) {

		var index = this.panelIndex(panel);

		var minLeft = this.reduceBefore(index, function (res, panel) {

			var model = panel.model;


			// sum the widths of panels
			return panel.panelEnabled() ? res + model.get('minWidth') : res + model.get('width');

		}, 0);

		panel.model.set('minLeft', minLeft);
	};

	exports.panelMaxLeft = function panelMaxLeft(panel) {
		var index = this.panelIndex(panel);

		var maxLeft = this.reduceAfter(index, function (res, panel) {
			var model = panel.model;

			return panel.panelEnabled() ? res + model.get('maxWidth') : res + model.get('width');
		}, 0);

		panel.model.set('maxLeft', maxLeft);
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

			this.panelMinRight(panel);
			this.panelMaxRight(panel);

			this.panelMinLeft(panel);
			this.panelMaxLeft(panel);

		}, this);
	};
});
