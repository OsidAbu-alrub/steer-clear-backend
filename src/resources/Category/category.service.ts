import { HttpStatus, Injectable } from "@nestjs/common"
import { Category } from "@prisma/client"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { PrismaService } from "src/prisma/prisma.service"
import {
  CategoryDto,
  CreateCategoryDto,
  RetrieveCategoryDto,
} from "./category.dto"

@Injectable()
export class CategoryService {
  constructor(private readonly prismaService: PrismaService) {}

  retrieve = async (
    retrieveCategoryDto: RetrieveCategoryDto = {},
  ): Promise<Array<CategoryDto>> => {
    const categoryModel = this.fromRetrieveDto(retrieveCategoryDto)
    const categories = await this.prismaService.category.findMany({
      where: categoryModel,
    })
    return categories.map(this.fromModel)
  }

  retrieveFirst = async (
    retrieveCategoryDto: RetrieveCategoryDto = {},
  ): Promise<CategoryDto> => {
    const categoryModel = this.fromRetrieveDto(retrieveCategoryDto)
    const category = await this.prismaService.category.findFirst({
      where: categoryModel,
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          "Category not found",
          HttpStatus.NOT_FOUND,
        )
      },
    })

    return this.fromModel(category)
  }

  create = async (
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryDto> => {
    const isDuplicateTitle = Boolean(
      await this.retrieveFirst({
        title: createCategoryDto.title,
      }),
    )

    if (isDuplicateTitle)
      throw new GenericHttpException(
        "Category with this title already exists",
        HttpStatus.BAD_REQUEST,
      )

    const categoryModel = this.fromCreateDto(createCategoryDto)
    const category = await this.prismaService.category.create({
      data: categoryModel,
    })
    return this.fromModel(category)
  }

  /************** UTILITY METHODS **************/
  private fromCreateDto = (createCategoryDto: CreateCategoryDto): Category => {
    return {
      id: undefined,
      title: createCategoryDto.title,
      description: createCategoryDto.description,
    }
  }
  private fromRetrieveDto = (
    retrieveCategoryDto: RetrieveCategoryDto,
  ): Category => {
    return {
      description: retrieveCategoryDto.description,
      id: retrieveCategoryDto.id,
      title: retrieveCategoryDto.title,
    }
  }
  private fromModel = (category: Category): CategoryDto => {
    return {
      description: category.description,
      id: category.id,
      title: category.title,
    }
  }
}
