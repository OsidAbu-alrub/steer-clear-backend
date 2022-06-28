import { Body, Controller, HttpStatus, Post, UseGuards } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { JwtAuthGuard } from "src/jwt/jwt.guard"
import {
  ContinentDto,
  CreateContinentDto,
  RetrieveContinentDto,
} from "./continent.dto"
import { ContinentService } from "./continent.service"

@UseGuards(JwtAuthGuard)
@ApiTags("Continent")
@Controller("continent")
export class ContinentController {
  constructor(private readonly continentService: ContinentService) {}

  /**
   * Get Continent objects from database
   * @param retrieveContinentDto - object that the retrieval query is based on
   * @returns arrayOfContinent - Get Continent objects from the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Continent retrieved successfully",
  })
  @Post("retrieve")
  async retrieve(
    @Body() retrieveContinentDto: RetrieveContinentDto,
  ): AsyncBaseResponse<Array<ContinentDto>> {
    const arrayOfContinent = await this.continentService.retrieve(
      retrieveContinentDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: arrayOfContinent,
    }
  }

  /**
   * Get first Continent object from database
   * @param retrieveContinentDto - object that the retrieval query is based on
   * @returns Continent - Get first Continent object from the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Continent retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Continent not found",
  })
  @Post("retrieve-first")
  async retrieveFirst(
    @Body() retrieveContinentDto: RetrieveContinentDto,
  ): AsyncBaseResponse<ContinentDto> {
    const continent = await this.continentService.retrieveFirst(
      retrieveContinentDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: continent,
    }
  }

  /**
   * creates a Continent and stores it in the database
   *
   * @param createContinentDto - Continent to be created
   * @returns createdContinent - the ContinentDto object that was created
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Continent created successfully",
  })
  @Post("create")
  async create(
    @Body() createContinentDto: CreateContinentDto,
  ): AsyncBaseResponse<ContinentDto> {
    const createdContinent = await this.continentService.create(
      createContinentDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: createdContinent,
    }
  }
}
