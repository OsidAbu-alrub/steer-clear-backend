import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { MAX_FILE_SIZE } from "src/global/constants"
import { JwtAuthGuard } from "src/jwt/jwt.guard"
import {
  CreateProductDtoWithImageId,
  ProductDto,
  RetrieveProductDto,
} from "./product.dto"
import { ProductService } from "./product.service"

@UseGuards(JwtAuthGuard)
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
  @UseInterceptors(
    FileInterceptor("image", {
      limits: { fieldSize: MAX_FILE_SIZE },
    }),
  )
  async create(
    @Body("extraData") createProductDto: string,
    @UploadedFile() image: Express.Multer.File,
  ): AsyncBaseResponse<ProductDto> {
    const createdProduct = await this.productService.create(
      image,
      JSON.parse(createProductDto),
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: createdProduct,
    }
  }

  // THIS METHOD IS ONLY USED TO FILL DATABASE WITH PRODUCTS
  @Post("create-many")
  async createMany(
    @Body() arrayOfCreateProductDto: CreateProductDtoWithImageId[],
  ): AsyncBaseResponse<number> {
    const numberOfCreatedProducts = await this.productService.createMany(
      arrayOfCreateProductDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: numberOfCreatedProducts,
    }
  }
}
