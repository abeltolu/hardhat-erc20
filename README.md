# Hardhat ERC20

This project demonstrates a smart contract that creates an ERC20 token called OT using OpenZepplin template

# Requirements

Create a `.env` file with the following information:

```
GOERLI_RPC_URL=
GOERLI_PRIVATE_KEY=
COINMARKETCAP_API_KEY=
ETHERSCAN_API_KEY=
```

_GOERLI_RPC_URL_ is the RPC URL to the test network. You can create one on Alchemy.
_GOERLI_PRIVATE_KEY_ is the private key of your wallet on Metamask.

# Helpful Commands

```
npx hardhat test #to run tests
npx hardhat deploy #to deploy to localhost
npx hardhat deploy --network goerli #to deploy to testnet
```
