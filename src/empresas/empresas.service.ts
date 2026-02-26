import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async create(createEmpresaDto: CreateEmpresaDto, userType: 'interno' | 'externo') {
    this.validarDocumento(createEmpresaDto.tipo_pessoa, createEmpresaDto.documento);
    const novaEmpresa = this.empresaRepository.create(createEmpresaDto);

    if (userType === 'interno') {
      novaEmpresa.status = 'APROVADO';
    } else {
      novaEmpresa.status = 'PENDENTE';
    }

    return await this.empresaRepository.save(novaEmpresa);
  }

  private validarDocumento(tipo: string, documento: string) {
    if (tipo === 'Jurídica' && documento.length !== 14) {
      throw new BadRequestException('CNPJ fornecido inválido'); 
    }
    if (tipo === 'Física' && documento.length !== 11) {
      throw new BadRequestException('CPF inválido');
    }
  }
}