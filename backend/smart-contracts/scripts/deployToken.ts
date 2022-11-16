import { ethers } from 'hardhat'

import { deploy, writeABI, cleanup, handleError } from '../utils/deployHelpers'
import { ArtistPayer, DwavesToken } from '../typechain-types'

const main = async () => {
  const [deployer, payer, bank] = await ethers.getSigners()

  console.log(`👷 Deployer address: ${deployer.address}`)

  const tokenName = 'DwavesToken'
  const dwavesToken = (await deploy(
    tokenName,
    deployer,
    bank.address
  )) as DwavesToken
  const payerName = 'ArtistPayer'
  const artistPayer = (await deploy(
    payerName,
    deployer,
    dwavesToken.address
  )) as ArtistPayer

  const [MINTER_ROLE, PAYER_ROLE] = await Promise.all([
    dwavesToken.MINTER_ROLE(),
    artistPayer.PAYER_ROLE(),
  ])
  await Promise.all([
    dwavesToken.grantRole(MINTER_ROLE, artistPayer.address),
    artistPayer.grantRole(PAYER_ROLE, payer.address),
  ])

  await Promise.all([
    writeABI(dwavesToken, tokenName),
    writeABI(artistPayer, payerName),
  ])

  console.log('😎 DONE')
}

main().then(cleanup).catch(handleError)
