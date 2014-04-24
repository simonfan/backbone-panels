define(function (require, exports, module) {
	'use strict';

	exports._initializePanelEnableDisable = function _initializePanelEnableDisable() {

		this.listenTo(this.model, 'change:panelStatus', function (model) {

			if (this.panelEnabled()) {
				// enabled
			//	this.unfreeze();
				this.enableResizable();

				// [3] set classes
				this.$el
					.addClass(this.panelClass + '-enabled')
					.removeClass(this.panelClass + '-disabled');

			} else {
				// disabled

			//	this.freeze();
				this.disableResizable();


				// [4] set classes
				this.$el
					.addClass(this.panelClass + '-disabled')
					.removeClass(this.panelClass + '-enabled');
			}

			this.panels.arrange();

		});

	};

	exports.panelEnabled = function panelEnabled() {
		return this.model.get('panelStatus') === 'enabled';
	};

	exports.enablePanel = function enablePanel() {
		this.model.set('panelStatus', 'enabled');
		return this;
	};

	exports.disablePanel = function disablePanel() {
		this.model.set('panelStatus', 'disabled');
		return this;
	};

});
