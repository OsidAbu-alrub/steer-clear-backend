import { HttpStatus, Injectable } from "@nestjs/common"
import { ProductOrder } from "@prisma/client"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { PrismaService } from "src/prisma/prisma.service"
import { OrderService } from "../Order/order.service"
import { ProductService } from "../product/product.service"
import { StockService } from "../Stock/stock.service"
import ProductOrderContract from "./product-order.contract"
import {
  CreateProductOrderDto,
  DeleteProductOrderDto,
  ProductOrderDto,
  RetrieveProductOrderDto,
} from "./product-order.dto"
import { calculateTotal, isEnoughStock } from "./product-order.utils"

@Injectable()
export class ProductOrderService implements ProductOrderContract {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly orderService: OrderService,
    private readonly stockService: StockService,
    private readonly productService: ProductService,
  ) {}

  async retrieve(
    retrieveProductOrderDto: RetrieveProductOrderDto = {},
  ): Promise<Array<ProductOrderDto>> {
    const retrieveProductOrderModel = this.fromRetrieveDto(
      retrieveProductOrderDto,
    )
    const productOrders = await this.prismaService.productOrder.findMany({
      where: {
        orderId: retrieveProductOrderModel.orderId,
        productId: retrieveProductOrderModel.productId,
      },
    })
    return productOrders.map(this.fromModel)
  }

  async create(
    createProductOrderDto: CreateProductOrderDto,
  ): Promise<ProductOrderDto> {
    const productOrder = this.fromCreateDto(createProductOrderDto)

    if (!createProductOrderDto.productId)
      throw new GenericHttpException(
        "Product ID is missing",
        HttpStatus.BAD_REQUEST,
      )

    if (!createProductOrderDto.customerId)
      throw new GenericHttpException(
        "Customer ID is missing",
        HttpStatus.BAD_REQUEST,
      )

    if (!createProductOrderDto.quantity)
      throw new GenericHttpException(
        "Quantity must be greater than 0",
        HttpStatus.BAD_REQUEST,
      )

    const stock = (
      await this.stockService.retrieve({
        productId: createProductOrderDto.productId,
      })
    ).find((stock) => stock.productId === createProductOrderDto.productId)

    const { stockable: isProductStockable } =
      await this.productService.findProduct(createProductOrderDto.productId)

    if (!stock || !isProductStockable) {
      throw new GenericHttpException(
        "Product not found OR not stocked/stockable",
        HttpStatus.NOT_FOUND,
      )
    }

    if (!isEnoughStock(createProductOrderDto.quantity, stock.quantity))
      throw new GenericHttpException("Not enough stock", HttpStatus.BAD_REQUEST)

    const order = await this.orderService.create({
      customerId: createProductOrderDto.customerId,
    })

    const product = await this.productService.findProduct(stock.productId)

    const [createdProductOrder] = await Promise.all([
      this.prismaService.productOrder.create({
        data: {
          price: product.price,
          quantity: productOrder.quantity,
          vat: product.vat,
          orderId: order.id,
          productId: product.id,
        },
      }),
      this.stockService.update({
        id: stock.id,
        operation: "decrement",
        quantity: productOrder.quantity,
      }),
    ])

    return this.fromModel(createdProductOrder)
  }

  async delete(
    deleteProductOrderDto: DeleteProductOrderDto,
  ): Promise<ProductOrderDto> {
    const productOrder = this.fromDeleteDto(deleteProductOrderDto)

    if (!productOrder.productId || !productOrder.orderId)
      throw new GenericHttpException(
        "Product ID and/or order ID are missing",
        HttpStatus.BAD_REQUEST,
      )

    const doesProductOrderExist = Boolean(
      (
        await this.retrieve({
          productId: productOrder.productId,
          orderId: productOrder.orderId,
        })
      )[0],
    )

    if (!doesProductOrderExist) {
      throw new GenericHttpException(
        "Order with specified attributes was not found",
        HttpStatus.NOT_FOUND,
      )
    }

    const deletedProductOrder = await this.prismaService.productOrder.delete({
      where: {
        productId_orderId: {
          orderId: productOrder.orderId,
          productId: productOrder.productId,
        },
      },
    })

    const stock = (
      await this.stockService.retrieve({
        productId: productOrder.productId,
      })
    ).find((stock) => stock.productId === productOrder.productId)

    // restock
    await this.stockService.update({
      id: stock.id,
      operation: "increment",
      quantity: deletedProductOrder.quantity,
    })

    return this.fromModel(deletedProductOrder)
  }

  /************** UTILITY METHODS **************/
  private fromDeleteDto(
    deleteProductOrderDto: DeleteProductOrderDto,
  ): ProductOrder {
    return {
      orderId: deleteProductOrderDto.orderId,
      productId: deleteProductOrderDto.productId,
      price: undefined,
      quantity: undefined,
      vat: undefined,
    }
  }
  private fromCreateDto(
    createProductOrderDto: CreateProductOrderDto,
  ): ProductOrder {
    return {
      orderId: undefined,
      vat: undefined,
      price: undefined,
      productId: createProductOrderDto.productId,
      quantity: createProductOrderDto.quantity,
    }
  }
  private fromRetrieveDto(
    retrieveProductOrderDto: RetrieveProductOrderDto,
  ): ProductOrder {
    return {
      orderId: retrieveProductOrderDto.orderId,
      productId: retrieveProductOrderDto.productId,
      price: undefined,
      quantity: undefined,
      vat: undefined,
    }
  }
  private fromDto(productOrderDto: ProductOrderDto): ProductOrder {
    return {
      orderId: productOrderDto.orderId,
      productId: productOrderDto.productId,
      price: productOrderDto.price,
      quantity: productOrderDto.quantity,
      vat: productOrderDto.vat,
    }
  }
  private fromModel(productOrder: ProductOrder): ProductOrderDto {
    return {
      orderId: productOrder.orderId,
      price: productOrder.price,
      productId: productOrder.productId,
      quantity: productOrder.quantity,
      vat: productOrder.vat,
      total: calculateTotal({
        price: productOrder.price,
        quantity: productOrder.quantity,
        vat: productOrder.vat,
      }),
    }
  }
}
