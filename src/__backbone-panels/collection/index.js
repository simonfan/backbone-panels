//     backbone-panels
//     (c) simonfan
//     backbone-panels is licensed under the MIT terms.

/**
 * AMD module.
 *
 * @module backbone-panels
 */

define(function (require, exports, module) {
	'use strict';

	var backbone = require('lowercase-backbone'),
		_ = require('lodash');


	var panelCollection = module.exports = backbone.collection.extend({
		initialize: function initializePanelCollection(models, options) {
			backbone.collection.prototype.initialize.apply(this, arguments);


			// bind event handlers
			_.bindAll(this,
				'handleResize',
				'compressLeft',
				'compressRight',
				'expandLeft',
				'expandRight');

			/**
			 * 'resize' event is only triggered only when
			 * there is an actual interaction.
			 *
			 *
			 */
			this.on('resize', this.handleResize);
		},

		/**
		 * Intercept add method.
		 *
		 * @method add
		 * @param model {Backbone Model}
		 * @param options {Object}
		 */
		add: function addPanelModel(model, options) {
			// do normal adding.
			var panelModel = backbone.collection.prototype.add.apply(this, arguments);

			// position the panel
			if (!_.isArray(panelModel)) {
				this.postitionPanel(panelModel);
			} else {
				_.each(panelModel, this.postitionPanel, this);
			}
		},

		/**
		 * Retrieve all models before the given one.
		 *
		 * @method before
		 * @param model|index {Backbone Model|Number}
		 */
		before: function before() {
			var index = _.isNumber(arguments[0]) ? arguments[0] : this.indexOf(arguments[0]);

			return this.first(index);
		},

		/**
		 * Retrieve all models after the given one.
		 *
		 * @method after
		 * @param model|index {Backbone Model|Number}
		 */
		after: function() {
			var index = _.isNumber(arguments[0]) ? arguments[0] : this.indexOf(arguments[0]);

			return this.rest(index + 1);
		},


		/**
		 *
		 * @method reduceBefore
		 * @param model|index {Backbone Model|Number}
		 * @param iter {Function}
		 * @param memo {*}
		 * @param [context] {Object}
		 */
		reduceBefore: function(modelOrIndex, iter, memo, context) {
			var before = this.before(modelOrIndex);
			return _.reduce(before, iter, memo, context);
		},

		/**
		 *
		 * @method reduceAfter
		 * @param model|index {Backbone Model|Number}
		 * @param iter {Function}
		 * @param memo {*}
		 * @param [context] {Object}
		 */
		reduceAfter: function(modelOrIndex, iter, memo, context) {
			var after = this.after(modelOrIndex);
			return _.reduce(after, iter, memo, context);
		},

		/**
		 * Returns the left position at which a given
		 * panel should be placed.
		 *
		 * @method calculateLeftPos
		 * @param panel {Bakcbone Model}
		 */
		calculateLeftPos: function calculateLeftPos(panel) {
			return this.reduceBefore(panel, function(distance, panel) {
				return distance + panel.get('width') + 1;
			}, 0);
		},

		/**
		 * Set the place for the panel.
		 *
		 * @method postitionPanel
		 * @param panel {Backbone Model}
		 */
		postitionPanel: function postitionPanel(panel) {
			var left = this.calculateLeftPos(panel);

			console.log(left)

			panel.set('left', left);
		},

		/**
		 * Puts all panels in their places
		 * by calculating left positions on them all.
		 *
		 * @method arrange
		 */
		arrange: function arrange() {
			this.each(this.postitionPanel, this);
		},
	});

	// event handlers.
	panelCollection.proto(require('./event-handlers'));
});
