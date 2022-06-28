import { Injectable } from "@nestjs/common"
import { google } from "googleapis"

@Injectable()
export class GoogleCloudConfigService {
  getOuth2Client = async () => {
    const oauth2Client = new google.auth.OAuth2({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      redirectUri: process.env.REDIRECT_URI,
    })
    oauth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN })
    return oauth2Client
  }
}
