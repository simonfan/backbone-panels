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

	var collectionDock = require('collection-dock');

	// internal
	var itemView = require('./__backbone-panels/item-view');



	var panels = module.exports = collectionDock.extend({
		itemHtml: '<div class="panel"></div>',
		itemView: itemView,
	});
});
