define(['backbone-panels'], function (bbPanels) {

	var bbPanels2 = bbPanels.extend({
		panelBuilder: bbPanels.prototype.panelBuilder.extend({

			initialize: function initialize(options) {

				bbPanels.prototype.panelBuilder.prototype.initialize.call(this, options);

				this.on('resize', function () {

					this.model.set('right', this.model.get('left') + this.model.get('width'))

				}, this);

			},

			map: {
				top: '->css:top',

				minWidth: ['->css:min-width', '[data-attribute="minWidth"]'],
				width: ['->css:width', '[data-attribute="width"]'],
				maxWidth: ['->css:max-width', '[data-attribute="maxWidth"]'],

				minLeft: '[data-attribute="minLeft"]',
				left: ['->css:left', '[data-attribute="left"]'],
				maxLeft: '[data-attribute="maxLeft"]',

				minRight: '[data-attribute="minRight"]',
				right: '[data-attribute="right"]',
				maxRight: '[data-attribute="maxRight"]',

				height: '->css:height',
				minHeight: '->css:min-height',
				maxHeight: '->css:max-height',
			},
		})
	})


	window.panels = bbPanels2({
		el: $('#panels')
	});
});
