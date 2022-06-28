import { Injectable } from "@nestjs/common"
import { google } from "googleapis"
import { GoogleCloudConfigService } from "src/google-cloud-config/google-cloud-config.service"
import { Readable } from "stream"

@Injectable()
export class GoogleDriveService {
  constructor(
    private readonly googleCloudConfigService: GoogleCloudConfigService,
  ) {}

  updateFile = async (file: Express.Multer.File, fileId: string) => {
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
      addParents: `${process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID}`,
    })
    return res.data.id
  }

  createFile = async (file: Express.Multer.File) => {
    const oauth2Client = await this.googleCloudConfigService.getOuth2Client()
    const drive = google.drive({ version: "v3", auth: oauth2Client })
    const fileAsReadableStream = Readable.from(file.buffer)

    const requestBody = {
      name: this.getFileName(file),
      mimeType: "image/jpeg",
      parents: [process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID],
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

  getFileId = async (): Promise<void> => {
    const oauth2Client = await this.googleCloudConfigService.getOuth2Client()
    const drive = google.drive({
      version: "v3",
      auth: oauth2Client,
    })
    const res = await drive.files.list({
      q: `'${process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID}' in parents`,
      spaces: "drive",
    })

    const imageURLs = res.data.files.find(
      (file) => file.id === "19278nm5PZaPiJE_WBKljd0qEps4ZPCt-",
    )
    console.log(imageURLs)
    // return imageURLs
  }

  getPublicViewURL = (fileId: string) => {
    return `https://drive.google.com/uc?id=${fileId}`
  }

  // ************ UTILITY METHODS ************ //
  private getFileName = (file: Express.Multer.File) =>
    `IMG_${new Date().toISOString()}_${file.originalname}`
}
