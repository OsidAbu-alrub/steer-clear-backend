import { Body, Controller, HttpStatus, Post, UseGuards } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { JwtAuthGuard } from "src/jwt/jwt.guard"
import {
  CampaignDto,
  CreateCampaignDto,
  CreateInvitationDto,
  RetrieveCampaignDto,
} from "./campaign.dto"
import { CampaignService } from "./campaign.service"

@UseGuards(JwtAuthGuard)
@ApiTags("Campaign")
@Controller("campaign")
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  /**
   * Get Campaign objects from database
   * @param retrieveCampaignDto - object that the retrieval query is based on
   * @returns arrayOfCampaigns - Get Campaign objects from the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Campaign retrieved successfully",
  })
  @Post("retrieve")
  async retrieve(
    @Body() retrieveCampaignDto: RetrieveCampaignDto,
  ): AsyncBaseResponse<Array<CampaignDto>> {
    const arrayOfCampaigns = await this.campaignService.retrieve(
      retrieveCampaignDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: arrayOfCampaigns,
    }
  }

  /**
   * Get first Campaign object from database
   * @param retrieveCampaignDto - object that the retrieval query is based on
   * @returns Campaign - Get first Campaign object from the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Campaign retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Campaign not found",
  })
  @Post("retrieve-first")
  async retrieveFirst(
    @Body() retrieveCampaignDto: RetrieveCampaignDto,
  ): AsyncBaseResponse<CampaignDto> {
    const campaign = await this.campaignService.retrieveFirst(
      retrieveCampaignDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: campaign,
    }
  }

  /**
   * creates a Campaign and stores it in the database
   *
   * @param createCampaignDto - Campaign to be created
   * @returns createdCampaign - the CampaignDto object that was created
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Campaign created successfully",
  })
  @Post("create")
  async create(
    @Body() createCampaignDto: CreateCampaignDto,
  ): AsyncBaseResponse<CampaignDto> {
    const createdCampaign = await this.campaignService.create(createCampaignDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: createdCampaign,
    }
  }

  /**
   * Creates invitations for followers of a user
   *
   * @param createInvitationDto - Campaign ID with the user ID
   * @returns numberOfInvitations - number of invitations
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Campaign created successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Campaign not found",
  })
  @Post("invite-followers")
  async inviteFollowers(
    @Body() createInvitationDto: CreateInvitationDto,
  ): AsyncBaseResponse<number> {
    const numberOfInvitations = await this.campaignService.inviteFollowers(
      createInvitationDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: numberOfInvitations,
    }
  }
}
