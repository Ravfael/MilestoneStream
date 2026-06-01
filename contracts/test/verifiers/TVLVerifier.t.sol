// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Test} from "forge-std/Test.sol";
import {TVLVerifier} from "../../src/verifiers/TVLVerifier.sol";
import {MockUSDC} from "../../src/mocks/MockUSDC.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockPriceFeed {
    uint8 public decimalsValue;
    int256 public price;

    constructor(uint8 _decimals, int256 _price) {
        decimalsValue = _decimals;
        price = _price;
    }

    function decimals() external view returns (uint8) {
        return decimalsValue;
    }

    function latestRoundData()
        external
        view
        returns (uint80, int256, uint256, uint256, uint80)
    {
        return (0, price, 0, 0, 0);
    }
}

contract Standard18DecimalToken is ERC20 {
    constructor() ERC20("Standard 18 Token", "ST18") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}

contract TVLVerifierTest is Test {
    TVLVerifier public tvlVerifier;
    MockUSDC public usdc;
    Standard18DecimalToken public token18;
    address public targetContract = address(0x111);

    function setUp() public {
        tvlVerifier = new TVLVerifier();
        usdc = new MockUSDC();
        token18 = new Standard18DecimalToken();
    }

    function test_TVLVerifier_6Decimals_8DecimalsFeed() public {
        // USDC (6 decimals)
        // Price feed: 8 decimals, price = $1.00 = 100000000 (10^8)
        MockPriceFeed feed = new MockPriceFeed(8, 100000000);

        // Required USD: $1,000 USD (in 18 decimals) = 1000 * 10^18
        uint256 requiredUSD = 1000 * 1e18;

        bytes memory params = abi.encode(targetContract, address(usdc), address(feed), requiredUSD);

        // Case 1: Target has 999 USDC ($999 USD value) -> should return false
        usdc.mint(targetContract, 999 * 1e6);
        assertFalse(tvlVerifier.verify(params));

        // Case 2: Target has 1000 USDC ($1000 USD value) -> should return true
        usdc.mint(targetContract, 1 * 1e6); // total 1000 USDC
        assertTrue(tvlVerifier.verify(params));
    }

    function test_TVLVerifier_18Decimals_8DecimalsFeed() public {
        // Token18 (18 decimals)
        // Price feed: 8 decimals, price = $2.50 = 250000000 (2.5 * 10^8)
        MockPriceFeed feed = new MockPriceFeed(8, 250000000);

        // Required USD: $5,000 USD (in 18 decimals) = 5000 * 1e18
        uint256 requiredUSD = 5000 * 1e18;

        bytes memory params = abi.encode(targetContract, address(token18), address(feed), requiredUSD);

        // Target needs at least 2000 tokens (2000 * 2.5 = 5000 USD)
        // Case 1: Target has 1999 tokens ($4997.50 USD value) -> should return false
        token18.mint(targetContract, 1999 * 1e18);
        assertFalse(tvlVerifier.verify(params));

        // Case 2: Target has 2000 tokens ($5000 USD value) -> should return true
        token18.mint(targetContract, 1 * 1e18); // total 2000 tokens
        assertTrue(tvlVerifier.verify(params));
    }

    function test_TVLVerifier_NegativePrice_ReturnsFalse() public {
        MockPriceFeed feed = new MockPriceFeed(8, -100);
        uint256 requiredUSD = 100 * 1e18;

        bytes memory params = abi.encode(targetContract, address(usdc), address(feed), requiredUSD);
        usdc.mint(targetContract, 1000 * 1e6);

        assertFalse(tvlVerifier.verify(params));
    }

    function test_TVLVerifier_TypeString() public view {
        assertEq(tvlVerifier.getVerifierType(), "TVL_THRESHOLD");
    }
}
