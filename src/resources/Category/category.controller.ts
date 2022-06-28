import { Body, Controller, HttpStatus, Post, UseGuards } from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { JwtAuthGuard } from "src/jwt/jwt.guard"
import {
  CategoryDto,
  CreateCategoryDto,
  RetrieveCategoryDto,
} from "./category.dto"
import { CategoryService } from "./category.service"

@UseGuards(JwtAuthGuard)
@ApiTags("Category")
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * Get Category objects from database
   * @param retrieveCategoryDto - object that the retrieval query is based on
   * @returns arrayOfCategory - Get Category objects from the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Category retrieved successfully",
  })
  @Post("retrieve")
  async retrieve(
    @Body() retrieveCategoryDto: RetrieveCategoryDto,
  ): AsyncBaseResponse<Array<CategoryDto>> {
    const arrayOfCategories = await this.categoryService.retrieve(
      retrieveCategoryDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: arrayOfCategories,
    }
  }

  /**
   * Get first Category object from database
   * @param retrieveCategoryDto - object that the retrieval query is based on
   * @returns Category - Get first Category object from the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Category retrieved successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Category not found",
  })
  @Post("retrieve-first")
  async retrieveFirst(
    @Body() retrieveCategoryDto: RetrieveCategoryDto,
  ): AsyncBaseResponse<CategoryDto> {
    const category = await this.categoryService.retrieveFirst(
      retrieveCategoryDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: category,
    }
  }

  /**
   * creates a Category and stores it in the database
   *
   * @param createCategoryDto - Category to be created
   * @returns createdCategory - the CategoryDto object that was created
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Category created successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Duplicate category title",
  })
  @Post("create")
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): AsyncBaseResponse<CategoryDto> {
    const createdCategory = await this.categoryService.create(createCategoryDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: createdCategory,
    }
  }
}
