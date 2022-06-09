import {
  CreateProductOrderDto,
  DeleteProductOrderDto,
  ProductOrderDto,
  RetrieveProductOrderDto,
} from "./product-order.dto"

export default interface ProductOrderContract {
  retrieve(
    productOrderDto?: RetrieveProductOrderDto,
  ): Promise<Array<ProductOrderDto>>
  create(
    createProductOrderDtos: CreateProductOrderDto,
  ): Promise<ProductOrderDto>
  delete(deleteProductOrderDto: DeleteProductOrderDto): Promise<ProductOrderDto>
}
