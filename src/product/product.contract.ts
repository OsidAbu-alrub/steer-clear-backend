import ProductDto from "./product.dto"

// this resembles the contract that the
// service files should follow for product resource
export default interface ProductContract {
  createProduct(
    productName: ProductDto["productName"],
  ): Promise<ProductDto["productId"]>
  getAllProducts(): Promise<Array<ProductDto>>
  findProduct(productId: ProductDto["productId"]): Promise<ProductDto>
}
