import NFTMusic from '../../../abi/NFTMusic.json'
import { Alchemy, Network } from 'alchemy-sdk'
import * as ethers from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

async function uploadMusicNFT() {

    const { ALCHEMY_API_KEY, DWAVES_DEPLOYER_PRIVATE_KEY } = process.env

    if (!DWAVES_DEPLOYER_PRIVATE_KEY || !ALCHEMY_API_KEY) {
        console.error('💥 error loading env')
        process.exit(1)
    }

    const settings = {
        apiKey: ALCHEMY_API_KEY,
        network: Network.ETH_GOERLI,
    }

    const alchemy = new Alchemy(settings)
    const alchemyProvider = await alchemy.config.getProvider()

    const signer = new ethers.Wallet(
        DWAVES_DEPLOYER_PRIVATE_KEY as string,
        alchemyProvider
    )

    const nFTMusic = new ethers.Contract(
        NFTMusic.address,
        NFTMusic.abi,
        signer
    )

    let truc

    // await nFTMusic.inc().then(async () => {
    //     truc = await nFTMusic.get()
    // })
    //
    //
    // console.log(truc)

    try {
        let transaction = await nFTMusic.createToken("https://gateway.pinata.cloud/ipfs/QmZncoAxVsjfWvcrQFwwCKdwY2txBEUNkWu81oyaRxyKUd")
        await transaction.wait()

        console.log(transaction)
        console.log("Successfully listed your NFT!");


    } catch (e) {
        alert( "Upload error"+e )
    }

    console.log("hey hey")
}

export {uploadMusicNFT}