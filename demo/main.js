define(['backbone-panels', 'lodash'], function (bbPanels, _) {

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

				panelStatus: '[data-attribute="panelStatus"]',

				openWidth: '[data-attribute="openWidth"]',
				closeWidth: '[data-attribute="closeWidth"]',

				elasticity: '[data-attribute="elasticity"]'
			},
		})
	})


	window.panels = bbPanels2({
		el: $('#panels')
	});






	// controls
	var $openControl = $('#open-control'),
		$closeControl = $('#close-control');

	$openControl.find('button').click(function () {
		var pindexes = $openControl.find('input').val().split(','),
			direction = $openControl.find('select').val();

		_.each(pindexes, function (index) {

			var panel = panels.getPanelAt(index);

			console.log('open remainder ' + panel.bbpOpen(direction));
		})
	});

	$closeControl.find('button').click(function () {
		var pindexes = $closeControl.find('input').val().split(','),
			direction = $closeControl.find('select').val();

		_.each(pindexes, function (index) {

			var panel = panels.getPanelAt(index);

			console.log('close remainder ' + panel.bbpClose(direction));
		})
	})
});
