import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common"

@Injectable()
export class LogPipe implements PipeTransform {
  transform(value: unknown, _: ArgumentMetadata) {
    console.dir(value)
    console.log("====================")
    return value
  }
}
