const {
  BN,           // Big Number support 
  constants,    // Common constants, like the zero address and largest integers
  expectEvent,  // Assertions for emitted events
  expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

const { assert, expect } = require("chai");

const Calc = artifacts.require("Calc");

contract("Calc contract", accounts => {
  let calcInstance;

  beforeEach(async () => {
    calcInstance = await Calc.new();
  });

  it("gets the num value before a set function is called", async function() {
    const numValue = await calcInstance.getNum();
    assert.equal(numValue, 0);
  });

  it("set the new num value and check if it changed", async function() {
    await calcInstance.setNum(5);

    const numValue = await calcInstance.getNum();
    assert.equal(numValue, 5);
  });
});
