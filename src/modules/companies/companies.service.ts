import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { CreateCompanyDto } from './dto/create-company.dto';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  async findAll(): Promise<Company[]> {
    return this.companyRepo.find();
  }

  async findOne(name: string): Promise<Company> {
    const company = await this.companyRepo.findOne({
      where: { name },
    });

    if (!company) {
      throw new NotFoundException('회사를 찾을 수 없습니다.');
    }

    return company;
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
