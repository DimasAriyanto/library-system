import {
  BadRequestException,
  PipeTransform,
  Injectable,
  ArgumentMetadata,
} from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

interface FormattedZodError {
  field: string;
  message: string;
}

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema<any>) {}

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return this.schema.parse(value);
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = this.formatZodError(error);
        throw new BadRequestException({
          message: [...formattedErrors, 'Invalid data provided'],
          error: 'Validation Failed',
        });
      }
      throw error;
    }
  }

  private formatZodError(error: ZodError): FormattedZodError[] {
    return error.errors.map((err) => {
      const field = err.path.join('.') || 'unknown';

      let message = err.message;

      switch (err.code) {
        case 'invalid_type':
          if (err.received === 'undefined') {
            message = `${field} is required`;
          } else {
            message = `${field} should be a ${err.expected}, but received ${err.received}`;
          }
          break;
        case 'too_small':
          if (err.type === 'string') {
            message = `${field} should be at least ${err.minimum} characters`;
          } else if (err.type === 'number') {
            message = `${field} should be at least ${err.minimum}`;
          }
          break;
        case 'too_big':
          if (err.type === 'string') {
            message = `${field} should be at most ${err.maximum} characters`;
          } else if (err.type === 'number') {
            message = `${field} should be at most ${err.maximum}`;
          }
          break;
      }

      return {
        field,
        message,
      };
    });
  }
}
