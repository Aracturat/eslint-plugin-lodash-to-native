/**
 * @fileoverview Use native map where it is possible
 * @author
 */
'use strict';

//------------------------------------------------------------------------------
//	Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/map');
const { RuleTester } = require('eslint');

//------------------------------------------------------------------------------
//	Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 6 } });

ruleTester.run('map', rule, {
	valid: [
		'_.map({ "a": 4, "b": 8 }, square);',
		'Array.isArray(arr) ? arr.map(square) : _.map(arr, square);'
	],
	invalid: [
		{
			code: 'let arr = _.map([], () => 1);',
			output: 'let arr = [].map(() => 1);',
			errors: [{
				message: 'Do not use lodash map'
			}]
		},
		{
			code: 'function test() { return _.map(collection, fn); }',
			output: 'function test() { return Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn); }',
			errors: [{
				message: 'Do not use lodash map'
			}]
		},
		{
			code: '_.map([1, 2], fn).map(() => 1)',
			output: '[1, 2].map(fn).map(() => 1)',
			errors: [{
				message: 'Do not use lodash map'
			}]
		},
		{
			code: '_.map(collection, fn).map(fn)',
			output: '(Array.isArray(collection) ? collection.map(fn) : _.map(collection, fn)).map(fn)',
			errors: [{
				message: 'Do not use lodash map'
			}]
		},
		{
			code: '_.map(function() {}, fn)',
			output: 'Array.isArray(function() {}) ? (function() {}).map(fn) : _.map(function() {}, fn)',
			errors: [{
				message: 'Do not use lodash map'
			}]
		},
		{
			code: 'Array.isArray([]) ? arr.map(square) : _.map(arr, square)',
			output: 'Array.isArray([]) ? arr.map(square) : (Array.isArray(arr) ? arr.map(square) : _.map(arr, square))',
			errors: [{
				message: 'Do not use lodash map'
			}]
		}
	]
});
