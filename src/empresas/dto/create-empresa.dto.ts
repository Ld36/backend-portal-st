import { IsNotEmpty, IsString, IsBoolean, IsOptional, MinLength } from 'class-validator';

export class CreateEmpresaDto {
  @IsNotEmpty({ message: 'O tipo de pessoa é obrigatório' })
  tipo_pessoa: string;

  @IsOptional()
  @IsString()
  razao_social?: string;

  @IsOptional()
  @IsString()
  nome?: string;

  @IsNotEmpty({ message: 'O documento (CPF/CNPJ) é obrigatório' })
  @IsString()
  @MinLength(3, { message: 'Mínimo de caracteres não atingido' }) 
  documento: string;

  @IsNotEmpty({ message: 'Nome fantasia é obrigatório' })
  nome_fantasia: string;

  @IsNotEmpty({ message: 'Selecione um perfil para a empresa' })
  perfil: string;

  @IsOptional()
  @IsBoolean()
  faturamento_direto: boolean;
}