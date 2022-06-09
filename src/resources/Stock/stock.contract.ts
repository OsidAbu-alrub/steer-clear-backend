import {
  CreateStockDto,
  RetrieveStockDto,
  StockDto,
  UpdateStockDto,
} from "./stock.dto"

export default interface StockContract {
  retrieve(retrieveStockDto: RetrieveStockDto): Promise<Array<StockDto>>
  create(createStockDto: CreateStockDto): Promise<StockDto>
  update(updateStockDto: UpdateStockDto): Promise<StockDto>
  delete(stockId: StockDto["id"]): Promise<StockDto>
}
