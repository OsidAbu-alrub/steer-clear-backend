import { Product } from "@prisma/client"
import { HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import { ProductDto, CreateProductDto, RetrieveProductDto } from "./product.dto"
import { GoogleDriveService } from "src/google-drive/google-drive.service"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { MAX_FILE_SIZE } from "../User/user.constants"

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

  retrieveFirst = async (
    retrieveProductDto: RetrieveProductDto = {},
  ): Promise<ProductDto> => {
    const retrieveProductModel = this.fromRetrieveDto(retrieveProductDto)
    const product = await this.prismaService.product.findFirst({
      where: retrieveProductModel,
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
      await this.retrieveFirst({
        barcode: createProductModel.barcode,
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
      ? await this.googleDriveService.updateFile(file, imageId)
      : await this.googleDriveService.createFile(file)

    await this.prismaService.user.update({
      where: {
        id: productId,
      },
      data: {
        imageId: productImageId,
      },
    })

    return productImageId
  }
  /************** UTILITY METHODS **************/
  private fromCreateDto = (createProductDto: CreateProductDto): Product => {
    return {
      barcode: createProductDto.barcode,
      name: createProductDto.name,
      continentId: createProductDto.continentId,
      categoryId: createProductDto.categoryId,
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
      imageId: undefined,
    }
  }
  private fromModel = (product: Product): ProductDto => {
    return {
      barcode: product.barcode,
      categoryId: product.categoryId,
      continentId: product.continentId,
      id: product.id,
      image: product.imageId
        ? this.googleDriveService.getPublicViewURL(product.imageId)
        : null,
      name: product.name,
    }
  }
}
