import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common"
import { ApiResponse, ApiTags } from "@nestjs/swagger"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import {
  CreateOrderDto,
  OrderDto,
  RetrieveOrderDto,
  UpdateOrderDto,
} from "./order.dto"
import { OrderService } from "./order.service"

@ApiTags("Order")
@Controller("order")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  /**
   * Get Order objects from database
   * @param retrieveOrderDto - object that the retrieval query is based on
   * @returns arrayOfOrder - Get Order objects from the database
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Orders retrieved successfully",
  })
  @Post("retrieve")
  async retrieve(
    @Body() retrieveOrderDto: RetrieveOrderDto,
  ): AsyncBaseResponse<Array<OrderDto>> {
    const arrayOfOrders = await this.orderService.retrieve(retrieveOrderDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: arrayOfOrders,
    }
  }

  /**
   * creates a Order and stores it in the database
   *
   * @param createOrderDto - Order to be created
   * @returns createdOrder - the OrderDto object that was created
   */
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Order created successfully",
  })
  @Post("create")
  async create(
    @Body() createOrderDto: CreateOrderDto,
  ): AsyncBaseResponse<OrderDto> {
    const createdOrder = await this.orderService.create(createOrderDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.CREATED,
      },
      data: createdOrder,
    }
  }

  /**
   * update existing Order
   *
   * @param updatedOrderDto - Order with updated attributes
   * @returns updatedOrder - the updated Order
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Order updated successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Customer with sent order id doesn't exist",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Order not found",
  })
  @Put("update")
  async update(
    @Body() updatedOrderDto: UpdateOrderDto,
  ): AsyncBaseResponse<OrderDto> {
    const updatedOrder = await this.orderService.update(updatedOrderDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: updatedOrder,
    }
  }

  /**
   * delete Order from database
   *
   * @param orderId - the Order to be deleted
   * @returns deletedOrder - the deleted Order
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Order deleted successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Order doesn't exist",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "order ID either not provided or is not an integer",
  })
  @Delete(":orderId")
  async delete(
    @Param(
      "orderId",
      new ParseIntPipe({
        exceptionFactory: () =>
          new GenericHttpException(
            "Order ID must be an integer",
            HttpStatus.BAD_REQUEST,
          ),
      }),
    )
    orderId: OrderDto["id"],
  ): AsyncBaseResponse<OrderDto> {
    const deletedOrder = await this.orderService.delete(orderId)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: deletedOrder,
    }
  }
}
