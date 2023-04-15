import { ethers } from 'hardhat'

import { deploy, writeABI, cleanup, handleError } from '../utils/deployHelpers'
import {
  ArtistPayer,
  ConcertTicketNFT,
  DwavesToken,
  ICO,
} from '../typechain-types'

const main = async () => {
  const [deployer, payer, bank] = await ethers.getSigners()

  console.log(`👷 Deployer address: ${deployer.address}`)
  console.time('🚀 Deployment time')

  const tokenName = 'DwavesToken'
  const dwavesToken = (await deploy(
    tokenName,
    deployer,
    bank.address
  )) as DwavesToken
  await dwavesToken.deployed()

  const payerName = 'ArtistPayer'
  const artistPayer = (await deploy(
    payerName,
    deployer,
    dwavesToken.address
  )) as ArtistPayer
  await artistPayer.deployed()

  const concertName = 'ConcertTicketNFT'
  const concertTicketNFT = (await deploy(
    concertName,
    deployer,
    dwavesToken.address
  )) as ConcertTicketNFT
  await concertTicketNFT.deployed()

  const now = new Date()
  const openingDate = new Date(
    new Date(now.getTime()).setDate(now.getDate() + 1)
  )
  const closingDate = new Date(
    new Date(now.getTime()).setMonth(now.getMonth() + 3)
  )

  const icoName = 'ICO'
  const ico = (await deploy(
    icoName,
    deployer,
    dwavesToken.address,
    bank.address,
    Math.floor(openingDate.getTime() / 1000),
    Math.floor(closingDate.getTime() / 1000)
  )) as ICO
  await ico.deployed()

  const [MINTER_ROLE, PAYER_ROLE] = await Promise.all([
    dwavesToken.MINTER_ROLE(),
    artistPayer.PAYER_ROLE(),
  ])
  console.log('👑 Granting roles...')
  await dwavesToken.grantRole(MINTER_ROLE, artistPayer.address)
  await artistPayer.grantRole(PAYER_ROLE, payer.address)
  await concertTicketNFT.grantRole(MINTER_ROLE, payer.address)

  await Promise.all([
    writeABI(dwavesToken, tokenName),
    writeABI(artistPayer, payerName),
    writeABI(ico, icoName),
    writeABI(concertTicketNFT, concertName),
  ])

  console.log('😎 DONE')
  console.timeEnd('🚀 Deployment time')
}

main().then(cleanup).catch(handleError)
