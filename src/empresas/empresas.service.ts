import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
// Importações necessárias para resolver os erros:
import { DocumentValidator } from './utils/document-validator';
import { TipoPessoa, StatusEmpresa } from './enums/empresa.enum';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly repository: Repository<Empresa>,
  ) {}

  async create(dto: CreateEmpresaDto, userType: string) {
    this.processBusinessRules(dto);

    const empresa = this.repository.create(dto);

    if (userType === 'interno') {
      this.handleInternalCreation(empresa, dto.responsavel_externo ?? '');
    } else {
      this.handleExternalCreation(empresa);
    }

    return await this.repository.save(empresa);
  }

  private processBusinessRules(dto: CreateEmpresaDto) {
    const tipo = DocumentValidator.normalize(dto.tipo_pessoa);
    
    if (tipo === TipoPessoa.JURIDICA && !DocumentValidator.isCnpjValid(dto.documento)) {
      throw new BadRequestException('CNPJ fornecido inválido'); 
    }
    if (tipo === TipoPessoa.FISICA && !DocumentValidator.isCpfValid(dto.documento)) {
      throw new BadRequestException('CPF inválido'); 
    }
  }

  private handleInternalCreation(empresa: Empresa, responsavel?: string) {
    if (!responsavel || responsavel === '') {
      throw new BadRequestException('Responsável obrigatório para cadastro interno');
    }
    empresa.status = StatusEmpresa.APROVADO; 
    empresa.responsavel_externo = responsavel;
  }

  private handleExternalCreation(empresa: Empresa) {
    empresa.status = StatusEmpresa.PENDENTE; 
    empresa.responsavel_externo = null;
  }

  async findAll() {
    return await this.repository.find();
  }
}