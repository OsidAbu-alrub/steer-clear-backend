export default interface IMapper<
  DtoType,
  ModelType,
  ToModelReturnType = ModelType,
  ToDtoReturnType = DtoType,
> {
  toModel(dto: DtoType): ToModelReturnType
  toDto(model: ModelType): ToDtoReturnType
}
