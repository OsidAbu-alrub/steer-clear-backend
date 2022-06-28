import { Body, Controller, Delete, HttpStatus, Post, Put } from "@nestjs/common"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { ApiTags, ApiResponse } from "@nestjs/swagger"
import {
  ProductDto,
  UpdateProductDto,
  CreateProductDto,
  RetrieveProductDto,
} from "./product.dto"
import { ProductService } from "./product.service"

@ApiTags("Product")
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * Get Product objects from database
   * @param retrieveProductDto - object that the retrieval query is based on
   * @returns arrayOfProduct - Get Product objects from the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product retrieved successfully",
  })
  @Post("retrieve")
  async retrieve(
    @Body() retrieveProductDto: RetrieveProductDto,
  ): AsyncBaseResponse<Array<ProductDto>> {
    const arrayOfProduct = await this.productService.retrieve(
      retrieveProductDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: arrayOfProduct,
    }
  }

  /**
   * Get first Product object from database
   * @param retrieveProductDto - object that the retrieval query is based on
   * @returns Product - Get first Product object from the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Product not found",
  })
  @Post("retrieve-first")
  async retrieveFirst(
    @Body() retrieveProductDto: RetrieveProductDto,
  ): AsyncBaseResponse<ProductDto> {
    const product = await this.productService.retrieveFirst(retrieveProductDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: product,
    }
  }

  /**
   * creates a Product and stores it in the database
   *
   * @param createProductDto - Product to be created
   * @returns createdProduct - the ProductDto object that was created
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Product created successfully",
  })
  @Post("create")
  async create(
    @Body() createProductDto: CreateProductDto,
  ): AsyncBaseResponse<ProductDto> {
    const createdProduct = await this.productService.create(createProductDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: createdProduct,
    }
  }

  /**
   * update existing Product
   *
   * @param updatedProductDto - Product with updated attributes
   * @returns updatedProduct - the updated Product
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product updated successfully",
  })
  @Put("update")
  async update(
    @Body() updatedProductDto: UpdateProductDto,
  ): AsyncBaseResponse<ProductDto> {
    const updatedProduct = await this.productService.update(updatedProductDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: updatedProduct,
    }
  }

  /**
   * delete Product from database
   *
   * @param productDto - the Product to be deleted
   * @returns deletedProduct - the deleted Product
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Product deleted successfully",
  })
  @Delete("delete")
  async delete(@Body() productDto: ProductDto): AsyncBaseResponse<ProductDto> {
    const deletedProduct = await this.productService.delete(productDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: deletedProduct,
    }
  }
}
