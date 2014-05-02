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
			return panel.bbpPanelEnabled() ? value + panel.modeld.get(attr) : value + panel.modeld.get('width');
		}, 0);
	}




	function setPanelLeftBoundaries(panel, index) {
		var maxWidthBefore = sumBefore.call(this, 'maxWidth', index),
			minWidthBefore = sumBefore.call(this, 'minWidth', index);

		panel.modeld.set('maxLeft', maxWidthBefore);

		panel.modeld.set('minLeft', minWidthBefore);
	}

	// after
	function sumAfter(attr, index) {
		return this.reduceAfter(index, function (value, panel) {
			return panel.bbpPanelEnabled() ? value + panel.modeld.get(attr) : value + panel.modeld.get('width');
		}, 0);
	}

	function setPanelRightBoundaries(panel, index) {

		var minWidthAfter = sumAfter.call(this, 'minWidth', index),
			maxWidthAfter = sumAfter.call(this, 'maxWidth', index);

		var totalWidth = sumAfter.call(this, 'width', -1);

		panel.modeld.set('maxRight', totalWidth - minWidthAfter);

		panel.modeld.set('minRight', totalWidth - maxWidthAfter);
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
