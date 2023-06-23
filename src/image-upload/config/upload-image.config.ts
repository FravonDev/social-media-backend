import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { memoryStorage } from 'multer';


export const uploadOptions: MulterOptions = {
    storage: memoryStorage(),
    fileFilter: (req: Request, file, callback) => {

        if (!file.originalname.match(/\.(jpg|jpeg|webp)$/)) {
            const except = new BadRequestException('Only JPG, JPEG or WEBP are alowed.')
            return callback(except, false);
        }

        callback(null, true);
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
}