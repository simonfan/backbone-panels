define(function (require, exports, module) {
	'use strict';


	/**
	 * Calculates the max value that may be added to the
	 * current value given an attempted addition value
	 * and a max value.
	 *
	 * @method maxAddition
	 * @param data
	 *     @param addition {Number}
	 *     @param currValue {Number}
	 *     @param maxValue {Number}
	 */
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

	/**
	 * Calculates the maximum value that may be
	 * subtracted from a current value given an attemped
	 * subtraction value and a minimum value.
	 *
	 * @method maxSubtraction
	 * @param data
	 *     @param subtraction {Number}
	 *     @param currValue {Number}
	 *     @param minValue {Number}
	 */
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
