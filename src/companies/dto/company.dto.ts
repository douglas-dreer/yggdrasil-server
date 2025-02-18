import { ICompany } from "../interface/company.interface";
import { IsCuid } from "../../validators/cuid.validator";

export class CompanyDto implements ICompany {
  @IsCuid({ message: "Invalid user ID format" })
  id?: string;
  name?: string;
  document?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted?: boolean;
}
