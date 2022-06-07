import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from "@nestjs/common"
import {
  ApiBody,
  ApiQuery,
  ApiResponse,
  ApiTags,
  PickType,
} from "@nestjs/swagger"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import {
  CreateStockDto,
  RetrieveStockDto,
  StockDto,
  UpdateStockDto,
} from "./stock.dto"
import { StockService } from "./stock.service"

@ApiTags("Stock")
@Controller("stock")
export class StockController {
  constructor(private readonly stockService: StockService) {}

  /**
   * Get Stock objects from database
   * @param stockDto - object that the retrieval query is based on
   * @returns arrayOfStock - Get Stock objects from the database
   */
  @ApiBody({ type: RetrieveStockDto, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Stock retrieved successfully",
  })
  @Post("retrieve")
  async retrieve(
    @Body() stockDto: RetrieveStockDto,
  ): AsyncBaseResponse<Array<StockDto>> {
    const arrayOfStock = await this.stockService.retrieve(stockDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: arrayOfStock,
    }
  }

  /**
   * get product quantity from database
   * @param productId - productId of the product
   * @returns number - product quantity
   */
  @ApiQuery({
    type: PickType(StockDto, ["productId"]),
  })
  @Get("quantity")
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Quantity retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product ID doesn't exist",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Product ID is missing or is not a number",
  })
  async retrieveProductQuantity(
    @Query(
      "productId",
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new GenericHttpException(
            "productId is required & must be a number",
            HttpStatus.BAD_REQUEST,
          )
        },
      }),
    )
    productId: StockDto["productId"],
  ): AsyncBaseResponse<number> {
    const productQuantity = await this.stockService.retrieveProductQuantity(
      productId,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: productQuantity,
    }
  }

  /**
   * creates a Stock and stores it in the database
   *
   * @param createStockDto - Stock to be created
   * @returns createdStock - the StockDto object that was created
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Stock created successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product ID doesn't exist",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Product is not stockable",
  })
  @Post("create")
  async create(
    @Body() createStockDto: CreateStockDto,
  ): AsyncBaseResponse<StockDto> {
    const createdStock = await this.stockService.create(createStockDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: createdStock,
    }
  }

  /**
   * update existing Stock
   *
   * @param updatedStockDto - Stock with updated attributes
   * @returns updatedStock - the updated Stock
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Stock updated successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Stock doesn't exist",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Stock ID not provided",
  })
  @Put("update")
  async update(
    @Body() updatedStockDto: UpdateStockDto,
  ): AsyncBaseResponse<StockDto> {
    const updatedStock = await this.stockService.update(updatedStockDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: updatedStock,
    }
  }

  /**
   * delete Stock from database
   *
   * @param stockId - the stockId to be deleted
   * @returns deletedStock - the deleted Stock
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Stock deleted successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Stock doesn't exist",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Stock ID not provided or is not a number",
  })
  @Delete(":stockId")
  async delete(
    @Param(
      "stockId",
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new GenericHttpException(
            "Stock id is required & must be a number",
            HttpStatus.BAD_REQUEST,
          )
        },
      }),
    )
    stockId: StockDto["id"],
  ): AsyncBaseResponse<StockDto> {
    const deletedStock = await this.stockService.delete(stockId)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: deletedStock,
    }
  }
}
