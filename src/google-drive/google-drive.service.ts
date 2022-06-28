import { Injectable } from "@nestjs/common"
import { google } from "googleapis"
import { GoogleCloudConfigService } from "src/google-cloud-config/google-cloud-config.service"

@Injectable()
export class GoogleDriveService {
  constructor(
    private readonly googleCloudConfigService: GoogleCloudConfigService,
  ) {}

  updateFile = async (fileId: string, file: Express.Multer.File) => {
    const oauth2Client = await this.googleCloudConfigService.getOuth2Client()
    const drive = google.drive({ version: "v3", auth: oauth2Client })
    const requestBody = {
      name: fileId,
      mimeType: "image/jpg",
      parents: [process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID],
    }
    const media = {
      mimeType: "image/jpg",
      body: file,
    }
    const res = await drive.files.update({
      fileId,
      requestBody,
      media,
    })

    console.log(res.data.id)
    return res.data.id
  }

  createFile = async (file: Express.Multer.File) => {
    const oauth2Client = await this.googleCloudConfigService.getOuth2Client()
    const drive = google.drive({ version: "v3", auth: oauth2Client })
    const requestBody = {
      mimeType: "image/jpg",
      parents: [process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID],
    }
    const media = {
      mimeType: "image/jpg",
      body: file,
    }
    const res = await drive.files.create({
      requestBody,
      media,
    })

    console.log(res.data.id)
    return res.data.id
  }

  // getFileId = async (): Promise<string[]> => {
  //   const oauth2Client = await this.googleCloudConfigService.getOuth2Client()
  //   const drive = google.drive({
  //     version: "v3",
  //     auth: oauth2Client,
  //   })
  //   const res = await drive.files.list({
  //     q: `'${process.env.GOOGLE_DRIVE_PARENT_FOLDER_ID}' in parents`,
  //     spaces: "drive",
  //   })

  //   const imageURLs = res.data.files.map((file) =>
  //     this.getPublicViewURL(file.id),
  //   )

  //   drive.files.create({})
  //   return imageURLs
  // }

  // ************ UTILITY METHODS ************ //
  getPublicViewURL = (fileId: string) => {
    return `https://drive.google.com/uc?id=${fileId}`
  }
}
