// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IVerifier} from "../interfaces/IVerifier.sol";

contract TimestampVerifier is IVerifier {
    function verify(bytes calldata params) external view override returns (bool) {
        uint256 target = abi.decode(params, (uint256));
        return block.timestamp >= target;
    }

    function getVerifierType() external pure override returns (string memory) {
        return "TIMESTAMP";
    }
}
