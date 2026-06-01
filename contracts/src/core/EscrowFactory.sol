// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {MilestoneEscrow} from "./MilestoneEscrow.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EscrowFactory is Ownable {
    address[] public allEscrows;
    mapping(address => address[]) public escrowsByFunder;
    mapping(address => address[]) public escrowsByBuilder;

    address public defaultArbiter;

    event EscrowDeployed(address indexed escrow, address indexed funder, address indexed builder);

    constructor(address _defaultArbiter) Ownable(msg.sender) {
        require(_defaultArbiter != address(0), "Zero address arbiter");
        defaultArbiter = _defaultArbiter;
    }

    function createEscrow(address builder, address token, MilestoneEscrow.Milestone[] calldata milestones)
        external
        returns (address escrowAddress)
    {
        require(builder != address(0), "Zero address builder");
        require(milestones.length > 0, "No milestones");

        MilestoneEscrow newEscrow = new MilestoneEscrow(
            msg.sender, // funder
            builder,
            token,
            defaultArbiter,
            milestones
        );

        escrowAddress = address(newEscrow);

        allEscrows.push(escrowAddress);
        escrowsByFunder[msg.sender].push(escrowAddress);
        escrowsByBuilder[builder].push(escrowAddress);

        emit EscrowDeployed(escrowAddress, msg.sender, builder);
    }

    function setDefaultArbiter(address _newArbiter) external onlyOwner {
        require(_newArbiter != address(0), "Zero address arbiter");
        defaultArbiter = _newArbiter;
    }

    function getEscrowsByFunder(address funder) external view returns (address[] memory) {
        return escrowsByFunder[funder];
    }

    function getEscrowsByBuilder(address builder) external view returns (address[] memory) {
        return escrowsByBuilder[builder];
    }

    function getAllEscrows() external view returns (address[] memory) {
        return allEscrows;
    }

    function getTotalEscrows() external view returns (uint256) {
        return allEscrows.length;
    }
}
