define(function (require, exports, module) {
	'use strict';

	exports.maxAddition = function maxAddition(data) {

		var addition = data.addition,
			currValue = data.currValue,
			maxValue = data.maxValue;

		if (_.isNumber(maxValue)) {

				// check what would be the result if
				// attempt was fully applied
			var attempt = currValue + addition;

			// maximum set
			if (attempt <= maxValue) {
				// accepted
				return addition;
			} else {
				// not accepted
				// return the maximum addition
				return maxValue - currValue;
			}

		} else {
			// no maximum, addition accepted
			return addition;
		}
	};

	exports.maxSubtraction = function maxSubtraction(data) {

		var subtraction = data.subtraction,
			currValue = data.currValue,
			minValue = data.minValue;


		if (_.isNumber(minValue)) {

				// check what would be the result if
				// attempt was fully applied
			var attempt = currValue - subtraction;

			// minimum set
			if (attempt >= minValue) {
				// accepted
				return subtraction;
			} else {
				// not accepted
				// return the maximum subtraction
				return currValue - minValue;
			}

		} else {
			// no minimum, subtraction accepted
			return subtraction;
		}
	};

});
