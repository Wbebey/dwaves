import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { DwavesToken, DwavesToken__factory } from '../typechain-types'

describe('DwavesToken', () => {
  let dwavesTokenFactory: DwavesToken__factory
  let dwavesToken: DwavesToken
  let userToken: DwavesToken
  let decimals: number
  let deployer: SignerWithAddress
  let bank: SignerWithAddress
  let user: SignerWithAddress

  before(async () => {
    const [deployer_, _, bank_, user_] = await ethers.getSigners()
    deployer = deployer_
    bank = bank_
    user = user_

    dwavesTokenFactory = await ethers.getContractFactory(
      'DwavesToken',
      deployer
    )
  })

  describe('When deploying the contract', () => {
    beforeEach(async () => {
      const dwavesToken_ = await dwavesTokenFactory.deploy(bank.address)
      await dwavesToken_.deployed()

      decimals = await dwavesToken_.decimals()
      dwavesToken = dwavesToken_.connect(bank)
      userToken = dwavesToken_.connect(user)
    })

    it('Creates a token with a name', async () => {
      expect(await dwavesToken.name()).to.be.equal('Dwaves')
    })

    it('Creates a token with a symbol', async () => {
      expect(await dwavesToken.symbol()).to.be.equal('VIBES')
    })

    it('Has a valid decimal', async () => {
      const tokenDecimals = (await dwavesToken.decimals()).toString()
      expect(tokenDecimals).to.equal('18')
    })

    it('Has a valid total supply', async () => {
      const expectedSupply = ethers.utils.parseUnits('400000000', decimals)
      const tokenSupply = (await dwavesToken.totalSupply()).toString()
      expect(tokenSupply).to.equal(expectedSupply)
    })

    it('Is able to query account balances', async () => {
      const expectedBalance = ethers.utils.parseUnits('400000000', decimals)
      const balance = await dwavesToken.balanceOf(bank.address)
      expect(balance).to.equal(expectedBalance)
    })

    it('Transfers the right amount of tokens to/from an account', async () => {
      const transferAmount = 1_000
      const transfer = dwavesToken.transfer(user.address, transferAmount)
      await expect(transfer).to.changeTokenBalances(
        dwavesToken,
        [bank.address, user.address],
        [-transferAmount, transferAmount]
      )
    })

    it("Emits a 'Transfer' event with the right arguments", async () => {
      const transferAmount = ethers.utils.parseUnits('100000', decimals)
      const transfer = dwavesToken.transfer(user.address, transferAmount)
      await expect(transfer)
        .to.emit(dwavesToken, 'Transfer')
        .withArgs(bank.address, user.address, transferAmount)
    })

    it('Allows for allowance approvals and queries', async () => {
      const approveAmount = ethers.utils.parseUnits('10000', decimals)
      await userToken.approve(bank.address, approveAmount)

      const allowance = await dwavesToken.allowance(user.address, bank.address)
      expect(allowance).to.equal(approveAmount)
    })

    it("Emits an 'Approval' event with the right arguments", async () => {
      const approveAmount = ethers.utils.parseUnits('10000', decimals)
      const approval = userToken.approve(bank.address, approveAmount)
      await expect(approval)
        .to.emit(dwavesToken, 'Approval')
        .withArgs(user.address, bank.address, approveAmount)
    })

    it('Allows an approved spender to transfer from owner', async () => {
      const rawTransferAmount = 10_000
      const transferAmount = ethers.utils.parseUnits(
        rawTransferAmount.toString(),
        decimals
      )
      await dwavesToken.transfer(user.address, transferAmount)
      await userToken.approve(bank.address, transferAmount)

      const transferFrom = dwavesToken.transferFrom(
        user.address,
        bank.address,
        rawTransferAmount
      )
      await expect(transferFrom).to.changeTokenBalances(
        dwavesToken,
        [bank.address, user.address],
        [rawTransferAmount, -rawTransferAmount]
      )
    })

    it("Emits a 'Transfer' event with the right arguments when conducting an approved transfer", async () => {
      const transferAmount = ethers.utils.parseUnits('10000', decimals)
      await dwavesToken.transfer(user.address, transferAmount)
      await userToken.approve(bank.address, transferAmount)

      const transferFrom = dwavesToken.transferFrom(
        user.address,
        bank.address,
        transferAmount
      )
      await expect(transferFrom)
        .to.emit(dwavesToken, 'Transfer')
        .withArgs(user.address, bank.address, transferAmount)
    })

    it('Allows allowance to be increased and queried', async () => {
      const initialAmount = ethers.utils.parseUnits('100', decimals)
      const incrementAmount = ethers.utils.parseUnits('10000', decimals)

      await userToken.approve(bank.address, initialAmount)
      const previousAllowance = await dwavesToken.allowance(
        user.address,
        bank.address
      )
      await userToken.increaseAllowance(bank.address, incrementAmount)
      const expectedAllowance = previousAllowance.add(incrementAmount)

      const allowance = await dwavesToken.allowance(user.address, bank.address)
      expect(allowance).to.equal(expectedAllowance)
    })

    it("Emits 'Approval' event when alllowance is increased", async () => {
      const incrementAmount = ethers.utils.parseUnits('10000', decimals)
      const allowanceIncrease = userToken.increaseAllowance(
        bank.address,
        incrementAmount
      )
      await expect(allowanceIncrease)
        .to.emit(dwavesToken, 'Approval')
        .withArgs(user.address, bank.address, incrementAmount)
    })

    it('Allows allowance to be decreased and queried', async () => {
      const initialAmount = ethers.utils.parseUnits('100', decimals)
      const decrementAmount = ethers.utils.parseUnits('10', decimals)

      await userToken.approve(bank.address, initialAmount)
      const previousAllowance = await dwavesToken.allowance(
        user.address,
        bank.address
      )
      await userToken.decreaseAllowance(bank.address, decrementAmount)
      const expectedAllowance = previousAllowance.sub(decrementAmount)

      const allowance = await dwavesToken.allowance(user.address, bank.address)
      expect(allowance).to.equal(expectedAllowance)
    })

    it("Emits 'Approval' event when alllowance is decreased", async () => {
      const initialAmount = ethers.utils.parseUnits('100', decimals)
      const decrementAmount = ethers.utils.parseUnits('10', decimals)

      await userToken.approve(bank.address, initialAmount)
      const expectedAllowance = initialAmount.sub(decrementAmount)

      const allowanceDecrease = userToken.decreaseAllowance(
        bank.address,
        decrementAmount
      )
      await expect(allowanceDecrease)
        .to.emit(dwavesToken, 'Approval')
        .withArgs(user.address, bank.address, expectedAllowance)
    })

    it('Allows burning own tokens', async () => {
      const burnAmount = ethers.utils.parseUnits('1000', decimals)
      const burn = dwavesToken.burn(burnAmount)
      await expect(burn)
        .to.changeTokenBalance(
          dwavesToken,
          bank.address,
          ethers.BigNumber.from(`-${burnAmount}`)
        )
        .and.to.emit(dwavesToken, 'Transfer')
        .withArgs(bank.address, ethers.constants.AddressZero, burnAmount)
    })

    it('Prevents burning if insufficient funds', async () => {
      const excessBurnAmount = ethers.utils.parseUnits('500000000', decimals)
      const exceedsBalanceBurn = dwavesToken.burn(excessBurnAmount)
      await expect(exceedsBalanceBurn).to.be.revertedWith(
        'ERC20: burn amount exceeds balance'
      )
    })

    it('Allows an approved spender to burn tokens', async () => {
      const burnAmount = ethers.utils.parseUnits('1000', decimals)
      await dwavesToken.transfer(user.address, burnAmount)
      await userToken.approve(bank.address, burnAmount)

      const burnFrom = dwavesToken.burnFrom(user.address, burnAmount)
      await expect(burnFrom)
        .to.changeTokenBalance(
          dwavesToken,
          user.address,
          ethers.BigNumber.from(`-${burnAmount}`)
        )
        .and.to.emit(dwavesToken, 'Transfer')
        .withArgs(user.address, ethers.constants.AddressZero, burnAmount)
    })

    it('Prevents spender to burn if unapproved', async () => {
      const burnAmount = ethers.utils.parseUnits('1000', decimals)
      const burn = dwavesToken.burnFrom(user.address, burnAmount)
      await expect(burn).to.be.revertedWith('ERC20: insufficient allowance')
    })

    it('Attributes the admin role to bank and allows it to give minter role to batch mint tokens', async () => {
      const _dwavesToken = dwavesToken.connect(deployer)
      const minterRole = await _dwavesToken.MINTER_ROLE()
      await _dwavesToken.grantRole(minterRole, user.address)
      const hasMinterRole = await _dwavesToken.hasRole(minterRole, user.address)
      expect(hasMinterRole).to.be.true

      const mintAmount = ethers.utils.parseUnits('1000', decimals)
      const to_list = [bank.address, user.address]
      const amounts = Array(to_list.length).fill(mintAmount)
      const batchMint = userToken.batchMint(to_list, amounts)

      await expect(batchMint).to.changeTokenBalances(
        _dwavesToken,
        to_list,
        amounts
      )
    })

    it('Prevents batch minting if account does not have the minter role', async () => {
      const minterRole = await dwavesToken.MINTER_ROLE()
      const hasMinterRole = await dwavesToken.hasRole(minterRole, user.address)
      expect(hasMinterRole).to.be.false

      const mintAmount = ethers.utils.parseUnits('1000', decimals)
      const to_list = [bank.address, user.address]
      const amounts = Array(to_list.length).fill(mintAmount)
      const batchMint = userToken.batchMint(to_list, amounts)

      await expect(batchMint).to.be.revertedWith(
        `AccessControl: account ${user.address.toLowerCase()} is missing role ${minterRole}`
      )
    })

    it('Prevents minting if cap is exceeded', async () => {
      const _dwavesToken = dwavesToken.connect(deployer)
      const minterRole = await _dwavesToken.MINTER_ROLE()
      await _dwavesToken.grantRole(minterRole, user.address)
      const hasMinterRole = await _dwavesToken.hasRole(minterRole, user.address)
      expect(hasMinterRole).to.be.true

      const mintAmount = ethers.utils.parseUnits('1000000000', decimals)
      const to_list = [bank.address, user.address]
      const amounts = Array(to_list.length).fill(mintAmount)
      const batchMint = userToken.batchMint(to_list, amounts)

      await expect(batchMint).to.be.revertedWith('ERC20Capped: cap exceeded')
    })
  })
})
