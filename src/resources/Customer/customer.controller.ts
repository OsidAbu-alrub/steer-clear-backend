import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common"
import { AsyncBaseResponse } from "src/global/BaseResponse"
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger"
import {
  CustomerDto,
  UpdateCustomerDto,
  CreateCustomerDto,
  RetrieveCustomerDto,
} from "./customer.dto"
import { CustomerService } from "./customer.service"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { JwtAuthGuard } from "src/jwt/jwt.guard"
import { IsAdmin } from "src/roles/roles.decorator"

@UseGuards(JwtAuthGuard)
@IsAdmin(true)
@ApiResponse({
  status: HttpStatus.FORBIDDEN,
  description: "If not admin",
})
@ApiTags("Customer")
@Controller("customer")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  /**
   * Get Customer objects from database
   * @param retrieveCustomerDto - object that the retrieval query is based on
   * @returns arrayOfCustomer - Get Customer objects from the database
   */
  @ApiBody({ type: RetrieveCustomerDto, required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Customer(s) retrieved successfully",
  })
  @Post("retrieve")
  async retrieve(
    @Body() retrieveCustomerDto: RetrieveCustomerDto = {},
  ): AsyncBaseResponse<Array<CustomerDto>> {
    const arrayOfCustomers = await this.customerService.retrieve(
      retrieveCustomerDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: arrayOfCustomers,
    }
  }

  /**
   * creates a Customer and stores it in the database
   *
   * @param createCustomerDto - Customer to be created
   * @returns createdCustomer - the CustomerDto object that was created
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Customer created successfully",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      "first name, last name, date of birth, and userId are required",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "User ID doesn't exist in database",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "User ID already linked to customer",
  })
  @Post("create")
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): AsyncBaseResponse<CustomerDto> {
    const createdCustomer = await this.customerService.create(createCustomerDto)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: createdCustomer,
    }
  }

  /**
   * update existing Customer
   *
   * @param updatedCustomerDto - Customer with updated attributes
   * @returns updatedCustomer - the updated Customer
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Customer updated successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Customer not found",
  })
  @Put("update")
  async update(
    @Body() updatedCustomerDto: UpdateCustomerDto,
  ): AsyncBaseResponse<CustomerDto> {
    const updatedCustomer = await this.customerService.update(
      updatedCustomerDto,
    )
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: updatedCustomer,
    }
  }

  /**
   * delete Customer from database
   *
   * @param customerId - the Customer to be deleted
   * @returns deletedCustomer - the deleted Customer
   */
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Customer deleted successfully",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Customer not found",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Customer ID not provided",
  })
  @Delete(":customerId")
  async delete(
    @Param(
      "customerId",
      new ParseIntPipe({
        exceptionFactory: () => {
          throw new GenericHttpException(
            "customerId is required & must be a number",
            HttpStatus.BAD_REQUEST,
          )
        },
      }),
    )
    customerId: CustomerDto["id"],
  ): AsyncBaseResponse<CustomerDto> {
    const deletedCustomer = await this.customerService.delete(customerId)
    return {
      validation: {
        message: "",
        statusCode: HttpStatus.OK,
      },
      data: deletedCustomer,
    }
  }
}
