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
  UseGuards,
} from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { IsAdmin } from "src/roles/roles.decorator"
import { JwtAuthGuard } from "src/jwt/jwt.guard"
import { CreateProductDto, ProductDto, UpdateProductDto } from "./product.dto"
import { ProductService } from "./product.service"

@UseGuards(JwtAuthGuard)
@ApiTags("Product")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Adds a product to database
   *
   * @param product - product to be created
   * @returns productId - the ID of the added product
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Product created successfully",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "If not admin",
  })
  @IsAdmin(true)
  @Post("create")
  async createProduct(
    @Body() product: CreateProductDto,
  ): AsyncBaseResponse<number> {
    const createdProductId = await this.productService.createProduct(product)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: createdProductId,
    }
  }

  /**
   * Gets all products from database
   *
   * @returns products - All the products in the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "All products retrieved successfully",
  })
  @IsAdmin(false)
  @Get("all")
  async getAllProducts(): AsyncBaseResponse<ProductDto[]> {
    const products = await this.productService.getAllProducts()

    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: products,
    }
  }

  /**
   * update existing product
   *
   * @param product - product with updated attributes
   * @returns updatedProduct - the updated product
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "All products retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product ID doesn't exist",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "If not admin",
  })
  @IsAdmin(true)
  @Put("update")
  async updateProduct(
    @Body() product: UpdateProductDto,
  ): AsyncBaseResponse<ProductDto> {
    const updatedProduct = await this.productService.updateProduct(product)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: updatedProduct,
    }
  }

  /**
   * delete product from database
   *
   * @param productId - the ID of the product to be deleted
   * @returns product - the deleted product
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Deleted product successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product doesn't exist",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "id must be a number",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "If not admin",
  })
  @IsAdmin(true)
  @Delete(":id")
  async deleteProduct(
    @Param(
      "id",
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new GenericHttpException(
            "id must be a number",
            HttpStatus.BAD_REQUEST,
          )
        },
      }),
    )
    productId: ProductDto["id"],
  ): AsyncBaseResponse<ProductDto> {
    const deletedProduct = await this.productService.deleteProduct(productId)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: deletedProduct,
    }
  }

  /**
   * get a specific product from database
   *
   * @param productId - the ID of the queried product
   * @returns product - the product queried from database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "product retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product doesn't exist",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "id must be a number",
  })
  @IsAdmin(false)
  @Get(":id")
  async findProduct(
    @Param(
      "id",
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new GenericHttpException(
            "id must be a number",
            HttpStatus.BAD_REQUEST,
          )
        },
      }),
    )
    productId: ProductDto["id"],
  ): AsyncBaseResponse<ProductDto> {
    const product = await this.productService.findProduct(productId)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: product,
    }
  }
}
