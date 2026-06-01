// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface IVerifier {
    function verify(bytes calldata params) external view returns (bool);
    function getVerifierType() external pure returns (string memory);
}
