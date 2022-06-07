import { Order } from "@prisma/client"
import {
  OrderDto,
  CreateOrderDto,
  UpdateOrderDto,
  RetrieveOrderDto,
} from "./order.dto"

export default interface OrderContract {
  retrieve(orderDto?: RetrieveOrderDto): Promise<Array<OrderDto>>
  create(createOrderDto: CreateOrderDto): Promise<OrderDto>
  update(updateOrderDto: UpdateOrderDto): Promise<OrderDto>
  delete(orderId: OrderDto["id"]): Promise<OrderDto>
  fromCreateDto(createOrderDto: CreateOrderDto): Order
  fromUpdateDto(updateOrderDto: UpdateOrderDto): Order
  fromRetrieveDto(retrieveOrderDto: RetrieveOrderDto): Order
  fromDto(orderDto: OrderDto): Order
  fromModel(order: Order): OrderDto
}
