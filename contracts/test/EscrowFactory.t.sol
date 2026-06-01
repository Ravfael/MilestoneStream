// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test, console2} from "forge-std/Test.sol";
import {EscrowFactory} from "../src/core/EscrowFactory.sol";
import {MilestoneEscrow} from "../src/core/MilestoneEscrow.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {TimestampVerifier} from "../src/verifiers/TimestampVerifier.sol";

contract EscrowFactoryTest is Test {
    EscrowFactory public factory;
    MockUSDC public usdc;
    TimestampVerifier public timestampVerifier;

    address public owner = address(10);
    address public defaultArbiter = address(3);
    address public builder = address(2);
    address public funder = address(1);

    function setUp() public {
        usdc = new MockUSDC();
        timestampVerifier = new TimestampVerifier();

        vm.prank(owner);
        factory = new EscrowFactory(defaultArbiter);
    }

    function test_CreateEscrow_Success() public {
        MilestoneEscrow.Milestone[] memory milestones = new MilestoneEscrow.Milestone[](1);
        milestones[0] = MilestoneEscrow.Milestone({
            title: "MS1",
            description: "First milestone",
            amount: 1000e6,
            verifier: address(timestampVerifier),
            verifierParams: abi.encode(100),
            deadline: 0,
            status: MilestoneEscrow.MilestoneStatus.Pending,
            isOptimistic: false,
            claimedAt: 0
        });

        vm.prank(funder);
        address escrowAddr = factory.createEscrow(builder, address(usdc), milestones);

        assertTrue(escrowAddr != address(0));

        // Check registry mappings
        address[] memory funderEscrows = factory.getEscrowsByFunder(funder);
        assertEq(funderEscrows.length, 1);
        assertEq(funderEscrows[0], escrowAddr);

        address[] memory builderEscrows = factory.getEscrowsByBuilder(builder);
        assertEq(builderEscrows.length, 1);
        assertEq(builderEscrows[0], escrowAddr);

        address[] memory allEscrows = factory.getAllEscrows();
        assertEq(allEscrows.length, 1);
        assertEq(allEscrows[0], escrowAddr);

        assertEq(factory.getTotalEscrows(), 1);

        // Verify contract settings
        MilestoneEscrow escrowInstance = MilestoneEscrow(escrowAddr);
        assertEq(escrowInstance.funder(), funder);
        assertEq(escrowInstance.builder(), builder);
        assertEq(escrowInstance.token(), address(usdc));
        assertEq(escrowInstance.arbiter(), defaultArbiter);
    }

    function test_CreateEscrow_ZeroBuilder_Reverts() public {
        MilestoneEscrow.Milestone[] memory milestones = new MilestoneEscrow.Milestone[](1);
        milestones[0] = MilestoneEscrow.Milestone({
            title: "MS1",
            description: "First milestone",
            amount: 1000e6,
            verifier: address(timestampVerifier),
            verifierParams: abi.encode(100),
            deadline: 0,
            status: MilestoneEscrow.MilestoneStatus.Pending,
            isOptimistic: false,
            claimedAt: 0
        });

        vm.expectRevert("Zero address builder");
        vm.prank(funder);
        factory.createEscrow(address(0), address(usdc), milestones);
    }

    function test_CreateEscrow_EmptyMilestones_Reverts() public {
        MilestoneEscrow.Milestone[] memory milestones = new MilestoneEscrow.Milestone[](0);

        vm.expectRevert("No milestones");
        vm.prank(funder);
        factory.createEscrow(builder, address(usdc), milestones);
    }

    function test_SetDefaultArbiter_OnlyOwner() public {
        address newArbiter = address(4);

        vm.expectRevert(); // OwnableUnauthorizedAccount
        vm.prank(funder);
        factory.setDefaultArbiter(newArbiter);

        vm.prank(owner);
        factory.setDefaultArbiter(newArbiter);
        assertEq(factory.defaultArbiter(), newArbiter);
    }

    function test_SetDefaultArbiter_ZeroAddress_Reverts() public {
        vm.expectRevert("Zero address arbiter");
        vm.prank(owner);
        factory.setDefaultArbiter(address(0));
    }
}
