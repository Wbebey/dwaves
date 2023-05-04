import { ethers } from 'hardhat'
import { promises as fs } from 'fs'
import { Contract } from 'ethers'

const main = async () => {
  const [contractOwner] = await ethers.getSigners()
  console.log(`Deploying from ${contractOwner.address}`)

  const tokenName = 'DwavesToken'
  const token = await deploy(tokenName)
  const payerName = 'ArtistPayer'
  const payer = await deploy(payerName, token.address)

  console.log('Generating abis...')
  await Promise.all([writeABI(token, tokenName), writeABI(payer, payerName)])

  console.log('DONE')
}

const deploy = async (
  contractName: string,
  ...args: any[]
): Promise<Contract> => {
  const factory = await ethers.getContractFactory(contractName)
  const contract = await factory.deploy(...args)
  await contract.deployed()

  console.log(
    `${contractName} contract successfully deployed to: ${contract.address}`
  )

  return contract
}

const writeABI = async (
  contract: Contract,
  filename: string
): Promise<void> => {
  const data = {
    address: contract.address,
    abi: JSON.parse(contract.interface.format('json') as string),
  }
  await fs.writeFile(`../abi/${filename}.json`, JSON.stringify(data))
}

const cleanup = () => process.exit(0)

const handleError = (e: Error) => {
  console.error(e)
  process.exitCode = 1
}

main().then(cleanup).catch(handleError)
