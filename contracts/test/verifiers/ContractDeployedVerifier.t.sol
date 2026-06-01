// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {ContractDeployedVerifier} from "../../src/verifiers/ContractDeployedVerifier.sol";
import {TimestampVerifier} from "../../src/verifiers/TimestampVerifier.sol";
import {TxCountVerifier, ICountable} from "../../src/verifiers/TxCountVerifier.sol";

contract SimpleCounter is ICountable {
    uint256 public count;

    function increment() external {
        count++;
    }

    function getCount() external view override returns (uint256) {
        return count;
    }
}

contract ContractDeployedVerifierTest is Test {
    ContractDeployedVerifier public codeVerifier;
    TimestampVerifier public timeVerifier;
    TxCountVerifier public countVerifier;

    SimpleCounter public counter;

    function setUp() public {
        codeVerifier = new ContractDeployedVerifier();
        timeVerifier = new TimestampVerifier();
        countVerifier = new TxCountVerifier();
        counter = new SimpleCounter();
    }

    // 1. ContractDeployedVerifier tests
    function test_ContractDeployed_CodeLengthCheck() public {
        // EOA has no code
        address eoa = address(0x999);
        assertFalse(codeVerifier.verify(abi.encode(eoa)));

        // Contract has code
        assertTrue(codeVerifier.verify(abi.encode(address(counter))));

        // Zero address has no code
        assertFalse(codeVerifier.verify(abi.encode(address(0))));

        assertEq(codeVerifier.getVerifierType(), "CONTRACT_DEPLOYED");
    }

    // 2. TimestampVerifier tests
    function test_TimestampVerifier_TimeCheck() public {
        uint256 targetTime = 1000;

        // Before target time
        vm.warp(500);
        assertFalse(timeVerifier.verify(abi.encode(targetTime)));

        // At target time
        vm.warp(1000);
        assertTrue(timeVerifier.verify(abi.encode(targetTime)));

        // After target time
        vm.warp(2000);
        assertTrue(timeVerifier.verify(abi.encode(targetTime)));

        assertEq(timeVerifier.getVerifierType(), "TIMESTAMP");
    }

    // 3. TxCountVerifier tests
    function test_TxCountVerifier_CounterCheck() public {
        bytes4 selector = ICountable.getCount.selector;

        // Count is 0 initially, required is 2
        assertFalse(countVerifier.verify(abi.encode(address(counter), 2, selector)));

        // Increment once
        counter.increment();
        assertFalse(countVerifier.verify(abi.encode(address(counter), 2, selector)));

        // Increment again -> now count = 2
        counter.increment();
        assertTrue(countVerifier.verify(abi.encode(address(counter), 2, selector)));

        // Non-existent function selector or target contract should fail safely
        assertFalse(countVerifier.verify(abi.encode(address(counter), 2, bytes4(0x12345678))));
        assertFalse(countVerifier.verify(abi.encode(address(0), 2, selector)));

        assertEq(countVerifier.getVerifierType(), "TX_COUNT");
    }
}
