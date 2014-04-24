define(function (require, exports, module) {
	'use strict';

	exports.freeze = function freeze() {

		var model = this.model;

		// [1] store min and max
		this._before_freeze_minmax_ = {
			minWidth: model.get('minWidth'),
			maxWidth: model.get('maxWidth')
		};

		// [2] set the min and max widthes to the current width
		model.set({
			minWidth: model.get('width'),
			maxWidth: model.get('width')
		});

		// [3] disable handles
		this.disableResizable();

		return this;
	};

	exports.unfreeze = function unfreeze() {

		// [1] reset real min and max
		this.model.set(this._before_freeze_minmax_);

		// [2] delete
		delete this._before_freeze_minmax_;

		// [3] enable resizable
		this.enableResizable();

		return this;
	};
});
