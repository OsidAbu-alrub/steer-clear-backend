import { Product } from "@prisma/client"
import { HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import {
  ProductDto,
  CreateProductDto,
  RetrieveProductDto,
  ProductModelWithContentAndCategory,
  CreateProductDtoWithImageId,
} from "./product.dto"
import { GoogleDriveService } from "src/google-drive/google-drive.service"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { MAX_FILE_SIZE } from "src/global/constants"
import { BAD_PRODUCT_BADCODE_INITIALS } from "./product.constant"

@Injectable()
export class ProductService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  retrieve = async (
    retrieveProductDto: RetrieveProductDto = {},
  ): Promise<Array<ProductDto>> => {
    const retrieveProductModel = this.fromRetrieveDto(retrieveProductDto)
    const products = await this.prismaService.product.findMany({
      where: retrieveProductModel,
    })
    return products.map(this.fromModel)
  }

  retrieveFirst = async ({
    include,
    ...retrieveProductDto
  }: RetrieveProductDto = {}): Promise<ProductDto> => {
    const retrieveProductModel = this.fromRetrieveDto(retrieveProductDto)
    const product = await this.prismaService.product.findFirst({
      where: retrieveProductModel,
      include,
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          "Product not found",
          HttpStatus.NOT_FOUND,
        )
      },
    })
    return this.fromModel(product)
  }

  create = async (
    image: Express.Multer.File,
    createProductDto: CreateProductDto,
  ): Promise<ProductDto> => {
    const createProductModel = this.fromCreateDto(createProductDto)
    const isBarcodeDuplicate = Boolean(
      await this.prismaService.product.findUnique({
        where: {
          barcode: createProductModel.barcode,
        },
      }),
    )

    if (isBarcodeDuplicate)
      throw new GenericHttpException(
        "Barcode already exists",
        HttpStatus.BAD_REQUEST,
      )

    const createdProduct = await this.prismaService.product.create({
      data: createProductModel,
    })

    const createdProductDto = this.fromModel(createdProduct)

    createdProductDto.image = this.googleDriveService.getPublicViewURL(
      await this.uploadImage(image, createdProductDto.id),
    )

    return createdProductDto
  }

  uploadImage = async (file: Express.Multer.File, productId: string) => {
    if (file.size > MAX_FILE_SIZE)
      throw new GenericHttpException("Max size is 2MB", HttpStatus.BAD_REQUEST)

    const { imageId } = await this.prismaService.product.findUnique({
      where: { id: productId },
      select: {
        imageId: true,
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          "Product not found",
          HttpStatus.NOT_FOUND,
        )
      },
    })

    const productImageId = imageId
      ? await this.googleDriveService.updateFile(file, imageId, "product_image")
      : await this.googleDriveService.createFile(file, "product_image")

    await this.prismaService.product.update({
      where: {
        id: productId,
      },
      data: {
        imageId: productImageId,
      },
    })

    return productImageId
  }

  // this is only used to fill database with products
  createMany = async (
    arrayOfCreateProductDtoWithImageId: CreateProductDtoWithImageId[],
  ): Promise<number> => {
    const arrayOfCreateProductModelWithImageId =
      arrayOfCreateProductDtoWithImageId.map(
        this.fromCreateProductDtoWithImageId,
      )

    const { count } = await this.prismaService.product.createMany({
      data: arrayOfCreateProductModelWithImageId,
    })

    return count
  }
  /************** UTILITY METHODS **************/
  private isBadProduct = (productBarcode: string) =>
    productBarcode.startsWith(BAD_PRODUCT_BADCODE_INITIALS + "")

  private fromCreateDto = (createProductDto: CreateProductDto): Product => {
    return {
      barcode: createProductDto.barcode,
      name: createProductDto.name,
      continentId: createProductDto.continentId,
      categoryId: createProductDto.categoryId,
      uploadedAt: new Date(),
      uploadedBy: createProductDto.uploadedBy,
      imageId: undefined,
      id: undefined,
    }
  }

  private fromRetrieveDto = (
    retrieveProductDto: RetrieveProductDto,
  ): Product => {
    return {
      id: retrieveProductDto.id,
      continentId: retrieveProductDto.continentId,
      categoryId: retrieveProductDto.categoryId,
      barcode: retrieveProductDto.barcode,
      name: retrieveProductDto.name,
      uploadedBy: retrieveProductDto.uploadedBy,
      uploadedAt: undefined,
      imageId: undefined,
    }
  }
  private fromModel = (
    product: ProductModelWithContentAndCategory,
  ): ProductDto => {
    return {
      barcode: product.barcode,
      categoryId: product.categoryId,
      continentId: product.continentId,
      id: product.id,
      image: product.imageId
        ? this.googleDriveService.getPublicViewURL(product.imageId)
        : null,
      name: product.name,
      isBadProduct: this.isBadProduct(product.barcode),
      uploadedAt: product.uploadedAt,
      uploadedBy: product.uploadedBy,
      category: product.category
        ? {
            description: product.category?.description,
            id: product.category?.id,
            name: product.category?.title,
          }
        : undefined,
      continent: product.continent
        ? {
            id: product.continent.id,
            name: product.continent.name,
          }
        : undefined,
    }
  }

  private fromCreateProductDtoWithImageId = (
    createProductDtoWithImageId: CreateProductDtoWithImageId,
  ): Product => {
    return {
      barcode: createProductDtoWithImageId.barcode,
      name: createProductDtoWithImageId.name,
      continentId: createProductDtoWithImageId.continentId,
      categoryId: createProductDtoWithImageId.categoryId,
      uploadedAt: new Date(),
      uploadedBy: createProductDtoWithImageId.uploadedBy,
      imageId: createProductDtoWithImageId.imageId,
      id: undefined,
    }
  }
}
