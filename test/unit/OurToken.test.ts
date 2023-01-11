import { ethers, getChainId, network } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { developmentChains, networkConfig } from "../../helper-hardhat-config";
import { OurToken } from "../../typechain-types";
import { assert, expect } from "chai";

!developmentChains.includes(network.name)
  ? describe.skip
  : describe("OurToken", async () => {
      //Multipler is used to make reading the math easier because of the 18 decimal points
      const multiplier = 10 ** 18;

      async function deployOurTokenFixture() {
        const [owner, user1] = await ethers.getSigners();
        const chainId = await getChainId();
        const initialSupply = networkConfig[chainId]["initialSupply"];

        //deploy raffle
        const OurTokenFactory = await ethers.getContractFactory("OurToken");

        const ourToken = (await OurTokenFactory.deploy(initialSupply)) as OurToken;
        await ourToken.deployed();
        // Fixtures can return anything you consider useful for your tests

        const accounts = await ethers.getSigners();
        const user1Token = ourToken.connect(user1);
        return {
          ourToken,
          owner,
          user1,
          accounts,
          initialSupply,
          user1Token,
          OurTokenFactory,
        };
      }

      describe("constructor", async () => {
        it("it initializes the correct total supply", async () => {
          const { ourToken, initialSupply } = await loadFixture(deployOurTokenFixture);
          const totalSupply = await ourToken.totalSupply();
          assert.equal(totalSupply.toString(), initialSupply);
        });

        it("initializes the token with the correct name and symbol ", async () => {
          const { ourToken, initialSupply } = await loadFixture(deployOurTokenFixture);
          const name = (await ourToken.name()).toString();
          assert.equal(name, "OurToken");

          const symbol = (await ourToken.symbol()).toString();
          assert.equal(symbol, "OT");
        });
      });

      describe("transfers", () => {
        it("Should be able to transfer tokens successfully to an address", async () => {
          const { ourToken, user1 } = await loadFixture(deployOurTokenFixture);
          const tokensToSend = ethers.utils.parseEther("10");
          await ourToken.transfer(user1.address, tokensToSend);
          expect(await ourToken.balanceOf(user1.address)).to.equal(tokensToSend);
        });
        it("emits an transfer event, when an transfer occurs", async () => {
          const { ourToken, user1 } = await loadFixture(deployOurTokenFixture);
          await expect(ourToken.transfer(user1.address, (10 * multiplier).toString())).to.emit(ourToken, "Transfer");
        });
      });

      describe("allowances", () => {
        const amount = (20 * multiplier).toString();
        it("Should approve other address to spend token", async () => {
          const { ourToken, user1, owner, user1Token } = await loadFixture(deployOurTokenFixture);
          const tokensToSpend = ethers.utils.parseEther("5");
          await ourToken.approve(user1.address, tokensToSpend);
          await user1Token.transferFrom(owner.address, user1.address, tokensToSpend);
          expect(await user1Token.balanceOf(user1.address)).to.equal(tokensToSpend);
        });
        it("doesn't allow an unnaproved member to do transfers", async () => {
          //Deployer is approving that user1 can spend 20 of their precious OT's
          const { user1, owner, user1Token } = await loadFixture(deployOurTokenFixture);

          await expect(user1Token.transferFrom(owner.address, user1.address, amount)).to.be.revertedWith(
            "ERC20: insufficient allowance"
          );
        });
        it("emits an approval event, when an approval occurs", async () => {
          const { ourToken, user1 } = await loadFixture(deployOurTokenFixture);
          await expect(ourToken.approve(user1.address, amount)).to.emit(ourToken, "Approval");
        });
        it("the allowance being set is accurate", async () => {
          const { ourToken, user1, owner } = await loadFixture(deployOurTokenFixture);
          await ourToken.approve(user1.address, amount);
          const allowance = await ourToken.allowance(owner.address, user1.address);
          assert.equal(allowance.toString(), amount);
        });
        it("won't allow a user to go over the allowance", async () => {
          const { ourToken, user1, owner, user1Token } = await loadFixture(deployOurTokenFixture);
          await ourToken.approve(user1.address, amount);
          await expect(
            user1Token.transferFrom(owner.address, user1.address, (40 * multiplier).toString())
          ).to.be.revertedWith("ERC20: insufficient allowance");
        });
      });
    });
