// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test, console2} from "forge-std/Test.sol";
import {MilestoneEscrow} from "../src/core/MilestoneEscrow.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {TimestampVerifier} from "../src/verifiers/TimestampVerifier.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockFalseVerifier {
    function verify(bytes calldata) external pure returns (bool) {
        return false;
    }
}

contract MockReentrantToken is ERC20 {
    address public escrowToReenter;
    uint256 public milestoneToClaim;
    bool public shouldReenter;

    constructor() ERC20("Reentrant Token", "RT") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }

    function setReenterTarget(address _escrow, uint256 _milestoneIndex) external {
        escrowToReenter = _escrow;
        milestoneToClaim = _milestoneIndex;
        shouldReenter = true;
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        if (shouldReenter) {
            shouldReenter = false; // Prevent infinite loop during test execution
            MilestoneEscrow(escrowToReenter).claimMilestone(milestoneToClaim);
        }
        return super.transfer(to, amount);
    }
}

contract MilestoneEscrowTest is Test {
    MilestoneEscrow public escrow;
    MockUSDC public usdc;
    TimestampVerifier public timestampVerifier;

    address public funder = address(1);
    address public builder = address(2);
    address public arbiter = address(3);

    function setUp() public {
        usdc = new MockUSDC();
        timestampVerifier = new TimestampVerifier();

        MilestoneEscrow.Milestone[] memory milestones = new MilestoneEscrow.Milestone[](3);

        milestones[0] = MilestoneEscrow.Milestone({
            title: "MS1 Auto",
            description: "Auto verified milestone",
            amount: 1000e6,
            verifier: address(timestampVerifier),
            verifierParams: abi.encode(100),
            deadline: 0,
            status: MilestoneEscrow.MilestoneStatus.Pending,
            isOptimistic: false,
            claimedAt: 0
        });

        milestones[1] = MilestoneEscrow.Milestone({
            title: "MS2 Opt",
            description: "Optimistic milestone",
            amount: 2000e6,
            verifier: address(timestampVerifier),
            verifierParams: abi.encode(100),
            deadline: 0,
            status: MilestoneEscrow.MilestoneStatus.Pending,
            isOptimistic: true,
            claimedAt: 0
        });

        milestones[2] = MilestoneEscrow.Milestone({
            title: "MS3 Opt",
            description: "Optimistic milestone 2",
            amount: 3000e6,
            verifier: address(timestampVerifier),
            verifierParams: abi.encode(100),
            deadline: 0,
            status: MilestoneEscrow.MilestoneStatus.Pending,
            isOptimistic: true,
            claimedAt: 0
        });

        escrow = new MilestoneEscrow(funder, builder, address(usdc), arbiter, milestones);

        usdc.mint(funder, 10000e6);
        vm.prank(funder);
        usdc.approve(address(escrow), type(uint256).max);
    }

    function test_LockFunds_Success() public {
        vm.prank(funder);
        escrow.lockFunds(6000e6);
        assertEq(usdc.balanceOf(address(escrow)), 6000e6);
    }

    function test_LockFunds_WrongAmount_Reverts() public {
        vm.expectRevert("Invalid total amount");
        vm.prank(funder);
        escrow.lockFunds(1000e6);
    }

    function _lock() internal {
        vm.prank(funder);
        escrow.lockFunds(6000e6);
    }

    function _setupMockFalse() internal {
        MockFalseVerifier falseVerifier = new MockFalseVerifier();
        MilestoneEscrow.Milestone[] memory milestones = new MilestoneEscrow.Milestone[](3);
        milestones[0] = MilestoneEscrow.Milestone({
            title: "MS1 Auto",
            description: "",
            amount: 1000e6,
            verifier: address(timestampVerifier),
            verifierParams: abi.encode(100),
            deadline: 0,
            status: MilestoneEscrow.MilestoneStatus.Pending,
            isOptimistic: false,
            claimedAt: 0
        });
        milestones[1] = MilestoneEscrow.Milestone({
            title: "MS2 Opt",
            description: "",
            amount: 2000e6,
            verifier: address(falseVerifier),
            verifierParams: abi.encode(100),
            deadline: 0,
            status: MilestoneEscrow.MilestoneStatus.Pending,
            isOptimistic: true,
            claimedAt: 0
        });
        milestones[2] = MilestoneEscrow.Milestone({
            title: "MS3 Opt",
            description: "",
            amount: 3000e6,
            verifier: address(falseVerifier),
            verifierParams: abi.encode(100),
            deadline: 0,
            status: MilestoneEscrow.MilestoneStatus.Pending,
            isOptimistic: true,
            claimedAt: 0
        });
        escrow = new MilestoneEscrow(funder, builder, address(usdc), arbiter, milestones);
        vm.prank(funder);
        usdc.approve(address(escrow), type(uint256).max);
        _lock();
    }

    function test_ClaimMilestone_AutoVerify_Success() public {
        _setupMockFalse();
        vm.warp(200);

        vm.prank(builder);
        escrow.claimMilestone(0);

        (,,,,,, MilestoneEscrow.MilestoneStatus status,,) = escrow.milestones(0);
        assertEq(uint256(status), uint256(MilestoneEscrow.MilestoneStatus.Released));
        assertEq(usdc.balanceOf(builder), 1000e6);
    }

    function test_ClaimMilestone_Optimistic_StartsWindow() public {
        _setupMockFalse();

        vm.prank(builder);
        escrow.claimMilestone(1);

        (,,,,,, MilestoneEscrow.MilestoneStatus status,, uint256 claimedAt) = escrow.milestones(1);
        assertEq(uint256(status), uint256(MilestoneEscrow.MilestoneStatus.Claimed));
        assertEq(claimedAt, block.timestamp);
    }

    function test_ReleaseMilestone_AfterWindow_Success() public {
        _setupMockFalse();
        vm.prank(builder);
        escrow.claimMilestone(1);

        vm.warp(block.timestamp + 48 hours + 1);

        vm.prank(builder);
        escrow.releaseMilestone(1);

        (,,,,,, MilestoneEscrow.MilestoneStatus status,,) = escrow.milestones(1);
        assertEq(uint256(status), uint256(MilestoneEscrow.MilestoneStatus.Released));
        assertEq(usdc.balanceOf(builder), 2000e6);
    }

    function test_ReleaseMilestone_BeforeWindow_Reverts() public {
        _setupMockFalse();
        vm.prank(builder);
        escrow.claimMilestone(1);

        vm.warp(block.timestamp + 24 hours);

        vm.expectRevert("Window active");
        vm.prank(builder);
        escrow.releaseMilestone(1);
    }

    function test_DisputeMilestone_WithinWindow_Success() public {
        _setupMockFalse();
        vm.prank(builder);
        escrow.claimMilestone(1);

        vm.prank(funder);
        escrow.disputeMilestone(1);

        (,,,,,, MilestoneEscrow.MilestoneStatus mstatus,,) = escrow.milestones(1);
        assertEq(uint256(mstatus), uint256(MilestoneEscrow.MilestoneStatus.Disputed));
        assertEq(uint256(escrow.status()), uint256(MilestoneEscrow.EscrowStatus.Disputed));
    }

    function test_DisputeMilestone_AfterWindow_Reverts() public {
        _setupMockFalse();
        vm.prank(builder);
        escrow.claimMilestone(1);

        vm.warp(block.timestamp + 48 hours + 1);

        vm.expectRevert("Window passed");
        vm.prank(funder);
        escrow.disputeMilestone(1);
    }

    function test_ResolveDispute_BuilderWins() public {
        _setupMockFalse();
        vm.prank(builder);
        escrow.claimMilestone(1);
        vm.prank(funder);
        escrow.disputeMilestone(1);

        vm.prank(arbiter);
        escrow.resolveDispute(1, true);

        (,,,,,, MilestoneEscrow.MilestoneStatus status,,) = escrow.milestones(1);
        assertEq(uint256(status), uint256(MilestoneEscrow.MilestoneStatus.Released));
        assertEq(usdc.balanceOf(builder), 2000e6);
    }

    function test_ResolveDispute_FunderWins() public {
        _setupMockFalse();
        vm.prank(builder);
        escrow.claimMilestone(1);
        vm.prank(funder);
        escrow.disputeMilestone(1);

        vm.prank(arbiter);
        escrow.resolveDispute(1, false);

        (,,,,,, MilestoneEscrow.MilestoneStatus status,,) = escrow.milestones(1);
        assertEq(uint256(status), uint256(MilestoneEscrow.MilestoneStatus.Pending));
    }

    function test_CancelEscrow_NoClaimedMilestones_Success() public {
        _setupMockFalse();
        
        vm.prank(funder);
        escrow.cancelEscrow();

        vm.prank(builder);
        escrow.cancelEscrow();

        assertEq(escrow.cancelled(), true);
        assertEq(uint256(escrow.status()), uint256(MilestoneEscrow.EscrowStatus.Cancelled));
        assertEq(usdc.balanceOf(funder), 10000e6);
    }

    function test_CancelEscrow_ExpiredPending_UnilateralFunderSuccess() public {
        MockFalseVerifier falseVerifier = new MockFalseVerifier();
        MilestoneEscrow.Milestone[] memory milestones = new MilestoneEscrow.Milestone[](1);
        milestones[0] = MilestoneEscrow.Milestone({
            title: "MS1 Expired",
            description: "",
            amount: 1000e6,
            verifier: address(falseVerifier),
            verifierParams: abi.encode(100),
            deadline: 100,
            status: MilestoneEscrow.MilestoneStatus.Pending,
            isOptimistic: false,
            claimedAt: 0
        });

        escrow = new MilestoneEscrow(funder, builder, address(usdc), arbiter, milestones);
        
        vm.prank(funder);
        usdc.approve(address(escrow), type(uint256).max);
        
        vm.prank(funder);
        escrow.lockFunds(1000e6);

        // Warp past deadline
        vm.warp(150);

        // Funder can cancel unilaterally because it's expired
        vm.prank(funder);
        escrow.cancelEscrow();

        assertEq(escrow.cancelled(), true);
        assertEq(uint256(escrow.status()), uint256(MilestoneEscrow.EscrowStatus.Cancelled));
    }

    function test_CancelEscrow_AfterClaim_Reverts() public {
        _setupMockFalse();
        vm.prank(builder);
        escrow.claimMilestone(1);

        vm.expectRevert("Claims exist");
        vm.prank(funder);
        escrow.cancelEscrow();
    }

    function test_OnlyBuilder_CanClaim() public {
        _setupMockFalse();

        vm.expectRevert("Not builder");
        vm.prank(funder);
        escrow.claimMilestone(0);
    }

    function test_OnlyFunder_CanDispute() public {
        _setupMockFalse();
        vm.prank(builder);
        escrow.claimMilestone(1);

        vm.expectRevert("Not funder");
        vm.prank(builder);
        escrow.disputeMilestone(1);
    }

    function test_ReentrancyGuard_OnClaim() public {
        MockReentrantToken reentrantToken = new MockReentrantToken();
        
        MilestoneEscrow.Milestone[] memory milestones = new MilestoneEscrow.Milestone[](1);
        milestones[0] = MilestoneEscrow.Milestone({
            title: "Reentrancy MS",
            description: "",
            amount: 1000e6,
            verifier: address(timestampVerifier),
            verifierParams: abi.encode(100),
            deadline: 0,
            status: MilestoneEscrow.MilestoneStatus.Pending,
            isOptimistic: false,
            claimedAt: 0
        });

        address maliciousBuilder = address(reentrantToken);
        MilestoneEscrow reentrantEscrow = new MilestoneEscrow(funder, maliciousBuilder, address(reentrantToken), arbiter, milestones);

        reentrantToken.mint(funder, 10000e6);
        vm.prank(funder);
        reentrantToken.approve(address(reentrantEscrow), type(uint256).max);

        vm.prank(funder);
        reentrantEscrow.lockFunds(1000e6);

        reentrantToken.setReenterTarget(address(reentrantEscrow), 0);

        vm.warp(200);

        vm.expectRevert(abi.encodeWithSignature("ReentrancyGuardReentrantCall()"));
        vm.prank(maliciousBuilder);
        reentrantEscrow.claimMilestone(0);
    }
}
