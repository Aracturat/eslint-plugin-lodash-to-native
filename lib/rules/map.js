/**
 * @fileoverview Use native map where it is possible
 * @author
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @typedef {import('eslint').Rule.RuleContext} RuleContext
 * @typedef {import('estree').CallExpression} CallExpression
 * @typedef {import('estree').ConditionalExpression} ConditionalExpression
 * @typedef {import('estree').Node} Node
 */


module.exports = {
	meta: {
		docs: {
			description: 'Use native map where it is possible',
			category: 'Fill me in',
			recommended: false
		},
		fixable: 'code',
		schema: []
	},
	/**
	 * @param { RuleContext } context
	 */
	create: function (context) {
		/**
		 * Report error
		 *
		 * @param { CallExpression } node
		 * @param { String } textAfterFix
		 */
		function report(node, textAfterFix) {
			context.report({
				node: node.callee.property,
				message: 'Do not use lodash map',

				fix(fixer) {
					return fixer.replaceTextRange([node.start, node.end], textAfterFix)
				},
			});
		}

		return {
			/**
			 * @param { CallExpression | { parent: Node} } node
			 */
			CallExpression(node) {
				// Check call of property for object
				if (!node.callee.object || !node.callee.property) {
					return;
				}

				// Check _.map call
				if (node.callee.object.name !== '_' || node.callee.property.name !== 'map') {
					return;
				}

				// Check _.map call has two arguments
				if (node.arguments.length !== 2) {
					return;
				}

				const [firstArgument, secondArgument] = node.arguments;

				const firstArgumentText = context.getSourceCode().getText(firstArgument);
				const secondArgumentText = context.getSourceCode().getText(secondArgument);

				// If first argument is object, don't convert it
				if (firstArgument.type === 'ObjectExpression') {
					return;
				}

				// If first argument is array, convert it to simple map call
				if (firstArgument.type === 'ArrayExpression') {
					report(node, `${firstArgumentText}.map(${secondArgumentText})`);
					return;
				}

				let textAfterFix = null;

				if (firstArgument.type === 'Identifier') {
					textAfterFix = `Array.isArray(${firstArgumentText}) ? ${firstArgumentText}.map(${secondArgumentText}) : _.map(${firstArgumentText}, ${secondArgumentText})`;
				} else {
					textAfterFix = `Array.isArray(${firstArgumentText}) ? (${firstArgumentText}).map(${secondArgumentText}) : _.map(${firstArgumentText}, ${secondArgumentText})`;
				}

				// If parent is conditional, check that it is not converted before
				if (node.parent.type === 'ConditionalExpression') {
					/** @type { ConditionalExpression } */
					let parent = node.parent;

					if (
						parent.alternate === node
						&&
						parent.test.type === "CallExpression"
						&&
						parent.test.callee.type === "MemberExpression"
						&&
						parent.test.callee.object.name === "Array"
						&&
						parent.test.callee.property.name === "isArray"
						&&
						parent.test.arguments.length === 1
					) {
						const isArrayArgument = parent.test.arguments[0];
						const isArrayArgumentText = context.getSourceCode().getText(isArrayArgument);

						if (isArrayArgumentText === firstArgumentText) {
							return;
						}
					}
				}

				// If parent is member or conditional expression, add parentheses
				if (['MemberExpression', 'ConditionalExpression'].includes(node.parent.type)) {
					textAfterFix = `(${textAfterFix})`;
				}

				report(node, textAfterFix);
			}
		};
	}
};
