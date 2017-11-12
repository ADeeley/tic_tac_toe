var jsdom = require("mocha-jsdom");
var main = require("../js/main.js");

var assert = require("assert");
describe("Utility", () => {
    describe("#getCellsContaining()", () => {
        jsdom();
        it("Should return array of size 0 when no matching objects are present", () => {
            assert.equal(1, main.getCellsContaining("X").length)
        });
    });
});

