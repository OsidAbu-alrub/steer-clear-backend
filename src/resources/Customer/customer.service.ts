import { HttpStatus, Injectable } from "@nestjs/common"
import { Customer } from "@prisma/client"
import { GenericHttpException } from "src/exception/GenericHttpException"
import { PrismaService } from "src/prisma/prisma.service"
import CustomerContract from "./customer.contract"
import {
  CreateCustomerDto,
  CustomerDto,
  RetrieveCustomerDto,
  UpdateCustomerDto,
} from "./customer.dto"
import { isValidAttributes } from "./customer.utils"

@Injectable()
export class CustomerService implements CustomerContract {
  constructor(private readonly prismaService: PrismaService) {}

  async retrieve(
    customerDto: RetrieveCustomerDto = {},
  ): Promise<Array<CustomerDto>> {
    const customerModel = this.fromDto(customerDto)
    const customers = await this.prismaService.customer.findMany({
      where: {
        firstName: {
          contains: customerModel.firstName,
        },
        lastName: {
          contains: customerModel.lastName,
        },
        dateOfBirth: {
          equals: customerModel.dateOfBirth,
        },
        id: {
          equals: customerModel.id,
        },
        userId: {
          equals: customerModel.userId,
        },
      },
    })
    return customers.map(this.fromModel)
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDto> {
    const customer = this.fromCreateDto(createCustomerDto)
    if (!isValidAttributes(customer)) {
      throw new GenericHttpException(
        "first name, last name, date of birth, and userId are required",
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.prismaService.user.findUnique({
      where: {
        id: customer.userId,
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          `User with ID ${customer.userId} doesn't exist`,
          HttpStatus.NOT_FOUND,
        )
      },
    })

    const userAlreadyExists = Boolean(
      await this.prismaService.customer.findUnique({
        where: {
          userId: customer.userId,
        },
      }),
    )

    if (userAlreadyExists)
      throw new GenericHttpException(
        `user with ID ${customer.userId} already linked to a customer`,
        HttpStatus.BAD_REQUEST,
      )

    const createdCustomer = await this.prismaService.customer.create({
      data: customer,
    })
    return this.fromModel(createdCustomer)
  }

  async update(updateCustomerDto: UpdateCustomerDto): Promise<CustomerDto> {
    const customer = this.fromUpdateDto(updateCustomerDto)

    await this.prismaService.customer.findUnique({
      where: {
        id: customer.id,
      },
      rejectOnNotFound: () => {
        throw new GenericHttpException(
          `Customer with ID ${updateCustomerDto.id} not found`,
          HttpStatus.NOT_FOUND,
        )
      },
    })

    const updatedCustomer = await this.prismaService.customer.update({
      where: {
        id: customer.id,
      },
      data: customer,
    })
    return this.fromModel(updatedCustomer)
  }

  async delete(customerId: CustomerDto["id"]): Promise<CustomerDto> {
    await this.prismaService.customer.findUnique({
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

    const deletedCustomer = await this.prismaService.customer.delete({
      where: {
        id: customerId,
      },
    })
    return this.fromModel(deletedCustomer)
  }

  /************** UTILITY METHODS **************/
  fromCreateDto(createCustomerDto: CreateCustomerDto): Customer {
    return {
      dateOfBirth: createCustomerDto.dateOfBirth
        ? new Date(createCustomerDto.dateOfBirth)
        : undefined,
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
      id: undefined,
      userId: createCustomerDto.userId,
    }
  }
  fromUpdateDto(updateCustomerDto: UpdateCustomerDto): Customer {
    return {
      dateOfBirth: updateCustomerDto.dateOfBirth
        ? new Date(updateCustomerDto.dateOfBirth)
        : undefined,
      firstName: updateCustomerDto.firstName,
      lastName: updateCustomerDto.lastName,
      id: updateCustomerDto.id,
      userId: updateCustomerDto.userId,
    }
  }
  fromDto(customerDto: Partial<CustomerDto>): Customer {
    return {
      dateOfBirth: customerDto.dateOfBirth
        ? new Date(customerDto.dateOfBirth)
        : undefined,
      firstName: customerDto.firstName,
      lastName: customerDto.lastName,
      id: customerDto.id,
      userId: customerDto.userId,
    }
  }
  fromModel(customer: Customer): CustomerDto {
    return {
      dateOfBirth: customer.dateOfBirth.toISOString(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      id: customer.id,
      userId: customer.userId,
    }
  }
}
