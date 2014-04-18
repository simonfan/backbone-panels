/**
 * Logic for iterating over panel views.
 *
 *
 * @module backbone-panels
 * @submolude iterators
 */
define(function (require, exports, module) {
	'use strict';

	var _ = require('lodash');

	// Underscore methods that we want to implement on the Collection.
	// 90% of the core usefulness of Backbone Collections is actually implemented
	// right here:
	var _methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
	'inject', 'reduceRight', 'foldr', 'find', 'findIndex', 'detect', 'filter', 'select',
	'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
	'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
	'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
	'lastIndexOf', 'isEmpty', 'chain', 'sample', 'partition'];

	_.each(_methods, function (method) {
		exports[method] = function () {

			var args = Array.prototype.slice.call(arguments);

			// add panels
			args.unshift(this.panels);

			return _[method].apply(_, args);
		};
	});




	/**
	 * Retrieve all models before the given one.
	 *
	 * @method before
	 * @param index {Backbone Model|Number}
	 */
	exports.before = function before(index) {
		return this.first(index);
	};

	/**
	 * Retrieve all models after the given one.
	 *
	 * @method after
	 * @param index {Backbone Model|Number}
	 */
	exports.after = function after(index) {
		return this.rest(index + 1);
	};

	/**
	 *
	 * @method reduceBefore
	 * @param index {Backbone Model|Number}
	 * @param iter {Function}
	 * @param memo {*}
	 * @param [context] {Object}
	 */
	exports.reduceBefore = function reduceBefore(index, iter, memo, context) {
		var before = this.before(index);
		return _.reduce(before, iter, memo, context);
	};

	/**
	 *
	 * @method reduceAfter
	 * @param index {Backbone Model|Number}
	 * @param iter {Function}
	 * @param memo {*}
	 * @param [context] {Object}
	 */
	exports.reduceAfter = function reduceAfter(index, iter, memo, context) {
		var after = this.after(index);
		return _.reduce(after, iter, memo, context);
	};
});
