require.config({
	urlArgs: 'bust=0.3165084579959512',
	baseUrl: '/src',
	paths: {
		requirejs: '../bower_components/requirejs/require',
		text: '../bower_components/requirejs-text/text',
		mocha: '../node_modules/mocha/mocha',
		should: '../node_modules/should/should',
		'backbone-panels': 'index',
		'backbone-ui-resizable': '../bower_components/backbone-ui-resizable/built/backbone-ui-resizable',
		backbone: '../bower_components/backbone/backbone',
		'collection-dock': '../bower_components/collection-dock/built/collection-dock',
		'dockable-view': '../bower_components/dockable-view/built/dockable-view',
		'jquery-ui': '../bower_components/jquery-ui/ui/jquery-ui',
		'jquery-ui-resizable': '../bower_components/jquery-ui/ui/jquery-ui',
		jquery: '../bower_components/jquery/dist/jquery',
		'jquery.filler': '../bower_components/jquery.filler/built/jquery.filler',
		lodash: '../bower_components/lodash/dist/lodash.compat',
		'lowercase-backbone': '../bower_components/lowercase-backbone/built/lowercase-backbone',
		'model-dock': '../bower_components/model-dock/built/model-dock',
		q: '../bower_components/q/q',
		qunit: '../bower_components/qunit/qunit/qunit',
		'requirejs-text': '../bower_components/requirejs-text/text',
		subject: '../bower_components/subject/built/subject',
		underscore: '../bower_components/underscore/underscore',
		'backbone-ui-draggable': '../bower_components/backbone-ui-draggable/built/backbone-ui-draggable',
		no: '../bower_components/no/built/no'
	},
	shim: {
		backbone: {
			exports: 'Backbone',
			deps: [
				'jquery',
				'underscore'
			]
		},
		underscore: {
			exports: '_'
		},
		mocha: {
			exports: 'mocha'
		},
		should: {
			exports: 'should'
		},
		'jquery-ui': {
			deps: [
				'jquery'
			]
		}
	}
});
