import slugify from 'slugify'
import { Bucket, Storage } from '@google-cloud/storage'
import env from '@config/env.config'
import { IGCSService } from '@interfaces/service.interface'
import crypto from 'crypto'
import { Image } from '@@types/gcs.type'
import { UploadedFile } from 'express-fileupload'

class GCSService implements IGCSService {
  private storage: Storage
  private bucket: Bucket

  constructor() {
    this.storage = new Storage({
      credentials: JSON.parse(env.googleApplicationCredentials),
    })
    this.bucket = this.storage.bucket(env.gcsImageBucketName)
  }

  uploadProfilePicture = (file: UploadedFile, previousFilename: string) => {
    const { trimedFileName, fileExtension } = this._extractFileExtension(
      file.name
    )

    const slug = `${slugify(trimedFileName, {
      lower: true,
    })}-${crypto.randomUUID()}${fileExtension}`

    const bucketFile = this.bucket.file(slug)

    const stream = bucketFile.createWriteStream({
      metadata: { contentType: file.mimetype },
      resumable: false,
    })

    return new Promise<Image>((resolve, reject) =>
      stream
        .on('finish', async () => {
          await bucketFile.makePublic()
          const url = `${bucketFile.storage.apiEndpoint}/${this.bucket.name}/${bucketFile.name}`

          resolve({
            name: file.name,
            slug,
            url,
            mimetype: file.mimetype,
            size: bucketFile.metadata.size,
          })

          if (previousFilename) {
            const filename = previousFilename.split('/').pop()!
            await this.bucket.file(filename).delete()
          }
        })
        .on('error', (error: Error) => reject(error))
        .end(file.data)
    )
  }

  private _extractFileExtension = (filename: string) => {
    const fileExtension = (filename.match(/\.[^/.]+$/) || [])[0]
    const trimedFileName = filename.replace(/\.[^/.]+$/, '')
    return { trimedFileName, fileExtension }
  }
}

const gcsService = new GCSService()

export default gcsService
