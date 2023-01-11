import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";
import { verifyContract } from "../utils/verify";
import { ethers, network } from "hardhat";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, getChainId } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = await getChainId();

  log("Deploying OurToken...");
  const initialSupply = networkConfig[chainId]["initialSupply"];
  const args = [initialSupply];

  const raffle = await deploy("OurToken", {
    from: deployer,
    args,
    log: true,
    waitConfirmations: developmentChains.includes(network.name) ? 1 : 6,
  });
  log("Deployed OurToken...");

  if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    await verifyContract(raffle.address, args);
    log("Verified on Etherscan!");
  }
};
func["tags"] = ["All", "Raffle"];
export default func;
