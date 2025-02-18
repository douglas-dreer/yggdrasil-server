import { ICompany } from "../interface/company.interface";

export class CreateCompanyDto implements ICompany {
  name: string;
  document: string;
}
