import { HttpException, HttpStatus } from '@nestjs/common';

export class MissingDataException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: ['At least one of the following properties must be provided: text or image, or both.'],
        error: 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
    this.name = 'MissingContentException';
  }
}
