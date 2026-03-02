import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { CreateEmpresaDto } from './dto/create-empresa.dto';
import { DocumentValidator } from './utils/document-validator';
import { TipoPessoa, StatusEmpresa, PERFIS_VALIDOS } from './enums/empresa.enum';
import { generateHash } from '../common/encryption/hash.util';

@Injectable()
export class EmpresasService {
  constructor(
    @InjectRepository(Empresa)
    private readonly repository: Repository<Empresa>,
  ) {}

  async create(dto: CreateEmpresaDto, userType: string) {
    this.processBusinessRules(dto);

    const empresa = this.repository.create({
      ...dto,
      documento_hash: generateHash(dto.documento)
    });

    if (userType === 'interno') {
      this.handleInternalCreation(empresa, dto.responsavel_externo ?? '');
    } else {
      this.handleExternalCreation(empresa);
    }

    return await this.repository.save(empresa);
  }

  private processBusinessRules(dto: CreateEmpresaDto) {
    const tipo = DocumentValidator.normalize(dto.tipo_pessoa);
    const doc = dto.documento;
    
    if (!dto.perfil) {
      throw new BadRequestException('Selecione um perfil para a empresa');
    }
    if (!PERFIS_VALIDOS.includes(dto.perfil)) {
      throw new BadRequestException('Ocorreu um erro ao encontrar o perfil'); // Modal M03
    }
    if (tipo === TipoPessoa.JURIDICA && !DocumentValidator.isCnpjValid(dto.documento)) {
      throw new BadRequestException('CNPJ fornecido inválido'); 
    }
    if (tipo === TipoPessoa.FISICA && !DocumentValidator.isCpfValid(dto.documento)) {
      throw new BadRequestException('CPF inválido'); 
    }
    if (tipo === TipoPessoa.ESTRANGEIRA && !DocumentValidator.isForeignIdValid(doc)) {
      throw new BadRequestException('Identificação estrangeira inválida');
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
    async update(id: number, dto: Partial<CreateEmpresaDto>) {
      const empresa = await this.repository.findOneBy({ id });
      if (!empresa) throw new BadRequestException('Empresa não encontrada');

      Object.assign(empresa, dto);
      
      await this.repository.save(empresa);
      return { message: 'Empresa atualizada com sucesso' }; 
  }

  async reprovar(id: number, motivo: string) {
      const empresa = await this.repository.findOneBy({ id });
      if (!empresa) throw new BadRequestException('Empresa não encontrada');

      empresa.status = StatusEmpresa.REPROVADO;
      empresa.observacao_reprovacao = motivo;

      await this.repository.save(empresa);
      return { message: 'Empresa reprovada com sucesso' }; 
  }

  async aprovar(id: number, responsavel: string) {
      const empresa = await this.repository.findOneBy({ id });
      if (!empresa) throw new BadRequestException('Empresa não encontrada');

      empresa.status = StatusEmpresa.APROVADO;
      empresa.responsavel_externo = responsavel;

      await this.repository.save(empresa);
      return { message: 'Empresa aprovada com sucesso' }; 
  }

  async getDashboardStats() {
      const total = await this.repository.count();
      const aprovadas = await this.repository.countBy({ status: StatusEmpresa.APROVADO });
      const pendentes = await this.repository.countBy({ status: StatusEmpresa.PENDENTE });
      const reprovadas = await this.repository.countBy({ status: StatusEmpresa.REPROVADO });

      return { total, aprovadas, pendentes, reprovadas };
  }
  async findByDocumento(documento: string) {
    const documentoHash = generateHash(documento);
    
    // Busca primeiro pelo hash (método novo e eficiente)
    let empresa = await this.repository.findOne({ 
      where: { documento_hash: documentoHash } 
    });
    
    // Se não encontrou pelo hash, busca por todas e compara descriptografado (fallback)
    if (!empresa) {
      const empresas = await this.repository.find();
      empresa = empresas.find(e => e.documento === documento) || null;
      
      // Se encontrou, atualiza o hash para futuras buscas
      if (empresa && !empresa.documento_hash) {
        empresa.documento_hash = documentoHash;
        await this.repository.save(empresa);
      }
    }
    
    return empresa;
  }
}