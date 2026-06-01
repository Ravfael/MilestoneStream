// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {IVerifier} from "../interfaces/IVerifier.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface AggregatorV3Interface {
    function decimals() external view returns (uint8);
    function description() external view returns (string memory);
    function version() external view returns (uint256);
    function getRoundData(uint80 _roundId)
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
    function latestRoundData()
        external
        view
        returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound);
}

/// @title TVLVerifier — TVL Threshold Verification using Chainlink Price Feeds
/// @author MilestoneStream
/// @notice Verifies token TVL scaled to 18-decimal precision.
contract TVLVerifier is IVerifier {
    function verify(bytes calldata params) external view override returns (bool) {
        (address targetContract, address token, address priceFeed, uint256 requiredUSDValue) =
            abi.decode(params, (address, address, address, uint256));

        uint256 balance = IERC20(token).balanceOf(targetContract);

        (, int256 price,,,) = AggregatorV3Interface(priceFeed).latestRoundData();
        if (price <= 0) return false;

        uint8 feedDecimals = AggregatorV3Interface(priceFeed).decimals();

        (bool success, bytes memory data) = token.staticcall(abi.encodeWithSignature("decimals()"));
        uint8 tokenDecimals = success && data.length > 0 ? abi.decode(data, (uint8)) : 18;

        // Uniformly scale to 18 decimal places for TVL calculation to prevent decimal scaling bugs
        uint256 tvl = (balance * uint256(price) * 1e18) / (10 ** tokenDecimals) / (10 ** feedDecimals);

        return tvl >= requiredUSDValue;
    }

    function getVerifierType() external pure override returns (string memory) {
        return "TVL_THRESHOLD";
    }
}
