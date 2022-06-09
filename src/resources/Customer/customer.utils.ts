import { Customer } from "@prisma/client"

export const isValidAttributes = (customer: Customer) => {
  return (
    customer.firstName &&
    customer.lastName &&
    customer.dateOfBirth &&
    customer.userId
  )
}
