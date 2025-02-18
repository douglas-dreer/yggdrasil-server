import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  Res,
} from "@nestjs/common";
import { CompaniesService } from "./companies.service";
import { CreateCompanyDto } from "./dto/create-company.dto";
import { CompanyDto } from "./dto/company.dto";
import { Response } from "express";
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from "@nestjs/swagger";
import { Company } from "./entity/company.entity";
import { UpdateCompanyDto } from "./dto/update-company.dto";
import {ResponseDto} from "./dto/response.dto";

@Controller("companies")
export class CompaniesController {
  constructor(private readonly companyService: CompaniesService) {}

  @Get()
  @ApiOperation({ summary: "Get all companies" })
  @ApiResponse({
    status: 200,
    description: "List of all companys",
    type: [CompanyDto],
    example: {
      "application/json": [
        {
          id: "kihuia80ibqlttwaka23gvpj",
          name: "Johnston, Strosin and Morissette",
          document: "z",
          created_at: "2025-02-18T17:00:00.247Z",
          updated_at: null,
          deleted: false,
        },
        {
          id: "a9voe53i8jag7qoh7oc372mv",
          name: "Collins - Huel",
          document: "411",
          created_at: "2025-02-18T17:02:37.106Z",
          updated_at: null,
          deleted: false,
        },
      ],
    },
  })
  async listAllCompany(@Res() res: Response): Promise<Response<CompanyDto[]>> {
    const resultList: Company[] = await this.companyService.listCompany();
    return res
      .status(HttpStatus.OK)
      .json(this.mapEntityListToDTOList(resultList));
  }

  @Get(":id")
  @ApiOperation({ summary: "Get company by id" })
  @ApiParam({ name: "id", type: String })
  @ApiResponse({
    status: 200,
    description: "Company details",
    type: CompanyDto,
    example: {
      "application/json": {
        id: "kihuia80ibqlttwaka23gvpj",
        name: "Johnston, Strosin and Morissette",
        document: "z",
        created_at: "2025-02-18T17:00:00.247Z",
        updated_at: null,
        deleted: false,
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Company not found",
    type: NotFoundException,
    example: {
      "application/json": {
        message: "No company found with the id: 99",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  async getCompanyById(
    @Param("id")
    id: string,
    @Res() res: Response,
  ): Promise<Response<CompanyDto>> {
    const result: CompanyDto = (await this.companyService.findById(id)).toDTO();
    return res.status(HttpStatus.OK).json(result);
  }

  @Post()
  @ApiOperation({ summary: "Create a new company" })
  @ApiBody({
    type: CreateCompanyDto,
    examples: {
      valided: {
        summary: "Valid company request",
        description: "An example of a valid company creation request",
        value: {
          name: "Sony S/A",
          document: "1234567890",
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: "Company successfully created",
    type: CompanyDto,
    example: {
      "application/json": {
        id: "zpr7578g6p7314x0x568eu3i",
        name: "Sony S/A",
        document: "1234567890",
        created_at: "2025-02-18T04:40:34.671Z",
        deleted: false,
        updated_at: null,
      },
    },
  })
  async createCompany(
    @Body() company: CreateCompanyDto,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<Response<CompanyDto>> {
    const result = await this.companyService.createCompany(company);
    return res
      .status(HttpStatus.CREATED)
      .location(this.createURI(result.id, req))
      .json(result?.toDTO());
  }

  @Put(":id")
  @ApiOperation({ summary: "Update company details" })
  @ApiParam({ name: "id", description: "Company ID" })
  @ApiBody({
    type: UpdateCompanyDto,
    examples: {
      validPayload: {
        summary: "Valid company request",
        description: "An example of a valid company update request",
        value: {
          name: "Microsoft S/A",
          document: "756348694",
        },
      },
      invalidPayload: {
        summary: "Invalid company request",
        description: "An example of a invalid payload, email already",
        value: {
          name: "Microsoft S/A",
          document: "32",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Company updated successfully",
    type: CompanyDto,
    example: {
      "application/json": {
        name: "Microsoft",
        document: "32",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Company not found",
    type: CompanyDto,
    example: {
      "application/json": {
        statusCode: 400,
        message:
          "A company with the email 'email@email.com.br' already exists.",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "company not found",
    type: CompanyDto,
    example: {
      "application/json": {
        message: "Não foi encontrado nenhuma compania com o id: 1",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  async updateCompany(
    @Param("id") id: string,
    @Body() data: UpdateCompanyDto,
    @Res() res: Response,
  ): Promise<Response<CompanyDto>> {
    const result = await this.companyService.updateCompany(id, data);
    return res.status(HttpStatus.OK).json(result);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Delete a company" })
  @ApiParam({ name: "id", description: "company ID" })
  @ApiResponse({ status: 200, description: "company successfully deleted" })
  @ApiResponse({
    status: 404,
    description: "company not found",
    type: CompanyDto,
    example: {
      "application/json": {
        message: "No company found with the id: 99",
        error: "Not Found",
        statusCode: 404,
      },
    },
  })
  async delete(@Param("id") id: string, @Res() res: Response<ResponseDto>) {
    await this.companyService.removeCompany(id);
    return res.status(HttpStatus.OK).json( new ResponseDto(200, "Company has deleted with successful"));
  }

  private mapEntityListToDTOList(list: Company[]): CompanyDto[] {
    return list.map((company: Company) => company.toDTO());
  }
  private createURI(id: string, req: Request): string {
    return `${req.url}/${id}`;
  }
}
