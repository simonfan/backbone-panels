/**
 * Logic for positioning the panels at the right starting place.
 *
 * @module backbone-panels
 * @submodule positioners
 */
define(function (require, exports, module) {
	'use strict';


	// private
	function sumBefore(attr, index) {
		return this.reduceBefore(index, function (value, panel) {
			return panel.bbpPanelEnabled() ? value + panel.model.get(attr) : value + panel.model.get('width');
		}, 0);
	}




	function setPanelLeftBoundaries(panel, index) {
		var maxWidthBefore = sumBefore.call(this, 'maxWidth', index),
			minWidthBefore = sumBefore.call(this, 'minWidth', index);

		panel.model.set('maxLeft', maxWidthBefore);

		panel.model.set('minLeft', minWidthBefore);
	}

	// after
	function sumAfter(attr, index) {
		return this.reduceAfter(index, function (value, panel) {
			return panel.bbpPanelEnabled() ? value + panel.model.get(attr) : value + panel.model.get('width');
		}, 0);
	}

	function setPanelRightBoundaries(panel, index) {

		var minWidthAfter = sumAfter.call(this, 'minWidth', index),
			maxWidthAfter = sumAfter.call(this, 'maxWidth', index);

		var totalWidth = sumAfter.call(this, 'width', -1);

		panel.model.set('maxRight', totalWidth - minWidthAfter);

		panel.model.set('minRight', totalWidth - maxWidthAfter);
	}








	module.exports = function arrangeBoundaries() {

	//	console.log('arrange boundaries');

		this.each(function (panel, index) {

			setPanelLeftBoundaries.call(this, panel, index);

			setPanelRightBoundaries.call(this, panel, index);

		}, this);

		return this;
	};
});
