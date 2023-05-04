import { ethers } from 'hardhat'
import { promises as fs } from 'fs'
import { Contract } from 'ethers'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'

export const deploy = async (
  contractName: string,
  deployer: SignerWithAddress,
  ...args: any[]
): Promise<Contract> => {
  console.log(`🚀 Deploying ${contractName}...`)

  const factory = await ethers.getContractFactory(contractName, deployer)
  const contract = await factory.deploy(...args)
  await contract.deployed()

  console.log(
    `✅ ${contractName} contract successfully deployed to: ${contract.address}`
  )

  return contract
}

export const writeABI = async (
  contract: Contract,
  filename: string
): Promise<void> => {
  console.log(`🖋️ Writing ${filename} ABI...`)

  const data = {
    address: contract.address,
    abi: JSON.parse(contract.interface.format('json') as string),
  }
  await fs.writeFile(`../api/src/abi/${filename}.json`, JSON.stringify(data))
}

export const cleanup = () => process.exit(0)

export const handleError = (e: Error) => {
  console.error(e)
  process.exitCode = 1
}
