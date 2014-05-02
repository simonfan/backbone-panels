define(function (require, exports, module) {
	'use strict';

	exports._initializePanelEnableDisable = function _initializePanelEnableDisable() {

		this.listenTo(this.modeld, 'change:panelStatus', function (model) {

			if (this.bbpPanelEnabled()) {
				// enabled
				this.enableResizable();

				// [3] set classes
				this.$el
					.addClass(this.panelClass + '-enabled')
					.removeClass(this.panelClass + '-disabled');

			} else {
				// disabled
				this.disableResizable();


				// [4] set classes
				this.$el
					.addClass(this.panelClass + '-disabled')
					.removeClass(this.panelClass + '-enabled');
			}

			this.panels
				.arrangeBoundaries()
				.arrangeHandles();

		});

	};

	exports.bbpPanelEnabled = function bbpPanelEnabled() {
		return this.modeld.get('panelStatus') === 'enabled';
	};

	exports.bbpEnablePanel = function bbpEnablePanel() {
		this.modeld.set('panelStatus', 'enabled');
		return this;
	};

	exports.bbpDisablePanel = function bbpDisablePanel() {
		this.modeld.set('panelStatus', 'disabled');
		return this;
	};

});
