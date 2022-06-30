import { ApiProperty, PartialType } from "@nestjs/swagger"
import { Invitation, User } from "@prisma/client"
import {
  IsDefined,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from "class-validator"
import { UserDto } from "../User/user.dto"

// use this to get joined
// tables data
type CampaignIncludeQuery = {
  user: boolean
  invitations: boolean
}

export class InvitationDto {
  @ApiProperty()
  id: string
  @ApiProperty()
  inviteeId: string
  @ApiProperty()
  campaignId: string
  invitee?: UserDto
  campaign?: CampaignDto
}

export class CreateInvitationDto {
  @ApiProperty()
  inviterId: string
  @ApiProperty()
  campaignId: string
}

export class RetrieveInviationsDto extends PartialType(InvitationDto) {}

export class CampaignDto {
  @ApiProperty()
  id: string
  @ApiProperty()
  userId: string
  @ApiProperty()
  title: string
  @ApiProperty()
  body: string
  @ApiProperty()
  createdOn: Date
  @ApiProperty()
  user?: UserDto
  @ApiProperty()
  invitiations?: InvitationDto[]
}
export class RetrieveCampaignDto extends PartialType(CampaignDto) {
  include?: CampaignIncludeQuery
}
export class CreateCampaignDto {
  @ApiProperty()
  @IsDefined()
  @IsUUID("all")
  userId: string
  @ApiProperty()
  @IsDefined()
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  title: string
  @ApiProperty()
  @IsDefined()
  @IsString()
  @MinLength(5)
  @MaxLength(150)
  body: string
}

export class CampignModelWithIncludeQuery {
  @ApiProperty()
  id: string
  @ApiProperty()
  userId: string
  @ApiProperty()
  title: string
  @ApiProperty()
  body: string
  @ApiProperty()
  createdOn: Date
  @ApiProperty()
  user?: User
  @ApiProperty()
  invitiations?: Invitation[]
}
