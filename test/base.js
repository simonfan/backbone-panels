(function(name, factory) {

	var mod = typeof define !== 'function' ?
		// node
		'.././src' :
		// browser
		'backbone-panels',
		// dependencies for the test
		deps = [mod, 'should', 'jquery', 'backbone', 'backbone-ui-resizable'];

	if (typeof define !== 'function') {
		// node
		factory.apply(null, deps.map(require));
	} else {
		// browser
		define(deps, factory);
	}

})('test', function(backbonePanels, should, $, Backbone, resizable) {
	'use strict';

	describe('backbonePanels base', function () {
		beforeEach(function (done) {
			done();
		});

		it('is fine (:', function () {

			var collection = new Backbone.Collection([]);

			var panels = backbonePanels({
				el: $('#panels')
			});

			panels.attach(collection);

			// add a panel
			collection.add([
				{ width: 100, height: 100 },
				{ width: 300, height: 300, 'min-width': 200 },
				{ width: 120, height: 120, 'min-width': 70, 'max-width': 200 },
				{ width: 240, height: 240, 'min-width': 122 },
				{ width: 190, height: 190, 'min-width': 170 }
			]);

			panels.arrange();
		});
	});
});
