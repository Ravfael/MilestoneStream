// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IVerifier} from "../interfaces/IVerifier.sol";

interface ICountable {
    function getCount() external view returns (uint256);
}

/// @title TxCountVerifier — Dynamic Transaction Count Verification
/// @author MilestoneStream
/// @notice Verifies that a target contract counter has met or exceeded a specific value.
contract TxCountVerifier is IVerifier {
    function verify(bytes calldata params) external view override returns (bool) {
        (address targetContract, uint256 requiredCount, bytes4 functionSelector) =
            abi.decode(params, (address, uint256, bytes4));

        (bool success, bytes memory data) = targetContract.staticcall(abi.encodeWithSelector(functionSelector));
        if (!success || data.length < 32) {
            return false;
        }

        uint256 count = abi.decode(data, (uint256));
        return count >= requiredCount;
    }

    function getVerifierType() external pure override returns (string memory) {
        return "TX_COUNT";
    }
}
