import { Customer } from "@prisma/client"
import { HttpStatus, Injectable } from "@nestjs/common"
import { PrismaService } from "src/prisma/prisma.service"
import CustomerContract from "./customer.contract"
import {
  CustomerDto,
  CreateCustomerDto,
  UpdateCustomerDto,
  RetrieveCustomerDto,
} from "./customer.dto"
import { GenericHttpException } from "src/exception/GenericHttpException"

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
      },
    })
    return customers.map(this.fromModel)
  }

  async create(createCustomerDto: CreateCustomerDto): Promise<CustomerDto> {
    const customer = this.fromCreateDto(createCustomerDto)
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
      dateOfBirth: new Date(createCustomerDto.dateOfBirth),
      firstName: createCustomerDto.firstName,
      lastName: createCustomerDto.lastName,
      id: undefined,
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
    }
  }
  fromModel(customer: Customer): CustomerDto {
    return {
      dateOfBirth: customer.dateOfBirth.toISOString(),
      firstName: customer.firstName,
      lastName: customer.lastName,
      id: customer.id,
    }
  }
}
