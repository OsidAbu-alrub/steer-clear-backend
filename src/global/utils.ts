export const getValidDate = (date: unknown): Date | undefined => {
  if (typeof date === "string") {
    return new Date(date)
  }
  return undefined
}

export const toBase64String = (image: ArrayBuffer): string => {
  return !image ? null : Buffer.from(image).toString("base64")
}

export const fromBase64String = (base64String: string) => {
  return Buffer.from(base64String, "base64").toString()
}
