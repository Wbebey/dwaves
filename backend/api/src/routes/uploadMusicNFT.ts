import NFTMusic from '../../../abi/NFTMusic.json'
import {Alchemy, Network} from 'alchemy-sdk'
import axios from 'axios'
import * as ethers from 'ethers'
import * as dotenv from 'dotenv'

dotenv.config()

async function uploadMusicNFT() {

    const {ALCHEMY_API_KEY, DWAVES_DEPLOYER_PRIVATE_KEY} = process.env

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

    try {
        let transaction = await nFTMusic.createToken("https://gateway.pinata.cloud/ipfs/QmRGRx18NFnPumLDjZaEYj2XRpgdEb4hnKFt1QdbEf6anM")
        await transaction.wait()

        console.log(transaction)
        console.log("Successfully listed your NFT!");


    } catch (e) {
        alert("Upload error" + e)
    }

    console.log("hey hey")
}

async function getMusicNFT() {

    const {ALCHEMY_API_KEY, DWAVES_DEPLOYER_PRIVATE_KEY} = process.env

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

    try {
        let transaction = await nFTMusic.getAllNFTs()

        //console.log('transaction', transaction)

        //Fetch all the details of every NFT from the contract and display
        const items = await Promise.all(transaction.map(async (i: any) => {
            const tokenURI = await nFTMusic.tokenURI(i.tokenId);
            let meta = await axios.get(tokenURI);
            //meta = meta.data;

            let item = {
                tokenId: i.tokenId.toNumber(),
                owner: i.owner,
                meta: meta
            }
            return item;
        }))

        console.log('items', items)
    } catch (e) {
        console.log("Upload error" + e)
    }




    console.log("truc truc get")
}

export {uploadMusicNFT, getMusicNFT}