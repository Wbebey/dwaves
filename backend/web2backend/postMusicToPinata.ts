const axios = require('axios');
const fs = require('fs');
// @ts-ignore
const FormData = require('form-data');

require('dotenv').config();
const key = process.env.REACT_APP_PINATA_KEY;
const secret = process.env.REACT_APP_PINATA_SECRET;


function uploadCoverToIPFS(coverFile) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata ⬇️
    let data = new FormData();
    data.append('file', coverFile);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    return axios.post(url, data, {
        maxBodyLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data`,
            pinata_api_key: key,
            pinata_secret_api_key: secret,
        }
    }).then(function (response) {
        console.log("image uploaded", response.data.IpfsHash)
        return {
            success: true,
            pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        };
    }).catch(function (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        }
    });

}

function uploadMusicToIPFS(musicJson) {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    //making axios POST request to Pinata ⬇️
    let data = new FormData();
    data.append('file', musicJson.music);

    const metadata = JSON.stringify({
        keyvalues: {
            artist: musicJson.artist,
            album: musicJson.album,
            genre: musicJson.genre,
            cover: musicJson.cover,
            listenings: 21990
        }
    });
    data.append('pinataMetadata', metadata);

    //pinataOptions are optional
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
        customPinPolicy: {
            regions: [
                {
                    id: 'FRA1',
                    desiredReplicationCount: 1
                },
                {
                    id: 'NYC1',
                    desiredReplicationCount: 2
                }
            ]
        }
    });
    data.append('pinataOptions', pinataOptions);

    return axios.post(url, data, {
        maxBodyLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data`,
            pinata_api_key: key,
            pinata_secret_api_key: secret,
        }
    }).then(function (response) {
        console.log("image uploaded", response.data.IpfsHash)
        return {
            success: true,
            pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        };
    }).catch(function (error) {
        console.log(error)
        return {
            success: false,
            message: error.message,
        }
    });

}



async function uploadMusicWithMetadataToIPFS() {
    try {
        //upload the metadata JSON to IPFS
        const response = await uploadCoverToIPFS(coverFile);
        if (response.success === true) {
            console.log("Uploaded File to Pinata: ", response)
            musicJson.cover = response.pinataURL;

            try {
                //upload the metadata JSON to IPFS
                const response = await uploadMusicToIPFS(musicJson);
                if (response.success === true) {
                    console.log("Uploaded JSON to Pinata: ", response)
                    return response.pinataURL;
                }
            } catch (e) {
                console.log("error uploading JSON metadata:", e)
            }
        }
    } catch (e) {
        console.log("Error during file upload", e);
    }
}


const musicFile = fs.createReadStream('/Users/tharick/Desktop/MSc2/Dwaves/SPYxFAMILYOP1.mp3')
const coverFile = fs.createReadStream('/Users/tharick/Desktop/MSc2/Dwaves/SPYxFAMILYOP1Cover.png')

let musicJson = {
    title: "SPY x FAMILY OP1",
    artist: "Official Hige Dandism",
    album: "SPY x FAMILY",
    cover: "tkt tkt",
    genre: "j-pop",
    music: musicFile
}

uploadMusicWithMetadataToIPFS()
    .then(res => console.log(res))
    .catch(error => console.log(error.message));

