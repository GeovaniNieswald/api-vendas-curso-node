import crypto from 'crypto';
import multer from 'multer';
import path from 'path';

interface IUploadConfig {
  driver: 'disk' | 's3';
  tmpFolder: string;
  directory: string;
  multer: {
    storage: multer.StorageEngine;
  };
  config: {
    aws: {
      bucket: string;
    };
  };
}

const uploadFolder = path.resolve(__dirname, '..', '..', 'uploads');
const tmpFolder = path.resolve(__dirname, '..', '..', 'temp');

export default {
  driver: process.env.STORAGE_DRIVER,
  directory: uploadFolder,
  tmpFolder,
  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('hex');

        const filename = `${fileHash}-${file.originalname}`;

        callback(null, filename);
      },
    }),
  },
  config: {
    aws: {
      bucket: process.env.STORAGE_AWS_BUCKET,
    },
  },
} as IUploadConfig;
