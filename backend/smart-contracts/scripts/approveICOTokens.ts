import { ethers } from 'hardhat'

const main = async () => {
  console.log('Getting the dwaves token contract...')
  const dwavesTokenAddress = '0xa37BEDDa3271C357eb30F44046f302fbAb651854'
  const icoAddress = '0x171c48422E546BB677c312B6Ce59febf45b71753'
  const dwavesToken = await ethers.getContractAt(
    'DwavesToken',
    dwavesTokenAddress
  )
  const ico = await ethers.getContractAt('ICO', icoAddress)

  console.log('Querying token name...')
  const name = await dwavesToken.name()
  console.log(`Token Name: ${name}\n`)

  console.log('Querying token symbol...')
  const symbol = await dwavesToken.symbol()
  console.log(`Token Symbol: ${symbol}\n`)

  console.log('Querying decimals...')
  const decimals = await dwavesToken.decimals()
  console.log(`Token Decimals: ${decimals}\n`)

  const [_, __, dwavesBank] = await ethers.getSigners()

  console.log('Getting the balance of contract dwavesBank...')
  const dwavesBankAddress = dwavesBank.address
  let dwavesBankBalance = await dwavesToken.balanceOf(dwavesBankAddress)
  console.log(
    `Contract dwavesBank at ${dwavesBankAddress} has a ${symbol} balance of ${ethers.utils.formatUnits(
      dwavesBankBalance,
      decimals
    )}\n`
  )

  console.log('Approving tokens for ICO...')
  const approveAmount = await ico.cap()
  console.log(
    `Approving ${ethers.utils.formatUnits(
      approveAmount,
      decimals
    )} ${symbol} tokens to ${icoAddress} from ${dwavesBankAddress}`
  )

  const tx = await dwavesToken
    .connect(dwavesBank)
    .approve(icoAddress, approveAmount.toString())

  await tx.wait()

  console.log('Approval completed')

  const allowance = await dwavesToken.allowance(dwavesBankAddress, icoAddress)
  console.log(
    `Allowance of dwavesBank (${dwavesBankAddress}) to ico (${icoAddress}): ${ethers.utils.formatUnits(
      allowance,
      decimals
    )}`
  )

  const remainingTokens = await ico.remainingTokens()
  console.log(
    `Remaining tokens for ico (${icoAddress}): ${ethers.utils.formatUnits(
      remainingTokens,
      decimals
    )}`
  )
}

const cleanup = () => process.exit(0)

const handleError = (e: Error) => {
  console.error(e)
  process.exitCode = 1
}

main().then(cleanup).catch(handleError)
