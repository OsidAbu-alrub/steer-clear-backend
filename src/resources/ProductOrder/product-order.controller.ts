import { Body, Controller, Delete, HttpStatus, Post } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import {
  CreateProductOrderDto,
  DeleteProductOrderDto,
  ProductOrderDto,
  RetrieveProductOrderDto,
} from "./product-order.dto"
import { ProductOrderService } from "./product-order.service"

@ApiTags("ProductOrder")
@Controller("product-order")
export class ProductOrderController {
  constructor(private readonly productOrderService: ProductOrderService) {}

  /**
   * Get ProductOrder objects from database
   * @param retrieveProductOrderDto - object that the retrieval query is based on
   * @returns arrayOfProductOrder - Get ProductOrder objects from the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "ProductOrder retrieved successfully",
  })
  @Post("retrieve")
  async retrieve(
    @Body() retrieveProductOrderDto: RetrieveProductOrderDto,
  ): AsyncBaseResponse<Array<ProductOrderDto>> {
    const arrayOfProductOrder = await this.productOrderService.retrieve(
      retrieveProductOrderDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: arrayOfProductOrder,
    }
  }

  /**
   * creates a ProductOrder and stores it in the database
   *
   * @param createProductOrderDto - ProductOrder to be created
   * @returns createdProductOrder - the ProductOrderDto object that was created
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Order created successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product not found",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Stock not suffcient",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product doesn't exist OR not stocked",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Product ID missing",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Customer ID missing",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Quantity must be greater than 0",
  })
  @Post("create")
  async create(
    @Body() createProductOrderDto: CreateProductOrderDto,
  ): AsyncBaseResponse<ProductOrderDto> {
    const createdProductOrder = await this.productOrderService.create(
      createProductOrderDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: createdProductOrder,
    }
  }

  /**
   * delete ProductOrder from database
   *
   * @param productOrderDto - the ProductOrder to be deleted
   * @returns deletedProductOrder - the deleted ProductOrder
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Order canceled successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "product id/order id not found",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "product ID and/or order ID not provided",
  })
  @Delete("delete")
  async delete(
    @Body() productOrderDto: DeleteProductOrderDto,
  ): AsyncBaseResponse<ProductOrderDto> {
    const deletedProductOrder = await this.productOrderService.delete(
      productOrderDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: deletedProductOrder,
    }
  }
}
