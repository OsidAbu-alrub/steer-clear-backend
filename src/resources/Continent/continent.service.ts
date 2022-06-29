import { HttpStatus, Injectable } from "@nestjs/common"
import { Continent } from "@prisma/client"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { PrismaService } from "src/prisma/prisma.service"
import {
  ContinentDto,
  CreateContinentDto,
  RetrieveContinentDto,
} from "./continent.dto"

@Injectable()
export class ContinentService {
  constructor(private readonly prismaService: PrismaService) {}

  retrieve = async (
    retrieveContinentDto: RetrieveContinentDto = {},
  ): Promise<Array<ContinentDto>> => {
    const continentModel = this.fromRetrieveDto(retrieveContinentDto)
    const continents = await this.prismaService.continent.findMany({
      where: continentModel,
      orderBy: {
        name: "asc",
      },
    })
    return continents.map(this.fromModel)
  }

  retrieveFirst = async (
    retrieveContinentDto: RetrieveContinentDto = {},
  ): Promise<ContinentDto> => {
    const continentModel = this.fromRetrieveDto(retrieveContinentDto)
    const continent = await this.prismaService.continent.findFirst({
      where: continentModel,
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          "Continent not found",
          HttpStatus.NOT_FOUND,
        )
      },
    })

    return this.fromModel(continent)
  }

  create = async (
    createContinentDto: CreateContinentDto,
  ): Promise<ContinentDto> => {
    const isDuplicateContinent = Boolean(
      await this.retrieveFirst({
        name: createContinentDto.name,
      }),
    )

    if (isDuplicateContinent)
      throw new GenericHttpException(
        "Continent with this name already exists",
        HttpStatus.BAD_REQUEST,
      )

    const continentModel = this.fromCreateDto(createContinentDto)
    const continent = await this.prismaService.continent.create({
      data: continentModel,
    })

    return this.fromModel(continent)
  }

  /************** UTILITY METHODS **************/
  private fromCreateDto = (
    createContinentDto: CreateContinentDto,
  ): Continent => {
    return {
      name: createContinentDto.name,
      id: undefined,
    }
  }
  private fromRetrieveDto = (
    retrieveContinentDto: RetrieveContinentDto,
  ): Continent => {
    return {
      id: retrieveContinentDto.id,
      name: retrieveContinentDto.name,
    }
  }
  private fromModel = (continent: Continent): ContinentDto => {
    return {
      id: continent.id,
      name: continent.name,
    }
  }
}
