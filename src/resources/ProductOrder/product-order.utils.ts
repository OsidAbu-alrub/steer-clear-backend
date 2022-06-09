import { ProductOrderDto } from "./product-order.dto"

export const calculateTotal = (
  receipt: Pick<ProductOrderDto, "quantity" | "vat" | "price">,
) => {
  const { quantity, vat, price } = receipt
  return price
    ?.mul(vat ?? 0)
    .add(price ?? 0)
    .mul(quantity ?? 0)
    .toDecimalPlaces(2)
}

export const isEnoughStock = (orderedQuantity: number, stockQuantity: number) =>
  orderedQuantity <= stockQuantity
