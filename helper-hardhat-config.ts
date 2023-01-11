import { ethers } from "hardhat";

export const networkConfig: Record<
  string,
  {
    name: string;
    initialSupply: string;
  }
> = {
  "5": {
    name: "goerli",
    initialSupply: "1000000000000000000000000",
  },
  "31337": {
    name: "hardhat",
    initialSupply: "1000000000000000000000000",
  },
};

export const developmentChains = ["hardhat", "localhost"];
