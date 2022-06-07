import { Order } from "@prisma/client"
import { HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import OrderContract from "./order.contract"
import {
  OrderDto,
  CreateOrderDto,
  UpdateOrderDto,
  RetrieveOrderDto,
} from "./order.dto"
import { getValidDate } from "src/global/utils"
import { GenericHttpException } from "src/exception/GenericHttpException"

@Injectable()
export class OrderService implements OrderContract {
  constructor(private readonly prismaService: PrismaService) {}

  async retrieve(
    retrieveOrderDto: RetrieveOrderDto = {},
  ): Promise<Array<OrderDto>> {
    const retrieveOrderModel = this.fromRetrieveDto(retrieveOrderDto)
    const orders = await this.prismaService.order.findMany({
      where: {
        customerId: retrieveOrderModel.customerId,
        id: retrieveOrderModel.id,
        orderedAt: {
          lte: retrieveOrderModel.orderedAt,
        },
      },
    })
    return orders.map(this.fromModel)
  }

  async create(createOrderDto: CreateOrderDto): Promise<OrderDto> {
    const order = this.fromCreateDto(createOrderDto)

    await this.prismaService.customer.findUnique({
      where: {
        id: order.customerId,
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          `Customer with ID ${order.customerId} not found`,
          HttpStatus.NOT_FOUND,
        )
      },
    })

    const createdOrder = await this.prismaService.order.create({
      data: order,
    })
    return this.fromModel(createdOrder)
  }

  async update(updateOrderDto: UpdateOrderDto): Promise<OrderDto> {
    const order = this.fromUpdateDto(updateOrderDto)
    await this.doesCustomerExist(order.customerId)
    const updatedOrder = await this.prismaService.order.update({
      where: {
        id: order.id,
      },
      data: order,
    })
    return this.fromModel(updatedOrder)
  }

  async delete(orderId: OrderDto["id"]): Promise<OrderDto> {
    const deletedOrder = await this.prismaService.order.delete({
      where: {
        id: orderId,
      },
    })
    return this.fromModel(deletedOrder)
  }

  /************** UTILITY METHODS **************/
  private doesCustomerExist = async (customerId: Order["customerId"]) => {
    this.prismaService.customer.findUnique({
      where: {
        id: customerId,
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          `Customer with ID ${customerId} not found`,
          HttpStatus.NOT_FOUND,
        )
      },
    })
  }
  fromCreateDto(createOrderDto: CreateOrderDto): Order {
    return {
      customerId: createOrderDto.customerId,
      id: undefined,
      orderedAt: new Date(),
    }
  }
  fromUpdateDto(updateOrderDto: UpdateOrderDto): Order {
    return {
      customerId: updateOrderDto.customerId,
      id: updateOrderDto.id,
      orderedAt: undefined,
    }
  }
  fromRetrieveDto(retrieveOrderDto: RetrieveOrderDto): Order {
    return {
      customerId: retrieveOrderDto.customerId,
      id: retrieveOrderDto.id,
      orderedAt: getValidDate(retrieveOrderDto.orderedAt),
    }
  }
  fromDto(orderDto: OrderDto): Order {
    return {
      customerId: orderDto.customerId,
      id: orderDto.id,
      orderedAt: getValidDate(orderDto.orderedAt),
    }
  }
  fromModel(order: Order): OrderDto {
    return {
      customerId: order.customerId,
      id: order.id,
      orderedAt: order.orderedAt.toISOString(),
    }
  }
}
