import { ethers } from 'hardhat'

const main = async () => {
  const tokenName = 'Dwaves'
  const [contractOwner] = await ethers.getSigners()

  console.log(`Deploying contract from ${contractOwner.address}`)

  const Token = await ethers.getContractFactory(`${tokenName}Token`)

  console.log(`Deploying ${tokenName}Token...`)

  const token = await Token.deploy()
  await token.deployed()

  console.log(`${tokenName}Token deployed to: ${token.address}`)
}

const cleanup = () => process.exit(0)

const handleError = (e: Error) => {
  console.error(e)
  process.exitCode = 1
}

main().then(cleanup).catch(handleError)
