/**
 * Logic for enabling and disabling panels
 *
 * @module backbone-panels
 * @submodule enable-disable
 */
define(function (require, exports, module) {
	'use strict';

	exports.enablePanel = function enablePanel(id) {

		this.getPanelById(id).enablePanel();

		return this;
	};

	exports.disablePanel = function disablePanel(id) {

		this.getPanelById(id).disablePanel();

		return this;
	};

	exports.enablePanelAt = function enablePanelAt(index) {

		this.getPanelAt(index).enablePanel();

		return this;

	};

	exports.disablePanelAt = function disablePanelAt(index) {

		this.getPanelAt(index).disablePanel();

		return this;
	};
});
