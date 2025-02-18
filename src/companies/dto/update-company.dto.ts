import { PartialType } from "@nestjs/mapped-types";
import { CreateCompanyDto } from "./create-company.dto";

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {
  id?: string;
  name: string;
  document: string;
  updated_at?: Date;
}
