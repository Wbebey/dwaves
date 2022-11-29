import { ethers } from 'hardhat'

import { deploy, writeABI, cleanup, handleError } from '../utils/deployHelpers'
import { DwavesMusicNFT } from '../typechain-types'

const main = async () => {
  const [deployer, payer] = await ethers.getSigners()

  console.log(`👷 Deployer address: ${deployer.address}`)

  const contractName = 'DwavesMusicNFT'
  const dwavesMusicNFT = (await deploy(
    contractName,
    deployer
  )) as DwavesMusicNFT

  const MINTER_ROLE = dwavesMusicNFT.MINTER_ROLE()
  await dwavesMusicNFT.grantRole(MINTER_ROLE, payer.address)

  await writeABI(dwavesMusicNFT, contractName)

  console.log('😎 DONE')
}

main().then(cleanup).catch(handleError)
