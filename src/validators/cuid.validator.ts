import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import cuid from "cuid";

@ValidatorConstraint({ async: false })
export class IsCuidConstraint implements ValidatorConstraintInterface {
  validate(id: any) {
    return cuid.isCuid(id);
  }

  defaultMessage() {
    return "Invalid CUID format";
  }
}

export function IsCuid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsCuidConstraint,
    });
  };
}
