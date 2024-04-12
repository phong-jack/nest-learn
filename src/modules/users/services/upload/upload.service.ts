import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const oneKb = 1000;
    const oneMb = oneKb * 1000;
    if (value.size < oneMb) {
      return metadata;
    } else {
      return false;
    }
  }
}
