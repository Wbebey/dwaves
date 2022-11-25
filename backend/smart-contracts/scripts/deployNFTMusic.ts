import { ethers } from 'hardhat'
const hre = require("hardhat");
const fs = require("fs");

async function main() {
    const [deployer] = await ethers.getSigners();
    const balance = await deployer.getBalance();
    const Music = await hre.ethers.getContractFactory("NFTMusic");
    const music = await Music.deploy();

    await music.deployed();

    const data = {
        address: music.address,
        abi: JSON.parse(music.interface.format('json'))
    }

    // Writes the ABI and address to the Marketplace.json
    fs.writeFileSync('./../abi/NFTMusic2.json', JSON.stringify(data))
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
