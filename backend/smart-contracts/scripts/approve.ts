import { ethers } from 'hardhat'

const main = async () => {
  console.log('Getting the dwaves token contract...')
  const tokenAddress = '0xa37BEDDa3271C357eb30F44046f302fbAb651854'
  const nftAddress = '0x4e88d692354240801EAE37C37eBcc0036F75a8d9'
  const userAddress = '0x14d982479c6079521b66276bA21DF4A6C12Edd30'
  const token = await ethers.getContractAt('DwavesToken', tokenAddress)
  const nft = await ethers.getContractAt('DwavesMusicNFT', nftAddress)
  const user = ethers.provider.getSigner(userAddress)

  const token_ = token.connect(user)

  console.log('Approve 535 tokens...')
  const tx = await token_.approve(nftAddress, 535)
  await tx.wait()
  console.log(tx)

  console.log('Allowance...')
  const allowance = await token_.allowance(userAddress, nftAddress)
  console.log(allowance)
}

const cleanup = () => process.exit(0)

const handleError = (e: Error) => {
  console.error(e)
  process.exitCode = 1
}

main().then(cleanup).catch(handleError)
