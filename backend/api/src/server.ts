<<<<<<< HEAD
import express from 'express'

import env from '@config/env.config'
import appRouter from '@routers/app.router'
import logger from '@config/logger.config'

const { port, appName } = env

const app = express()
app.disable("x-powered-by")

app.use(appRouter)

app.listen(port, () => {
  logger.log(`[${appName}]: ⚡️Server is running at port ${port}`)
=======
import * as fs from "fs";

import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'
import fileUpload from 'express-fileupload'

import {PrismaClient} from './../../db/generated/client'
import {uploadCoverToIPFS, uploadMusicToIPFS} from './routes/postMusicToPinata';
import {uploadMusicNFT, getMusicNFT} from "./routes/uploadMusicNFT";

const prisma = new PrismaClient()

const app = express()
const port = 3000


app.use(fileUpload({
    createParentPath: true
}));
app.use(bodyParser.json())

//import {uploadCoverToIPFS, uploadMusicToIPFS} from './src/routes/postMusicToPinata';

app.get('/', async (req: Request, res: Response) => {
    // @ts-ignore
    const user = await prisma.user.findMany()

    res.json(user)
>>>>>>> chore: refactor api directory & remove web2backend
})

app.get('/uploadNFT', async (req: Request, res: Response) => {

    uploadMusicNFT()

    res.json("tkt tkt")
})

app.get('/getMusicNFT', async (req: Request, res: Response) => {

    getMusicNFT()

    res.json("tkt tkt get")
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






