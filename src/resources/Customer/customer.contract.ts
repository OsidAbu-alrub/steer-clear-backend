import { Customer } from "@prisma/client"
import {
  CustomerDto,
  CreateCustomerDto,
  UpdateCustomerDto,
} from "./customer.dto"

export default interface CustomerContract {
  retrieve(customerDto: Partial<CustomerDto>): Promise<Array<CustomerDto>>
  create(createCustomerDto: CreateCustomerDto): Promise<CustomerDto>
  update(updateCustomerDto: UpdateCustomerDto): Promise<CustomerDto>
  delete(customerId: CustomerDto["id"]): Promise<CustomerDto>
  fromCreateDto(createCustomerDto: CreateCustomerDto): Customer
  fromUpdateDto(updateCustomerDto: UpdateCustomerDto): Customer
  fromDto(customerDto: CustomerDto): Customer
  fromModel(customer: Customer): CustomerDto
}
