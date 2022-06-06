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
} from "@nestjs/common"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import ProductDto, { UpdateProductDto } from "./product.dto"
import { ProductService } from "./product.service"

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Adds a product to database
   *
   * @param product - product to be created
   * @returns productId - the ID of the added product
   */
  @Post("create")
  async createProduct(@Body() product: ProductDto): AsyncBaseResponse<number> {
    const createdProductId = await this.productService.createProduct(product)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: createdProductId,
    }
  }

  /**
   * Gets all products from database
   *
   * @returns products - All the products in the database
   */
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
