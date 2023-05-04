import { ethers } from 'hardhat'

const main = async () => {
  console.log('Getting the dwaves token contract...')
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  const token = await ethers.getContractAt('DwavesToken', contractAddress)

  console.log('Querying token name...')
  const name = await token.name()
  console.log(`Token Name: ${name}\n`)

  console.log('Querying token symbol...')
  const symbol = await token.symbol()
  console.log(`Token Symbol: ${symbol}\n`)

  console.log('Querying decimals...')
  const decimals = await token.decimals()
  console.log(`Token Decimals: ${decimals}\n`)

  console.log('Querying token supply...')
  const totalSupply = await token.totalSupply()
  console.log(`Total Supply including all decimals: ${totalSupply}`)
  console.log(`Total supply including all decimals comma separated: ${ethers.utils.commify(totalSupply.toString())}`)
  console.log(`Total Supply in ${symbol}: ${ethers.utils.formatUnits(totalSupply, decimals)}\n`)

  console.log('Getting the balance of contract owner...')
  const signers = await ethers.getSigners()
  const ownerAddress = signers[0].address
  let ownerBalance = await token.balanceOf(ownerAddress)
  console.log(
    `Contract owner at ${ownerAddress} has a ${symbol} balance of ${ethers.utils.formatUnits(ownerBalance, decimals)}\n`
  )

  console.log('Initiating a transfer...')
  const recipientAddress = signers[1].address
  const transferAmount = 100_000
  console.log(`Transferring ${transferAmount} ${symbol} tokens to ${recipientAddress} from ${ownerAddress}`)
  await token.transfer(recipientAddress, ethers.utils.parseUnits(transferAmount.toString(), decimals))
  console.log('Transfer completed')
  ownerBalance = await token.balanceOf(ownerAddress)
  console.log(`Balance of owner (${ownerAddress}): ${ethers.utils.formatUnits(ownerBalance, decimals)} ${symbol}`)
  let recipientBalance = await token.balanceOf(recipientAddress)
  console.log(
    `Balance of recipient (${recipientAddress}): ${ethers.utils.formatUnits(recipientBalance, decimals)} ${symbol}\n`
  )

  console.log(`Setting allowance amount of spender over the caller\'s ${symbol} tokens...`)
  const approveAmount = 10_000
  console.log(
    `This example allows the contractOwner to spend up to ${approveAmount} of the recipient\'s ${symbol} token`
  )
  const signerContract = token.connect(signers[1]) // Creates a new instance of the contract connected to the recipient
  await signerContract.approve(ownerAddress, ethers.utils.parseUnits(approveAmount.toString(), decimals))
  console.log(`Spending approved\n`)

  console.log(`Getting the contracOwner spending allowance over recipient\'s ${symbol} tokens...`)
  let allowance = await token.allowance(recipientAddress, ownerAddress)
  console.log(`contractOwner Allowance: ${ethers.utils.formatUnits(allowance, decimals)} ${symbol}\n`)

  const transferFromAmount = 100
  console.log(`contracOwner transfers ${transferFromAmount} ${symbol} from recipient\'s account into own account...`)
  await token.transferFrom(
    recipientAddress,
    ownerAddress,
    ethers.utils.parseUnits(transferFromAmount.toString(), decimals)
  )
  ownerBalance = await token.balanceOf(ownerAddress)
  console.log(`New owner balance (${ownerAddress}): ${ethers.utils.formatUnits(ownerBalance, decimals)} ${symbol}`)
  recipientBalance = await token.balanceOf(recipientAddress)
  console.log(
    `New recipient balance (${recipientAddress}): ${ethers.utils.formatUnits(recipientBalance, decimals)} ${symbol}`
  )
  allowance = await token.allowance(recipientAddress, ownerAddress)
  console.log(`Remaining allowance: ${ethers.utils.formatUnits(allowance, decimals)} ${symbol}\n`)

  const incrementAmount = 100
  console.log(`Incrementing contractOwner allowance by ${incrementAmount} ${symbol}...`)
  await signerContract.increaseAllowance(ownerAddress, ethers.utils.parseUnits(incrementAmount.toString(), decimals))
  allowance = await token.allowance(recipientAddress, ownerAddress)
  console.log(`Updated allowance: ${ethers.utils.formatUnits(allowance, decimals)} ${symbol}\n`)

  const subtractAmount = 100
  console.log(`Subtracting contractOwner allowance by ${subtractAmount} ${symbol}...`)
  await signerContract.decreaseAllowance(ownerAddress, ethers.utils.parseUnits(subtractAmount.toString(), decimals))
  allowance = await token.allowance(recipientAddress, ownerAddress)
  console.log(`Updated allowance: ${ethers.utils.formatUnits(allowance, decimals)} ${symbol}\n`)
}

const cleanup = () => process.exit(0)

const handleError = (e: Error) => {
  console.error(e)
  process.exitCode = 1
}

main().then(cleanup).catch(handleError)
