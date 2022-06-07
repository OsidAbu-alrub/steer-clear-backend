import { Stock } from "@prisma/client"
import { StockDto, CreateStockDto, UpdateStockDto } from "./stock.dto"

export default interface StockContract {
  retrieve(stockDto?: Partial<StockDto>): Promise<Array<StockDto>>
  create(createStockDto: CreateStockDto): Promise<StockDto>
  update(updateStockDto: UpdateStockDto): Promise<StockDto>
  delete(stockId: StockDto["id"]): Promise<StockDto>
  retrieveProductQuantity(productId: StockDto["productId"]): Promise<number>
  fromCreateDto(createStockDto: CreateStockDto): Stock
  fromUpdateDto(updateStockDto: UpdateStockDto): Stock
  fromDto(stockDto: Stock): StockDto
  fromModel(stock: StockDto): Stock
}
