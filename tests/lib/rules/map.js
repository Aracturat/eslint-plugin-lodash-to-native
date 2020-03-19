/**
 * @fileoverview Use native map where it is possible
 * @author
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/map");
const { RuleTester } = require("eslint");

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();

ruleTester.run("map", rule, {
    valid: [
        // give me some code that won't trigger a warning
    ],
    invalid: [
        {
            code: "_.map([])",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
