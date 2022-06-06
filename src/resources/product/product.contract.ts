import { Product } from "@prisma/client"
import ProductDto, { CreateProductDto, UpdateProductDto } from "./product.dto"

// this resembles the contract that the
// service files should follow for product resource
export default interface ProductContract {
  createProduct(productName: CreateProductDto): Promise<ProductDto["id"]>
  getAllProducts(): Promise<Array<ProductDto>>
  findProduct(productId: ProductDto["id"]): Promise<ProductDto>
  updateProduct(productDto: UpdateProductDto): Promise<ProductDto>
  deleteProduct(productId: ProductDto["id"]): Promise<ProductDto>
  toModel(productDto: ProductDto): Product
  toDto(product: Product): ProductDto
}
