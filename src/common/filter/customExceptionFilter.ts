import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AxiosError } from 'axios';

import { GraphQLError } from 'graphql';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const error = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Occur Exception',
    };

    if (exception instanceof HttpException) {
      error.status = exception.getStatus();
      error.message = exception.message;
      if (exception.message === 'Cannot GET /favicon.ico') {
        response.status(200).send();
        return;
      }
    } else if (exception instanceof AxiosError) {
      error.status = exception.response.status;
      error.message = exception.response.data.message;
    }

    console.log(exception);

    throw new GraphQLError(error.message, {
      extensions: { code: error.status },
    });
  }
}
