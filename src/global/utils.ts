export const getValidDate = (date: unknown): Date | undefined => {
  if (typeof date === "string") {
    return new Date(date)
  }
  return undefined
}
