import { Stock } from "@prisma/client"
import { HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import StockContract from "./stock.contract"
import {
  StockDto,
  CreateStockDto,
  UpdateStockDto,
  RetrieveStockDto,
} from "./stock.dto"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { ProductService } from "../product/product.service"

@Injectable()
export class StockService implements StockContract {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
  ) {}

  retrieve = async (
    retrieveStockDto: RetrieveStockDto = {},
  ): Promise<Array<StockDto>> => {
    const stockModel = this.fromRetrieveDto(retrieveStockDto)
    const stocks = await this.prismaService.stock.findMany({
      where: {
        productId: stockModel.productId,
        id: stockModel.id,
        quantity: {
          lte: stockModel.quantity,
        },
        updatedAt: {
          lte: stockModel.updatedAt,
        },
      },
    })
    return stocks.map(this.fromModel)
  }

  create = async (createStockDto: CreateStockDto): Promise<StockDto> => {
    const { stockable } = await this.prismaService.product.findUnique({
      where: {
        id: createStockDto.productId,
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          `Product with ID ${createStockDto.productId} not found`,
          HttpStatus.NOT_FOUND,
        )
      },
    })

    if (!stockable)
      throw new GenericHttpException(
        `Product with ID ${createStockDto.productId} is not stockable`,
        HttpStatus.BAD_REQUEST,
      )

    const duplicatedStock = await this.prismaService.stock.findUnique({
      where: {
        productId: createStockDto.productId,
      },
    })

    if (duplicatedStock) {
      const updatedStockDto = await this.update({
        id: duplicatedStock.id,
        productId: duplicatedStock.productId,
        quantity: createStockDto.quantity,
      })

      return updatedStockDto
    }
    const createStockModel = this.fromCreateDto(createStockDto)
    const createdStock = await this.prismaService.stock.create({
      data: createStockModel,
    })
    return this.fromModel(createdStock)
  }

  update = async ({
    operation = "increment",
    ...updateStockDto
  }: UpdateStockDto): Promise<StockDto> => {
    const updateStockModel = this.fromUpdateDto(updateStockDto)

    if (!updateStockModel.id) {
      throw new GenericHttpException(
        `Stock ID is required`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const oldStock = (await this.retrieve({ id: updateStockModel.id })).find(
      (stock) => stock.id === updateStockModel.id,
    )

    if (!oldStock) {
      throw new GenericHttpException(
        `Stock with ID ${updateStockModel.id} not found`,
        HttpStatus.NOT_FOUND,
      )
    }

    const [oldProduct, updatedProduct] = await Promise.all([
      this.productService.findProduct(oldStock.productId),
      updateStockModel.productId &&
        updateStockModel.productId !== oldStock.productId &&
        this.productService.findProduct(updateStockModel.productId),
    ])

    if (!oldProduct.stockable) {
      throw new GenericHttpException(
        `Product with ID ${oldProduct.id} is not stockable (can't be updated)`,
        HttpStatus.BAD_REQUEST,
      )
    }

    if (updatedProduct && !updatedProduct.stockable) {
      throw new GenericHttpException(
        `Product with ID ${updatedProduct.id} is not stockable (can't be updated)`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const updatedStock = await this.prismaService.stock.update({
      where: {
        id: updateStockModel.id,
      },
      data: {
        ...updateStockModel,
        quantity: {
          [operation]: updateStockModel.quantity,
        },
      },
    })

    return this.fromModel(updatedStock)
  }

  delete = async (stockId: StockDto["id"]): Promise<StockDto> => {
    const deletedStock = await this.prismaService.stock.delete({
      where: {
        id: stockId,
      },
    })
    return this.fromModel(deletedStock)
  }

  /************** UTILITY METHODS **************/
  private fromRetrieveDto(retrieveStockDto: RetrieveStockDto): Stock {
    return {
      id: retrieveStockDto.id,
      productId: retrieveStockDto.productId,
      quantity: retrieveStockDto.quantity,
      updatedAt: undefined,
    }
  }
  private fromCreateDto(createStockDto: CreateStockDto): Stock {
    return {
      id: undefined,
      productId: createStockDto.productId,
      quantity: createStockDto.quantity < 0 ? 0 : createStockDto.quantity,
      updatedAt: undefined,
    }
  }
  private fromUpdateDto(updateStockDto: UpdateStockDto): Stock {
    return {
      id: updateStockDto.id,
      quantity: updateStockDto.quantity < 0 ? 0 : updateStockDto.quantity,
      updatedAt: new Date(),
      productId: updateStockDto.productId,
    }
  }
  private fromDto({ id, quantity, updatedAt, productId }: StockDto): Stock {
    return {
      id,
      quantity,
      updatedAt,
      productId,
    }
  }
  private fromModel(stock: Stock): StockDto {
    return {
      id: stock.id,
      quantity: stock.quantity,
      updatedAt: stock.updatedAt,
      productId: stock.productId,
    }
  }
}
