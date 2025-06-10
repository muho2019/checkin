import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { SearchCompanyResponseDto } from '@companies/dto/search-company-response.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Get()
  async findAll(
    @Query('name') name: string,
  ): Promise<SearchCompanyResponseDto[]> {
    return this.companiesService.findAll(name);
  }

  @Post()
  async create(@Body() dto: CreateCompanyDto): Promise<Company> {
    return this.companiesService.create(dto);
  }
}
