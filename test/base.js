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

			panels.arrange();
		});
	});
});
