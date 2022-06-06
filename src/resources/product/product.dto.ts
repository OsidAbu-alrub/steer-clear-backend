export default interface ProductDto {
  id: number
  productName: string
  description: string
  price: number
  vat: number
  stockable: boolean
  priceAfterVat: number
}

export type CreateProductDto = Omit<ProductDto, "id" | "priceAfterVat">

export type UpdateProductDto = Partial<Omit<ProductDto, "priceAfterVat">> & {
  id: ProductDto["id"]
}
