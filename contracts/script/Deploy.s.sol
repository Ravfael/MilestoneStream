// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import {Script} from "forge-std/Script.sol";
import {EscrowFactory} from "../src/core/EscrowFactory.sol";
import {MockUSDC} from "../src/mocks/MockUSDC.sol";
import {ContractDeployedVerifier} from "../src/verifiers/ContractDeployedVerifier.sol";
import {TimestampVerifier} from "../src/verifiers/TimestampVerifier.sol";
import {TxCountVerifier} from "../src/verifiers/TxCountVerifier.sol";
import {TVLVerifier} from "../src/verifiers/TVLVerifier.sol";
import {console2} from "forge-std/console2.sol";

contract DeployScript is Script {
    function run() public {
        uint256 deployerPrivateKey = vm.envOr("PRIVATE_KEY", uint256(1));
        address deployer = vm.addr(deployerPrivateKey);

        vm.startBroadcast(deployerPrivateKey);

        ContractDeployedVerifier cdVerifier = new ContractDeployedVerifier();
        TimestampVerifier tsVerifier = new TimestampVerifier();
        TxCountVerifier txVerifier = new TxCountVerifier();
        TVLVerifier tvlVerifier = new TVLVerifier();

        EscrowFactory factory = new EscrowFactory(deployer); // initial arbiter is deployer

        // Deploy MockUSDC if not mainnet
        address usdcAddress;
        if (block.chainid != 42161) {
            // Arbitrum mainnet
            MockUSDC mockUSDC = new MockUSDC();
            usdcAddress = address(mockUSDC);
        }

        vm.stopBroadcast();

        console2.log("ContractDeployedVerifier deployed at:", address(cdVerifier));
        console2.log("TimestampVerifier deployed at:", address(tsVerifier));
        console2.log("TxCountVerifier deployed at:", address(txVerifier));
        console2.log("TVLVerifier deployed at:", address(tvlVerifier));
        console2.log("EscrowFactory deployed at:", address(factory));
        if (usdcAddress != address(0)) {
            console2.log("MockUSDC deployed at:", usdcAddress);
        }

        // Ideally output this to deployments/{chainId}.json
        string memory json = "{}";
        json = vm.serializeAddress(json, "ContractDeployedVerifier", address(cdVerifier));
        json = vm.serializeAddress(json, "TimestampVerifier", address(tsVerifier));
        json = vm.serializeAddress(json, "TxCountVerifier", address(txVerifier));
        json = vm.serializeAddress(json, "TVLVerifier", address(tvlVerifier));
        json = vm.serializeAddress(json, "EscrowFactory", address(factory));
        if (usdcAddress != address(0)) {
            json = vm.serializeAddress(json, "MockUSDC", usdcAddress);
        }

        string memory dirPath = string.concat(vm.projectRoot(), "/deployments");
        vm.createDir(dirPath, true);
        string memory filePath = string.concat(dirPath, "/", vm.toString(block.chainid), ".json");
        vm.writeJson(json, filePath);
    }
}
