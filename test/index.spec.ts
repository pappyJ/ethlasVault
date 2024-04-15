/* eslint-disable node/no-missing-import */
import { expect } from 'chai';
import { ethers } from 'hardhat';
import TOKEN_DETAILS from '../constants';
import { loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';

describe('Token Vault', function () {
  const deployVault = async () => {
    const accounts = await ethers.getSigners();

    const user1 = accounts[0];

    // Deploy the ERC20 token contract
    const TokenFactory = await ethers.getContractFactory(TOKEN_DETAILS.TOKEN_CONTRACT);

    const ETVToken = await TokenFactory.deploy();

    await ETVToken.deployed();

    // Deploy the Token Vault contract
    const VaultFactory = await ethers.getContractFactory(TOKEN_DETAILS.VAULT_CONTRACT);

    const EthlasVault = await VaultFactory.deploy();

    await EthlasVault.deployed();

    return { ETVToken, EthlasVault, user1 };
  };

  describe('Deposit', function () {
    it('Should deposit tokens successfully', async function () {
      // load contract defaults
      const { ETVToken, EthlasVault, user1 } = await loadFixture(deployVault);

      const depositAmount = ethers.utils.parseEther('100');

      // Allow the token in the EthlasVault contract
      await EthlasVault.allowToken(ETVToken.address, true);

      // User1 approves the EthlasVault contract to spend their tokens
      await ETVToken.connect(user1).approve(EthlasVault.address, depositAmount);

      // User1 deposits tokens
      await EthlasVault.connect(user1).deposit(ETVToken.address, depositAmount);

      // Check the user's deposit balance and the total deposits
      const [userDepositAmount] = await EthlasVault.getDepositInfo(user1.address, ETVToken.address);

      expect(userDepositAmount).to.equal(depositAmount);
      expect(await EthlasVault.getTotalDeposits(ETVToken.address)).to.equal(depositAmount);
    });

    it('Should not allow deposit of disallowed token', async function () {
      // load contract defaults
      const { ETVToken, EthlasVault, user1 } = await loadFixture(deployVault);

      const depositAmount = ethers.utils.parseEther('100');

      // User1 approves the EthlasVault contract to spend their tokens
      await ETVToken.connect(user1).approve(EthlasVault.address, depositAmount);

      // User1 tries to deposit tokens, but the token is not allowed
      await expect(EthlasVault.connect(user1).deposit(ETVToken.address, depositAmount)).to.be.revertedWith('Token not allowed');
    });

    it('Should not allow deposit with amount less than or equal to zero', async function () {
      // load contract defaults
      const { ETVToken, EthlasVault, user1 } = await loadFixture(deployVault);

      // Allow the token in the EthlasVault contract
      await EthlasVault.allowToken(ETVToken.address, true);

      // User1 approves the EthlasVault contract to spend their tokens
      await ETVToken.connect(user1).approve(EthlasVault.address, ethers.utils.parseEther('100'));

      // User1 tries to deposit zero tokens
      await expect(EthlasVault.connect(user1).deposit(ETVToken.address, 0)).to.be.revertedWith('Deposit amount must be greater than zero');
    });
  });

  describe('Withdrawal', function () {
    it('Should withdraw tokens successfully', async function () {
      // load contract defaults
      const { ETVToken, EthlasVault, user1 } = await loadFixture(deployVault);

      const depositAmount = ethers.utils.parseEther('100');

      // Allow the token in the EthlasVault contract
      await EthlasVault.allowToken(ETVToken.address, true);

      // User1 approves the EthlasVault contract to spend their tokens
      await ETVToken.connect(user1).approve(EthlasVault.address, depositAmount);

      // User1 deposits tokens
      await EthlasVault.connect(user1).deposit(ETVToken.address, depositAmount);

      // Owner withdraws the tokens
      await EthlasVault.withdraw(ETVToken.address, depositAmount);

      // Check the user's deposit balance and the total deposits
      const [userDepositAmount] = await EthlasVault.getDepositInfo(user1.address, ETVToken.address);

      expect(userDepositAmount).to.equal(0);
      expect(await EthlasVault.getTotalDeposits(ETVToken.address)).to.equal(0);
    });

    it('Should not allow withdrawal of disallowed token', async function () {
      // load contract defaults
      const { ETVToken, EthlasVault, user1 } = await loadFixture(deployVault);

      const depositAmount = ethers.utils.parseEther('100');

      // User1 approves the EthlasVault contract to spend their tokens
      await ETVToken.connect(user1).approve(EthlasVault.address, depositAmount);

      // User1 deposits tokens
      await EthlasVault.connect(user1).deposit(ETVToken.address, depositAmount);

      // Owner tries to withdraw the tokens, but the token is not allowed
      await expect(EthlasVault.withdraw(ETVToken.address, depositAmount)).to.be.revertedWith('Token not allowed');
    });

    it('Should not allow withdrawal with amount less than or equal to zero', async function () {
      // load contract defaults
      const { ETVToken, EthlasVault } = await loadFixture(deployVault);

      // Allow the token in the EthlasVault contract
      await EthlasVault.allowToken(ETVToken.address, true);

      // Owner tries to withdraw zero tokens
      await expect(EthlasVault.withdraw(ETVToken.address, 0)).to.be.revertedWith('Withdrawal amount must be greater than zero');
    });

    it('Should not allow withdrawal with insufficient balance', async function () {
      // load contract defaults
      const { ETVToken, EthlasVault, user1 } = await loadFixture(deployVault);

      const depositAmount = ethers.utils.parseEther('100');

      // Allow the token in the EthlasVault contract
      await EthlasVault.allowToken(ETVToken.address, true);

      // User1 approves the EthlasVault contract to spend their tokens
      await ETVToken.connect(user1).approve(EthlasVault.address, depositAmount);

      // User1 deposits tokens
      await EthlasVault.connect(user1).deposit(ETVToken.address, depositAmount);

      // Owner tries to withdraw more tokens than the user has deposited
      await expect(EthlasVault.withdraw(ETVToken.address, depositAmount.mul(2))).to.be.revertedWith('Insufficient balance');
    });
  });

  describe('Token Allowance', function () {
    it('Should allow a token', async function () {
      // load contract defaults
      const { ETVToken, EthlasVault } = await loadFixture(deployVault);

      await EthlasVault.allowToken(ETVToken.address, true);
      expect(await EthlasVault.allowedTokens(ETVToken.address)).to.equal(true);
    });

    it('Should disallow a token', async function () {
      // load contract defaults
      const { ETVToken, EthlasVault } = await loadFixture(deployVault);

      await EthlasVault.allowToken(ETVToken.address, true);
      await EthlasVault.allowToken(ETVToken.address, false);
      expect(await EthlasVault.allowedTokens(ETVToken.address)).to.equal(false);
    });
  });

  describe('Pausability', function () {
    it('Should pause the contract', async function () {
      // load contract defaults
      const { EthlasVault } = await loadFixture(deployVault);

      await EthlasVault.pause();
      expect(await EthlasVault.paused()).to.equal(true);
    });

    it('Should unpause the contract', async function () {
      // load contract defaults
      const { EthlasVault } = await loadFixture(deployVault);

      await EthlasVault.pause();
      await EthlasVault.unpause();
      expect(await EthlasVault.paused()).to.equal(false);
    });

    it('Should not allow deposit when paused', async function () {
      // load contract defaults
      const { ETVToken, EthlasVault, user1 } = await loadFixture(deployVault);

      await EthlasVault.allowToken(ETVToken.address, true);
      await EthlasVault.pause();

      // User1 approves the EthlasVault contract to spend their tokens
      await ETVToken.connect(user1).approve(EthlasVault.address, ethers.utils.parseEther('100'));

      // User1 tries to deposit tokens, but the contract is paused
      await expect(EthlasVault.connect(user1).deposit(ETVToken.address, ethers.utils.parseEther('100'))).to.be.revertedWith(
        'Contract is paused'
      );
    });

    it('Should not allow withdrawal when paused', async function () {
      // load contract defaults
      const { ETVToken, EthlasVault } = await loadFixture(deployVault);

      await EthlasVault.allowToken(ETVToken.address, true);
      await EthlasVault.pause();

      // Owner tries to withdraw tokens, but the contract is paused
      await expect(EthlasVault.withdraw(ETVToken.address, ethers.utils.parseEther('100'))).to.be.revertedWith('Contract is paused');
    });
  });
});
