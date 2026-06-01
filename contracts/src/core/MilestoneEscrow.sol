// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IVerifier} from "../interfaces/IVerifier.sol";

/// @title MilestoneEscrow — Core Escrow Contract
/// @author MilestoneStream
/// @notice Manages USDC lockups, milestone claims, verifications, disputes, and cancellation.
contract MilestoneEscrow is ReentrancyGuard {
    using SafeERC20 for IERC20;

    address public funder;
    address public builder;
    address public token;
    address public arbiter;

    uint256 public totalAmount;
    uint256 public releasedAmount;
    bool public cancelled;
    EscrowStatus public status;

    enum EscrowStatus {
        Active,
        Completed,
        Cancelled,
        Disputed
    }
    enum MilestoneStatus {
        Pending,
        Claimed,
        Released,
        Disputed,
        Expired
    }

    struct Milestone {
        string title;
        string description;
        uint256 amount;
        address verifier;
        bytes verifierParams;
        uint256 deadline;
        MilestoneStatus status;
        bool isOptimistic;
        uint256 claimedAt;
    }

    Milestone[] public milestones;
    uint256 public constant CHALLENGE_WINDOW = 48 hours;

    // Cancellation consent state
    mapping(address => bool) public cancelApproved;

    event EscrowCreated(address funder, address builder, uint256 totalAmount);
    event MilestoneClaimed(uint256 indexed milestoneIndex, address builder);
    event MilestoneReleased(uint256 indexed milestoneIndex, uint256 amount);
    event MilestoneDisputed(uint256 indexed milestoneIndex, address funder);
    event DisputeResolved(uint256 indexed milestoneIndex, bool builderWins);
    event EscrowCancelled();

    modifier onlyBuilder() {
        require(msg.sender == builder, "Not builder");
        _;
    }

    modifier onlyFunder() {
        require(msg.sender == funder, "Not funder");
        _;
    }

    modifier onlyArbiter() {
        require(msg.sender == arbiter, "Not arbiter");
        _;
    }

    constructor(address _funder, address _builder, address _token, address _arbiter, Milestone[] memory _milestones) {
        require(_funder != address(0), "Zero msg funder");
        require(_builder != address(0), "Zero msg builder");
        require(_token != address(0), "Zero address token");
        require(_arbiter != address(0), "Zero address arbiter");
        require(_arbiter != _funder && _arbiter != _builder, "Arbiter is participant");
        require(_milestones.length > 0, "Empty milestones");
        require(_milestones.length <= 20, "Too many milestones");

        uint256 _totalAmount;
        for (uint256 i = 0; i < _milestones.length; ++i) {
            require(_milestones[i].verifier != address(0), "Zero verifier");
            _totalAmount += _milestones[i].amount;
            milestones.push(_milestones[i]);
        }

        require(_totalAmount > 0, "Sum must be positive");

        funder = _funder;
        builder = _builder;
        token = _token;
        arbiter = _arbiter;
        totalAmount = _totalAmount;
        status = EscrowStatus.Active;
    }

    function lockFunds(uint256 amount) external nonReentrant onlyFunder {
        require(status == EscrowStatus.Active, "Not active");
        require(amount == totalAmount, "Invalid total amount");

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit EscrowCreated(funder, builder, totalAmount);
    }

    function claimMilestone(uint256 milestoneIndex) external nonReentrant onlyBuilder {
        require(status == EscrowStatus.Active, "Not active");
        require(milestoneIndex < milestones.length, "Invalid index");

        Milestone storage ms = milestones[milestoneIndex];
        require(ms.status == MilestoneStatus.Pending, "Not pending");
        require(ms.deadline == 0 || block.timestamp <= ms.deadline, "Expired");

        bool verified = false;
        // Resilient try/catch to protect against faulty or reverting verifiers
        try IVerifier(ms.verifier).verify(ms.verifierParams) returns (bool _verified) {
            verified = _verified;
        } catch {}

        if (verified) {
            ms.status = MilestoneStatus.Released;
            releasedAmount += ms.amount;
            IERC20(token).safeTransfer(builder, ms.amount);
            emit MilestoneClaimed(milestoneIndex, builder);
            emit MilestoneReleased(milestoneIndex, ms.amount);
            _checkCompleted();
        } else if (ms.isOptimistic) {
            ms.status = MilestoneStatus.Claimed;
            ms.claimedAt = block.timestamp;
            emit MilestoneClaimed(milestoneIndex, builder);
        } else {
            revert("Verification failed");
        }
    }

    function releaseMilestone(uint256 milestoneIndex) external nonReentrant onlyBuilder {
        require(status == EscrowStatus.Active, "Not active");
        require(milestoneIndex < milestones.length, "Invalid index");

        Milestone storage ms = milestones[milestoneIndex];
        require(ms.status == MilestoneStatus.Claimed, "Not claimed");
        require(block.timestamp >= ms.claimedAt + CHALLENGE_WINDOW, "Window active");

        ms.status = MilestoneStatus.Released;
        releasedAmount += ms.amount;
        IERC20(token).safeTransfer(builder, ms.amount);
        emit MilestoneReleased(milestoneIndex, ms.amount);

        _checkCompleted();
    }

    function disputeMilestone(uint256 milestoneIndex) external onlyFunder {
        require(status == EscrowStatus.Active, "Not active");
        require(milestoneIndex < milestones.length, "Invalid index");

        Milestone storage ms = milestones[milestoneIndex];
        require(ms.status == MilestoneStatus.Claimed, "Not claimed");
        require(block.timestamp <= ms.claimedAt + CHALLENGE_WINDOW, "Window passed");

        ms.status = MilestoneStatus.Disputed;
        status = EscrowStatus.Disputed;
        emit MilestoneDisputed(milestoneIndex, funder);
    }

    function resolveDispute(uint256 milestoneIndex, bool builderWins) external nonReentrant onlyArbiter {
        require(status == EscrowStatus.Disputed, "Not disputed");
        require(milestoneIndex < milestones.length, "Invalid index");

        Milestone storage ms = milestones[milestoneIndex];
        require(ms.status == MilestoneStatus.Disputed, "Milestone not disputed");

        if (builderWins) {
            ms.status = MilestoneStatus.Released;
            releasedAmount += ms.amount;
            IERC20(token).safeTransfer(builder, ms.amount);
            emit DisputeResolved(milestoneIndex, true);
            emit MilestoneReleased(milestoneIndex, ms.amount);
        } else {
            ms.status = MilestoneStatus.Pending;
            emit DisputeResolved(milestoneIndex, false);
        }

        status = EscrowStatus.Active;
        _checkCompleted();
    }

    function cancelEscrow() external nonReentrant {
        require(status == EscrowStatus.Active, "Not active");
        require(msg.sender == funder || msg.sender == builder, "Not participant");

        for (uint256 i = 0; i < milestones.length; i++) {
            require(
                milestones[i].status == MilestoneStatus.Pending || milestones[i].status == MilestoneStatus.Expired,
                "Claims exist"
            );
        }

        // Mutual cancellation / Expiration check logic
        bool allExpired = true;
        bool hasDeadlines = false;
        for (uint256 i = 0; i < milestones.length; i++) {
            if (milestones[i].status == MilestoneStatus.Pending) {
                if (milestones[i].deadline > 0) {
                    hasDeadlines = true;
                    if (block.timestamp <= milestones[i].deadline) {
                        allExpired = false;
                    }
                } else {
                    allExpired = false;
                }
            }
        }

        bool canCancelUnilaterally = hasDeadlines && allExpired;

        if (canCancelUnilaterally) {
            _performCancellation();
        } else {
            cancelApproved[msg.sender] = true;
            if (cancelApproved[funder] && cancelApproved[builder]) {
                _performCancellation();
            }
        }
    }

    function _performCancellation() internal {
        cancelled = true;
        status = EscrowStatus.Cancelled;

        uint256 amountToReturn = totalAmount - releasedAmount;
        if (amountToReturn > 0) {
            IERC20(token).safeTransfer(funder, amountToReturn);
        }

        emit EscrowCancelled();
    }

    function _checkCompleted() internal {
        if (releasedAmount == totalAmount && !cancelled) {
            status = EscrowStatus.Completed;
        }
    }
}
