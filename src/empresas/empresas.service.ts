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

    async create(createEmpresaDto: CreateEmpresaDto, userType: string) {
      this.validarDocumento(createEmpresaDto.tipo_pessoa, createEmpresaDto.documento);

      const novaEmpresa = this.empresaRepository.create(createEmpresaDto);
      if (userType === 'interno') {
        if (!createEmpresaDto.responsavel_externo) {
          throw new BadRequestException('Usuário interno deve atribuir um responsável externo.');
        }
        novaEmpresa.status = 'APROVADO'; 
      } else {
        novaEmpresa.status = 'PENDENTE';
        novaEmpresa.responsavel_externo = null;
      }

      return await this.empresaRepository.save(novaEmpresa);
  }

  // private validarDocumento(tipo: string, documento: string) {
  //   if (tipo === 'Jurídica' && documento.length !== 14) {
  //     throw new BadRequestException('CNPJ fornecido inválido'); 
  //   }
  //   if (tipo === 'Física' && documento.length !== 11) {
  //     throw new BadRequestException('CPF inválido');
  //   }
  // }

  private validarDocumento(tipo: string, documento: string) {
      const docLimpo = documento.replace(/\D/g, '');
      const tipoNormalizado = tipo
        .trim()
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, "");

      if (tipoNormalizado === 'juridica') {
          if (docLimpo.length !== 14 || !this.validarCNPJ(docLimpo)) {
              throw new BadRequestException('CNPJ fornecido inválido'); 
          }
      } 
      else if (tipoNormalizado === 'fisica') {
          if (docLimpo.length !== 11 || !this.validarCPF(docLimpo)) {
              throw new BadRequestException('CPF inválido');
          }
      }
  }

  private validarCPF(cpf: string): boolean {
      if (/^(\d)\1+$/.test(cpf)) return false;
      let soma = 0, resto;
      for (let i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
      resto = (soma * 10) % 11;
      if ((resto === 10) || (resto === 11)) resto = 0;
      if (resto !== parseInt(cpf.substring(9, 10))) return false;
      soma = 0;
      for (let i = 1; i <= 10; i++) soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
      resto = (soma * 10) % 11;
      if ((resto === 10) || (resto === 11)) resto = 0;
      return resto === parseInt(cpf.substring(10, 11));
  }

  private validarCNPJ(cnpj: string): boolean {
      if (/^(\d)\1+$/.test(cnpj)) return false;
      let tamanho = cnpj.length - 2;
      let numeros = cnpj.substring(0, tamanho);
      let digitos = cnpj.substring(tamanho);
      let soma = 0, pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
          soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
          if (pos < 2) pos = 9;
      }
      let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      if (resultado !== parseInt(digitos.charAt(0))) return false;
      tamanho = tamanho + 1;
      numeros = cnpj.substring(0, tamanho);
      soma = 0;
      pos = tamanho - 7;
      for (let i = tamanho; i >= 1; i--) {
          soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
          if (pos < 2) pos = 9;
      }
      resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
      return resultado === parseInt(digitos.charAt(1));
  }
}