/*
Copyright 2016, 2017 OCAD University

Licensed under the New BSD license. You may not use this file except in
compliance with this License.

You may obtain a copy of the License at
https://raw.githubusercontent.com/fluid-project/co-occurrence-engine/master/LICENSE.txt
*/

/* eslint-env node */


// TODO: When we can support multiple recipe product instances, move the
// logic of this test to CoOccurrenceEngineTests


"use strict";

var fluid = require("infusion"),
    gpii = fluid.registerNamespace("gpii");

fluid.require("node-jqunit");

require("../index.js");
require("../src/test/RecipeTestGrades.js");

fluid.registerNamespace("gpii.test.nexus");

gpii.test.nexus.changeModelAtPath = function (componentPath, modelPath, value) {
    fluid.componentForPath(componentPath).applier.change(modelPath, value);
};

gpii.test.nexus.changeEventForComponent = function (path) {
    return fluid.componentForPath(path).applier.modelChanged;
};

// Tests

fluid.defaults("gpii.tests.nexus.recipeProductTestTree", {
    gradeNames: ["fluid.test.testEnvironment"],
    components: {
        recipeProductTester: {
            type: "gpii.tests.nexus.recipeProductTester"
        }
    }
});

fluid.defaults("gpii.tests.nexus.recipeProductTester", {
    gradeNames: ["fluid.test.testCaseHolder"],
    modules: [ {
        name: "Nexus Recipe Product tests",
        tests: [
            {
                name: "Construct multiple recipes and verify model relay",
                expect: 2,
                sequence: [
                    // Add some peers
                    {
                        func: "fluid.construct",
                        args: [
                            "nexusRecipeProductTests",
                            {
                                type: "fluid.modelComponent"
                            }
                        ]
                    },
                    {
                        func: "fluid.construct",
                        args: [
                            "nexusRecipeProductTests.componentA1",
                            {
                                type: "gpii.test.nexus.reactantA"
                            }
                        ]
                    },
                    {
                        func: "fluid.construct",
                        args: [
                            "nexusRecipeProductTests.componentA2",
                            {
                                type: "gpii.test.nexus.reactantA"
                            }
                        ]
                    },
                    {
                        func: "fluid.construct",
                        args: [
                            "nexusRecipeProductTests.componentB1",
                            {
                                type: "gpii.test.nexus.reactantB"
                            }
                        ]
                    },
                    {
                        func: "fluid.construct",
                        args: [
                            "nexusRecipeProductTests.componentB2",
                            {
                                type: "gpii.test.nexus.reactantB"
                            }
                        ]
                    },
                    // Make some recipe products
                    {
                        func: "fluid.construct",
                        args: [
                            "nexusRecipeProductTests.recipeX1",
                            {
                                type: "gpii.test.nexus.recipeX.product",
                                componentPaths: {
                                    componentA: "nexusRecipeProductTests.componentA1",
                                    componentB: "nexusRecipeProductTests.componentB1"
                                }
                            }
                        ]
                    }, {
                        func: "fluid.construct",
                        args: [
                            "nexusRecipeProductTests.recipeX2",
                            {
                                type: "gpii.test.nexus.recipeX.product",
                                componentPaths: {
                                    componentA: "nexusRecipeProductTests.componentA2",
                                    componentB: "nexusRecipeProductTests.componentB2"
                                }
                            }
                        ]
                    },
                    // Exercise the model relay rules and verify
                    {
                        func: "gpii.test.nexus.changeModelAtPath",
                        args: ["nexusRecipeProductTests.componentA1", "valueA", 42]
                    },
                    {
                        changeEvent: "@expand:gpii.test.nexus.changeEventForComponent(nexusRecipeProductTests.componentB1)",
                        path: "valueB",
                        listener: "jqUnit.assertEquals",
                        args: [
                            "Component B1 model updated",
                            84,
                            "{arguments}.0"
                        ]
                    },
                    {
                        func: "gpii.test.nexus.changeModelAtPath",
                        args: ["nexusRecipeProductTests.componentA2", "valueA", 420]
                    },
                    {
                        changeEvent: "@expand:gpii.test.nexus.changeEventForComponent(nexusRecipeProductTests.componentB2)",
                        path: "valueB",
                        listener: "jqUnit.assertEquals",
                        args: [
                            "Component B2 model updated",
                            840,
                            "{arguments}.0"
                        ]
                    }
                ]
            }
        ]
    } ]
});

fluid.test.runTests([ "gpii.tests.nexus.recipeProductTestTree" ]);
