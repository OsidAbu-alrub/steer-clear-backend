import { Campaign, Invitation, User } from "@prisma/client"
import { HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import {
  CampaignDto,
  CampignModelWithIncludeQuery,
  CreateCampaignDto,
  CreateInvitationDto,
  InvitationDto,
  RetrieveCampaignDto,
} from "./campaign.dto"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { UserDto } from "../User/user.dto"
import { GoogleDriveService } from "src/google-drive/google-drive.service"

@Injectable()
export class CampaignService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  retrieve = async ({
    include,
    ...retrieveCampaignDto
  }: RetrieveCampaignDto = {}): Promise<Array<CampaignDto>> => {
    const retrieveCampaignModel = this.fromRetrieveDto(retrieveCampaignDto)
    const campaigns = await this.prismaService.campaign.findMany({
      where: retrieveCampaignModel,
      include,
    })
    return campaigns.map(this.fromModelWithIncludeQuery)
  }

  retrieveFirst = async ({
    include,
    ...retrieveCampaignDto
  }: RetrieveCampaignDto = {}): Promise<CampaignDto> => {
    const retrieveCampaignModel = this.fromRetrieveDto(retrieveCampaignDto)
    const campaign = await this.prismaService.campaign.findFirst({
      where: retrieveCampaignModel,
      include,
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          "Campaign not found",
          HttpStatus.NOT_FOUND,
        )
      },
    })
    return this.fromModelWithIncludeQuery(campaign)
  }

  create = async (
    createCampaignDto: CreateCampaignDto,
  ): Promise<CampaignDto> => {
    const campaign = await this.prismaService.campaign.create({
      data: this.fromCreateDto(createCampaignDto),
    })
    return this.fromModel(campaign)
  }

  inviteFollowers = async (
    createInvitationDto: CreateInvitationDto,
  ): Promise<number> => {
    const invitationModel = this.fromCreateInvitationDto(createInvitationDto)

    const followers = await this.prismaService.follow.findMany({
      where: {
        followedId: invitationModel.userId,
      },
      select: {
        followerId: true,
      },
    })

    const campaignWithInvitees = await this.prismaService.campaign.findUnique({
      where: {
        id: invitationModel.campaignId,
      },
      include: {
        invitiations: {
          select: {
            userId: true,
          },
        },
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          `Campaign with ID ${invitationModel.campaignId} not created`,
          HttpStatus.NOT_FOUND,
        )
      },
    })

    const setOfInvitees = new Set(
      campaignWithInvitees.invitiations.map(({ userId }) => userId),
    )

    const invitations = followers
      .filter(({ followerId }) => !setOfInvitees.has(followerId))
      .map(({ followerId }) => {
        return {
          userId: followerId,
          campaignId: invitationModel.campaignId,
        }
      })

    const { count: numberOfInvitations } =
      await this.prismaService.invitation.createMany({
        data: invitations,
      })

    return numberOfInvitations
  }

  /************** UTILITY METHODS **************/
  private fromCreateDto = (createCampaignDto: CreateCampaignDto): Campaign => {
    return {
      body: createCampaignDto.body,
      title: createCampaignDto.title,
      userId: createCampaignDto.userId,
      createdOn: new Date(),
      id: undefined,
    }
  }
  private fromRetrieveDto = (
    retrieveCampaignDto: RetrieveCampaignDto,
  ): Campaign => {
    return {
      body: retrieveCampaignDto.body,
      title: retrieveCampaignDto.title,
      userId: retrieveCampaignDto.userId,
      createdOn: retrieveCampaignDto.createdOn,
      id: retrieveCampaignDto.id,
    }
  }
  private fromModel = (campaign: Campaign): CampaignDto => {
    return {
      body: campaign.body,
      title: campaign.title,
      userId: campaign.userId,
      createdOn: campaign.createdOn,
      id: campaign.id,
      invitiations: undefined,
      user: undefined,
    }
  }
  private fromModelWithIncludeQuery = (
    campaignWithIncludQuery: CampignModelWithIncludeQuery,
  ): CampaignDto => {
    return {
      body: campaignWithIncludQuery.body,
      title: campaignWithIncludQuery.title,
      userId: campaignWithIncludQuery.userId,
      createdOn: campaignWithIncludQuery.createdOn,
      id: campaignWithIncludQuery.id,
      invitiations: campaignWithIncludQuery.invitiations
        ? campaignWithIncludQuery.invitiations.map(this.fromInvitationModel)
        : null,
      user: campaignWithIncludQuery.user
        ? this.fromUserModel(campaignWithIncludQuery.user)
        : null,
    }
  }
  // ******** INVITATION UTILITY METHODS ******** //
  private fromCreateInvitationDto = (
    createInvitationDto: CreateInvitationDto,
  ): Invitation => {
    return {
      campaignId: createInvitationDto.campaignId,
      userId: createInvitationDto.inviterId,
      id: undefined,
    }
  }

  private fromInvitationModel = (invitation: Invitation): InvitationDto => {
    return {
      campaignId: invitation.campaignId,
      inviteeId: invitation.userId,
      id: invitation.id,
      campaign: undefined,
      invitee: undefined,
    }
  }

  // ******** USER UTILITY METHODS ******** //
  private fromUserModel = (user: User): UserDto => {
    return {
      id: user.id,
      bio: user.bio,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      phoneNumber: user.phoneNumber,
      image: user.imageId
        ? this.googleDriveService.getPublicViewURL(user.imageId)
        : null,
    }
  }
}
