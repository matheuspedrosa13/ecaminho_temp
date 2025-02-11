import { BadRequestException, ValidationError } from '@nestjs/common';

export function customExceptionFactory(errors: ValidationError[]) {
  if (errors.length && Array.isArray(errors)) {
    const validationErrors = extractError(errors);

    return new BadRequestException({
      errors: validationErrors,
    });
  }

  return new BadRequestException();
}

function extractError(errors: ValidationError[]) {
  const validationErrors = {};

  for (const error of errors) {
    const property = error.property;
    if (error.constraints) {
      Object.entries(error.constraints).forEach(([, message]) => {
        if (!Array.isArray(validationErrors[property]))
          validationErrors[property] = [];

        validationErrors[property].push(message);
      });
    } else if (error.children && error.children.length > 0) {
      validationErrors[property] = extractError(error.children);
    }
  }

  return validationErrors;
}
