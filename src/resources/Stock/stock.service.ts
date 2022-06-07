import { Stock } from "@prisma/client"
import { HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import StockContract from "./stock.contract"
import { StockDto, CreateStockDto, UpdateStockDto } from "./stock.dto"
import { GenericHttpException } from "src/exception/GenericHttpException"

@Injectable()
export class StockService implements StockContract {
  constructor(private readonly prismaService: PrismaService) {}

  async retrieve(stockDto: Partial<StockDto> = {}): Promise<Array<StockDto>> {
    const stockModel = this.fromDto(stockDto)
    const stocks = await this.prismaService.stock.findMany({
      where: stockModel,
    })
    return stocks.map(this.fromModel)
  }

  async retrieveProductQuantity(
    productId: StockDto["productId"],
  ): Promise<number> {
    const doesProductExist = (await this.retrieve({ productId })).length > 0
    if (!doesProductExist) {
      throw new GenericHttpException(
        `Product with ID ${productId} not found`,
        HttpStatus.NOT_FOUND,
      )
    }
    const products = await this.prismaService.stock.aggregate({
      where: {
        productId,
      },
      _sum: {
        quantity: true,
      },
    })
    return products._sum.quantity ?? 0
  }

  async create(createstockDto: CreateStockDto): Promise<StockDto> {
    const createStockModel = this.fromCreateDto(createstockDto)
    const { stockable } = await this.prismaService.product.findUnique({
      where: {
        id: createStockModel.productId,
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          `Product with ID ${createStockModel.productId} not found`,
          HttpStatus.NOT_FOUND,
        )
      },
    })
    if (!stockable)
      throw new GenericHttpException(
        `Product with ID ${createStockModel.productId} is not stockable`,
        HttpStatus.BAD_REQUEST,
      )

    const createdStock = await this.prismaService.stock.create({
      data: createStockModel,
    })
    return this.fromModel(createdStock)
  }

  async update(updateStockDto: UpdateStockDto): Promise<StockDto> {
    const updateStockModel = this.fromUpdateDto(updateStockDto)

    if (!updateStockModel.id) {
      throw new GenericHttpException(
        `Stock ID is required`,
        HttpStatus.BAD_REQUEST,
      )
    }

    const doesStockExist = Boolean(
      (await this.retrieve({ id: updateStockModel.id })).length,
    )

    if (!doesStockExist) {
      throw new GenericHttpException(
        `Stock with ID ${updateStockModel.id} not found`,
        HttpStatus.NOT_FOUND,
      )
    }

    const updatedStock = await this.prismaService.stock.update({
      where: {
        id: updateStockModel.id,
      },
      data: updateStockModel,
    })

    return this.fromModel(updatedStock)
  }

  async delete(stockId: StockDto["id"]): Promise<StockDto> {
    const deletedStock = await this.prismaService.stock.delete({
      where: {
        id: stockId,
      },
    })
    return this.fromModel(deletedStock)
  }

  /************** UTILITY METHODS **************/
  fromCreateDto(createStockDto: CreateStockDto): Stock {
    return {
      id: undefined,
      productId: createStockDto.productId,
      quantity: createStockDto.quantity,
      updatedAt: undefined,
    }
  }
  fromUpdateDto(updateStockDto: UpdateStockDto): Stock {
    return {
      id: updateStockDto.id,
      productId: updateStockDto.productId,
      quantity: updateStockDto.quantity,
      updatedAt: undefined,
    }
  }
  fromDto({ id, productId, quantity, updatedAt }: Partial<StockDto>): Stock {
    return {
      id,
      productId,
      quantity,
      updatedAt,
    }
  }
  fromModel(stock: Stock): StockDto {
    return {
      ...stock,
    }
  }
}
