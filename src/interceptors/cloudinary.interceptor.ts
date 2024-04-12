import { Injectable, NestInterceptor, Type, mixin } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

interface CloudinaryInterceptorOptions {
  fieldName: string;
  path?: string;
}

function CloudinaryInterceptor(
  options: CloudinaryInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configSerivce: ConfigService) {
      const fileDestination = configSerivce.get('UPLOADED_FILES_DESTINATION');
      const destination = `${fileDestination}${options.path}`;
      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
        }),
      };
      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions,
      ))();
    }
    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default CloudinaryInterceptor;
