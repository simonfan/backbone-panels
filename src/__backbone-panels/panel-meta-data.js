/**

 */
define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');



	/**
	 * Retrieve the index of a given panel object.
	 *
	 *
	 * @method panelIndex
	 * @param panel {Object}
	 */
	exports.panelIndex = function panelIndex(panel) {
		return this.findIndex(function (p) {
			return p.cid === panel.cid;
		});
	};



	/**
	 * Returns the type of the panel.
	 * Either 'head', 'middle', 'tail'
	 *
	 * @method panelType
	 * @param panel {Panel object}
	 */
	exports.panelType = function panelType(panel) {
		var enabledPanels = this.enabledPanels();

		if (enabledPanels.length === 1) {
			return 'only';
		} else {

			if (panel.id === enabledPanels[0].id) {
				return 'head';
			} else if (panel.id === _.last(enabledPanels).id) {
				return 'tail';
			} else {
				return 'middle';
			}
		}
	};
});
