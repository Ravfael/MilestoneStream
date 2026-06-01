// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IVerifier} from "../interfaces/IVerifier.sol";

contract ContractDeployedVerifier is IVerifier {
    function verify(bytes calldata params) external view override returns (bool) {
        address target = abi.decode(params, (address));
        return target.code.length > 0;
    }

    function getVerifierType() external pure override returns (string memory) {
        return "CONTRACT_DEPLOYED";
    }
}
