import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { DwavesToken, DwavesToken__factory } from '../typechain-types'

describe('DwavesToken', () => {
  let dwavesTokenFactory: DwavesToken__factory
  let dwavesToken: DwavesToken
  let recipientContract: DwavesToken
  let decimals: number
  let ownerAddress: string
  let recipientAddress: string
  let recipient: SignerWithAddress

  before(async () => {
    const [owner, spender] = await ethers.getSigners()
    recipient = spender
    ownerAddress = owner.address
    recipientAddress = spender.address

    dwavesTokenFactory = await ethers.getContractFactory('DwavesToken', owner)
  })

  describe('When deploying the contract', () => {
    beforeEach(async () => {
      dwavesToken = await dwavesTokenFactory.deploy()
      await dwavesToken.deployed()

      decimals = await dwavesToken.decimals()
      recipientContract = dwavesToken.connect(recipient)
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
      const expectedSupply = ethers.utils.parseUnits('300000000', decimals)
      const tokenSupply = (await dwavesToken.totalSupply()).toString()
      expect(tokenSupply).to.equal(expectedSupply)
    })

    it('Is able to query account balances', async () => {
      const expectedBalance = ethers.utils.parseUnits('300000000', decimals)
      const ownerBalance = await dwavesToken.balanceOf(ownerAddress)
      expect(ownerBalance).to.equal(expectedBalance)
    })

    it('Transfers the right amount of tokens to/from an account', async () => {
      const transferAmount = 1_000
      const transfer = dwavesToken.transfer(recipientAddress, transferAmount)
      await expect(transfer).to.changeTokenBalances(
        dwavesToken,
        [ownerAddress, recipientAddress],
        [-transferAmount, transferAmount]
      )
    })

    it("Emits a 'Transfer' event with the right arguments", async () => {
      const transferAmount = ethers.utils.parseUnits('100000', decimals)
      const transfer = dwavesToken.transfer(recipientAddress, transferAmount)
      await expect(transfer)
        .to.emit(dwavesToken, 'Transfer')
        .withArgs(ownerAddress, recipientAddress, transferAmount)
    })

    it('Allows for allowance approvals and queries', async () => {
      const approveAmount = ethers.utils.parseUnits('10000', decimals)
      await recipientContract.approve(ownerAddress, approveAmount)

      const allowance = await dwavesToken.allowance(
        recipientAddress,
        ownerAddress
      )
      expect(allowance).to.equal(approveAmount)
    })

    it("Emits an 'Approval' event with the right arguments", async () => {
      const approveAmount = ethers.utils.parseUnits('10000', decimals)
      const approval = recipientContract.approve(ownerAddress, approveAmount)
      await expect(approval)
        .to.emit(dwavesToken, 'Approval')
        .withArgs(recipientAddress, ownerAddress, approveAmount)
    })

    it('Allows an approved spender to transfer from owner', async () => {
      const rawTransferAmount = 10_000
      const transferAmount = ethers.utils.parseUnits(
        rawTransferAmount.toString(),
        decimals
      )
      await dwavesToken.transfer(recipientAddress, transferAmount)
      await recipientContract.approve(ownerAddress, transferAmount)

      const transferFrom = dwavesToken.transferFrom(
        recipientAddress,
        ownerAddress,
        rawTransferAmount
      )
      await expect(transferFrom).to.changeTokenBalances(
        dwavesToken,
        [ownerAddress, recipientAddress],
        [rawTransferAmount, -rawTransferAmount]
      )
    })

    it("Emits a 'Transfer' event with the right arguments when conducting an approved transfer", async () => {
      const transferAmount = ethers.utils.parseUnits('10000', decimals)
      await dwavesToken.transfer(recipientAddress, transferAmount)
      await recipientContract.approve(ownerAddress, transferAmount)

      const transferFrom = dwavesToken.transferFrom(
        recipientAddress,
        ownerAddress,
        transferAmount
      )
      await expect(transferFrom)
        .to.emit(dwavesToken, 'Transfer')
        .withArgs(recipientAddress, ownerAddress, transferAmount)
    })

    it('Allows allowance to be increased and queried', async () => {
      const initialAmount = ethers.utils.parseUnits('100', decimals)
      const incrementAmount = ethers.utils.parseUnits('10000', decimals)

      await recipientContract.approve(ownerAddress, initialAmount)
      const previousAllowance = await dwavesToken.allowance(
        recipientAddress,
        ownerAddress
      )
      await recipientContract.increaseAllowance(ownerAddress, incrementAmount)
      const expectedAllowance = ethers.BigNumber.from(previousAllowance).add(
        ethers.BigNumber.from(incrementAmount)
      )

      const allowance = await dwavesToken.allowance(
        recipientAddress,
        ownerAddress
      )
      expect(allowance).to.equal(expectedAllowance)
    })

    it("Emits 'Approval' event when alllowance is increased", async () => {
      const incrementAmount = ethers.utils.parseUnits('10000', decimals)
      const allowanceIncrease = recipientContract.increaseAllowance(
        ownerAddress,
        incrementAmount
      )
      await expect(allowanceIncrease)
        .to.emit(dwavesToken, 'Approval')
        .withArgs(recipientAddress, ownerAddress, incrementAmount)
    })

    it('Allows allowance to be decreased and queried', async () => {
      const initialAmount = ethers.utils.parseUnits('100', decimals)
      const decrementAmount = ethers.utils.parseUnits('10', decimals)

      await recipientContract.approve(ownerAddress, initialAmount)
      const previousAllowance = await dwavesToken.allowance(
        recipientAddress,
        ownerAddress
      )
      await recipientContract.decreaseAllowance(ownerAddress, decrementAmount)
      const expectedAllowance = ethers.BigNumber.from(previousAllowance).sub(
        ethers.BigNumber.from(decrementAmount)
      )

      const allowance = await dwavesToken.allowance(
        recipientAddress,
        ownerAddress
      )
      expect(allowance).to.equal(expectedAllowance)
    })

    it("Emits 'Approval' event when alllowance is decreased", async () => {
      const initialAmount = ethers.utils.parseUnits('100', decimals)
      const decrementAmount = ethers.utils.parseUnits('10', decimals)

      await recipientContract.approve(ownerAddress, initialAmount)
      const expectedAllowance = ethers.BigNumber.from(initialAmount).sub(
        ethers.BigNumber.from(decrementAmount)
      )

      const allowanceDecrease = recipientContract.decreaseAllowance(
        ownerAddress,
        decrementAmount
      )
      await expect(allowanceDecrease)
        .to.emit(dwavesToken, 'Approval')
        .withArgs(recipientAddress, ownerAddress, expectedAllowance)
    })

    it('Allows burning own tokens', async () => {
      const burnAmount = ethers.utils.parseUnits('1000', decimals)
      const burn = dwavesToken.burn(burnAmount)
      await expect(burn)
        .to.changeTokenBalance(
          dwavesToken,
          ownerAddress,
          ethers.BigNumber.from(`-${burnAmount}`)
        )
        .and.to.emit(dwavesToken, 'Transfer')
        .withArgs(ownerAddress, ethers.constants.AddressZero, burnAmount)
    })

    it('Prevents burning if insufficient funds', async () => {
      const excessBurnAmount = ethers.utils.parseUnits('400000000', decimals)
      const exceedsBalanceBurn = dwavesToken.burn(excessBurnAmount)
      await expect(exceedsBalanceBurn).to.be.revertedWith(
        'ERC20: burn amount exceeds balance'
      )
    })

    it('Allows an approved spender to burn tokens', async () => {
      const burnAmount = ethers.utils.parseUnits('1000', decimals)
      await dwavesToken.transfer(recipientAddress, burnAmount)
      await recipientContract.approve(ownerAddress, burnAmount)

      const burnFrom = dwavesToken.burnFrom(recipientAddress, burnAmount)
      await expect(burnFrom)
        .to.changeTokenBalance(
          dwavesToken,
          recipientAddress,
          ethers.BigNumber.from(`-${burnAmount}`)
        )
        .and.to.emit(dwavesToken, 'Transfer')
        .withArgs(recipientAddress, ethers.constants.AddressZero, burnAmount)
    })

    it('Prevents spender to burn if unapproved', async () => {
      const burnAmount = ethers.utils.parseUnits('1000', decimals)
      const burn = dwavesToken.burnFrom(recipientAddress, burnAmount)
      await expect(burn).to.be.revertedWith('ERC20: insufficient allowance')
    })

    it('Attributes the admin role to deployer and allows it to give minter role to batch mint tokens', async () => {
      const minterRole = await dwavesToken.MINTER_ROLE()
      await dwavesToken.grantRole(minterRole, recipientAddress)
      const recipientHasMinterRole = await dwavesToken.hasRole(
        minterRole,
        recipientAddress
      )
      expect(recipientHasMinterRole).to.be.true

      const mintAmount = ethers.utils.parseUnits('1000', decimals)
      const to_list = [ownerAddress, recipientAddress]
      const amounts = Array(to_list.length).fill(mintAmount)
      const batchMint = recipientContract.batchMint(to_list, amounts)

      await expect(batchMint).to.changeTokenBalances(
        dwavesToken,
        to_list,
        amounts
      )
    })

    it('Prevents minting if address does not have the minter role', async () => {
      const minterRole = await dwavesToken.MINTER_ROLE()
      const recipientHasMinterRole = await dwavesToken.hasRole(
        minterRole,
        recipientAddress
      )
      expect(recipientHasMinterRole).to.be.false

      const mintAmount = ethers.utils.parseUnits('1000', decimals)
      const to_list = [ownerAddress, recipientAddress]
      const amounts = Array(to_list.length).fill(mintAmount)
      const batchMint = recipientContract.batchMint(to_list, amounts)

      await expect(batchMint).to.be.revertedWith('Caller is not a minter')
    })
  })
})
