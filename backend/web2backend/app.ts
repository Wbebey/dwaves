import * as fs from "fs";

const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload');

const app = express()
const port = 3000


app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.json())

import {uploadCoverToIPFS, uploadMusicToIPFS} from './src/routes/postMusicToPinata';

app.get('/', (req: Request, res: Response) => {
    // @ts-ignore
    res.json('Hello World !')
})


app.post('/postMusic', (req: any, res: Response) => {

    if (!req.files) {
        // @ts-ignore
        res.status(400).send({
            status: false,
            message: 'No file uploaded'
        });
    } else {
        let jsonMusic = JSON.parse(req.body.request)
        //console.log(jsonMusic)

        // Use the name of the input field (i.e. "cover") to retrieve the uploaded file
        let cover: any = req.files.cover;
        let coverPinataUrl: any

        //Use the mv() method to place the file in the upload directory (i.e. "uploads")
        cover.mv('./uploads/' + cover.name).then(() => {
            // @ts-ignore
            uploadCoverToIPFS(fs.createReadStream('./uploads/' + cover.name))
                .then((response: any) => {
                    coverPinataUrl = response.pinataURL
                    //console.log(coverPinataUrl)

                    let music: any = req.files.music;
                    music.mv('./uploads/' + music.name).then(() => {
                        // @ts-ignore
                        uploadMusicToIPFS(jsonMusic, coverPinataUrl, fs.createReadStream('./uploads/' + music.name))
                            .then((response: any) => {
                                // @ts-ignore
                                res.status(200).send(response.pinataURL)

                                try {
                                    fs.unlinkSync('./uploads/' + music.name);

                                    console.log("Delete local Music successfully.");
                                } catch (error) {
                                    console.log(error);
                                }

                            })
                            // @ts-ignore
                            .catch(error => res.status(410).json({data: error}));
                    })

                    try {
                        fs.unlinkSync('./uploads/' + cover.name);
                        console.log("Delete local Cover successfully.");
                    } catch (error) {
                        console.log(error);
                    }
                })
                // @ts-ignore
                .catch(error => res.status(410).json({data: error}));
        })


    }

});


app.listen(port, () => console.log(`notre application Node est démarrée sur http://localhost:${port}`))






