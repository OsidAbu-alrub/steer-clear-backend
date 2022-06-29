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

  retrieve = async ({
    include,
    ...retrieveCategoryDto
  }: RetrieveCategoryDto = {}): Promise<Array<CategoryDto>> => {
    const categoryModel = this.fromRetrieveDto(retrieveCategoryDto)
    const categories = await this.prismaService.category.findMany({
      where: categoryModel,
      include,
      orderBy: {
        title: "asc",
      },
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
    const categoryModel = this.fromCreateDto(createCategoryDto)
    const isDuplicateCategory = Boolean(
      await this.prismaService.category.findUnique({
        where: {
          title: categoryModel.title,
        },
      }),
    )

    if (isDuplicateCategory)
      throw new GenericHttpException(
        "Category with this title already exists",
        HttpStatus.BAD_REQUEST,
      )

    const category = await this.prismaService.category.create({
      data: categoryModel,
    })
    return this.fromModel(category)
  }

  /************** UTILITY METHODS **************/
  private fromCreateDto = (createCategoryDto: CreateCategoryDto): Category => {
    return {
      id: undefined,
      title: createCategoryDto.name,
      description: createCategoryDto.description,
    }
  }
  private fromRetrieveDto = (
    retrieveCategoryDto: RetrieveCategoryDto,
  ): Category => {
    return {
      description: retrieveCategoryDto.description,
      id: retrieveCategoryDto.id,
      title: retrieveCategoryDto.name,
    }
  }
  private fromModel = (category: Category): CategoryDto => {
    return {
      description: category.description,
      id: category.id,
      name: category.title,
    }
  }
}
