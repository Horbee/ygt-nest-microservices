import { v2 } from 'cloudinary';
import { Readable } from 'stream';

import { Injectable } from '@nestjs/common';

import type { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      Readable.from(file.buffer).pipe(upload);
    });
  }

  async deleteImage(
    publicId: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      return v2.uploader.destroy(publicId, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  }
}
