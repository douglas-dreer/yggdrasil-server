import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Company } from "./entity/company.entity";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { DuplicateDataException } from "../exceptions/duplicate-data.exception";
import { UpdateCompanyDto } from "./dto/update-company.dto";

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
  ) {}

  async listCompany(): Promise<Company[]> {
    return await this.companyRepository.find({ where: { deleted: false } });
  }

  async findById(id: string): Promise<Company> {
    const result = await this.companyRepository.findOne({ where: { id } });
    if (!result) {
      throw new NotFoundException(
        `Não foi possível encontrar a empresa com o id: ${id}`,
      );
    }
    return result;
  }

  async createCompany(data: CreateCompanyDto): Promise<Company> {
    await this.isCompanyIsValidForInsert(data);
    const entity: Company = this.companyRepository.create(data);
    return await this.companyRepository.save(entity);
  }

  async updateCompany(id: string, data: UpdateCompanyDto) {
    data.id = id;
    data.updated_at = new Date();
    await this.isCompanyIsValidForEdit(data);
    await this.companyRepository.update(id, data);
    return this.companyRepository.findOne({ where: { id } });
  }

  async removeCompany(id: string): Promise<void> {
    const entity: Company = await this.isCompanyIsValidForDelete(id);
    entity.deleted = true;
    entity.updated_at = new Date();
    await this.companyRepository.update(id, entity);
  }

  async isCompanyIsValidForInsert(data: CreateCompanyDto): Promise<void> {
    const { name, document } = data;
    await this.isNameRegistered(name);
    await this.isDocumentRegistered(document);
  }

  async isCompanyIsValidForEdit(data: UpdateCompanyDto): Promise<void> {
    const { id, name, document } = data;
    await this.isNameRegistered(name);
    await this.isDocumentRegistered(document);
    await this.isCompanyExist(id);
  }

  async isCompanyIsValidForDelete(id: string): Promise<Company> {
    const company: Company = await this.isCompanyExist(id);
    if (company.deleted) {
      throw new NotFoundException("Company is already deleted");
    }
    return company;
  }

  private async isNameRegistered(name: string): Promise<void> {
    if (await this.companyRepository.count({ where: { name: name } })) {
      throw new DuplicateDataException(`An name: ${name} already exist`);
    }
  }

  private async isDocumentRegistered(document: string): Promise<void> {
    if (await this.companyRepository.count({ where: { document: document } })) {
      throw new DuplicateDataException(
        `An document: ${document} already exists`,
      );
    }
  }

  private async isCompanyExist(id: string | undefined): Promise<Company> {
    const result: Company | null = await this.companyRepository.findOne({
      where: { id },
    });
    if (!result) {
      throw new NotFoundException(
        `Não foi encontrado nenhuma compania com o id: ${id}`,
      );
    }
    return result;
  }
}
