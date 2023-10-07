import {
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AxiosError } from 'axios';

import { GraphQLError } from 'graphql';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: unknown) {
    const error = {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Occur Exception',
    };

    if (exception instanceof HttpException) {
      error.status = exception.getStatus();
      error.message = exception.message;
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
