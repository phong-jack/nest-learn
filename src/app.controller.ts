import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}

  @Get('')
  helloWorld() {
    return 'Hello world!';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.cloudinaryService.uploadFile(file);
  }

  // @Post('uploads')
  // @UseInterceptors(FilesInterceptor('file[]', 5))
  // uploadImages(@UploadedFiles() files) {
  //   console.log('Check file: ', files);
  //   return 'OKE';
  // }

  @Post('uploads')
  @UseInterceptors(FilesInterceptor('photos', 5))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    return this.cloudinaryService.uploadFiles(files);
  }
}
