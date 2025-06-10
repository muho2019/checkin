import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { ILike, Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';
import { SearchCompanyResponseDto } from '@companies/dto/search-company-response.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async findAll(name: string): Promise<SearchCompanyResponseDto[]> {
    const companies = await this.companyRepo.find({
      ...(name && { where: { name: ILike(`%${name}%`), isActive: true } }),
    });

    return companies.map((c) => ({
      id: c.id,
      name: c.name,
      industry: c.industry,
    }));
  }

  async findOne(name: string): Promise<Company | null> {
    return await this.companyRepo.findOne({
      where: { name },
    });
  }

  async findById(id: string): Promise<Company> {
    const company = await this.companyRepo.findOne({
      where: { id },
    });

    if (!company) {
      throw new NotFoundException('회사를 찾을 수 없습니다.');
    }

    return company;
  }

  async create(dto: CreateCompanyDto): Promise<Company> {
    const exists = await this.companyRepo.findOne({
      where: { name: dto.name },
    });

    if (exists) {
      throw new ConflictException('이미 존재하는 회사입니다.');
    }

    const company = this.companyRepo.create(dto);
    return this.companyRepo.save(company);
  }
}
