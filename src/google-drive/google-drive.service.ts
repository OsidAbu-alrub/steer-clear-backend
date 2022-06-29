import { Injectable } from "@nestjs/common"
import { google } from "googleapis"
import { GoogleCloudConfigService } from "src/google-cloud-config/google-cloud-config.service"
import { Readable } from "stream"
import { PictureType } from "./google-drive.type"

@Injectable()
export class GoogleDriveService {
  constructor(
    private readonly googleCloudConfigService: GoogleCloudConfigService,
  ) {}

  updateFile = async (
    file: Express.Multer.File,
    fileId: string,
    pictureType: PictureType,
  ) => {
    const oauth2Client = await this.googleCloudConfigService.getOuth2Client()
    const drive = google.drive({ version: "v3", auth: oauth2Client })

    const fileAsReadableStream = Readable.from(file.buffer)
    const requestBody = {
      name: this.getFileName(file),
      mimeType: "image/jpeg",
    }
    const media = {
      mimeType: "image/jpeg",
      body: fileAsReadableStream,
    }
    const res = await drive.files.update({
      fileId,
      requestBody,
      media,
      addParents: `${this.getParentFolderId(pictureType)}`,
    })
    return res.data.id
  }

  createFile = async (file: Express.Multer.File, pictureType: PictureType) => {
    const oauth2Client = await this.googleCloudConfigService.getOuth2Client()
    const drive = google.drive({ version: "v3", auth: oauth2Client })
    const fileAsReadableStream = Readable.from(file.buffer)

    console.log(this.getParentFolderId(pictureType))

    const requestBody = {
      name: this.getFileName(file),
      mimeType: "image/jpeg",
      parents: [this.getParentFolderId(pictureType)],
    }
    const media = {
      mimeType: "image/jpeg",
      body: fileAsReadableStream,
    }
    const res = await drive.files.create({
      requestBody,
      media,
    })

    return res.data.id
  }

  getPublicViewURL = (fileId: string) => {
    return `https://drive.google.com/uc?id=${fileId}`
  }

  // ************ UTILITY METHODS ************ //
  private getFileName = (file: Express.Multer.File) =>
    `IMG_${new Date().toISOString()}_${file.originalname}`

  private getParentFolderId = (parentType: PictureType) => {
    if (parentType === "user_image")
      return process.env.GOOGLE_DRIVE_USER_IMAGES_PARENT_FOLDER_ID
    if (parentType === "product_image")
      return process.env.GOOGLE_DRIVE_PRODUCT_IMAGES_PARENT_FOLDER_ID
  }
}
