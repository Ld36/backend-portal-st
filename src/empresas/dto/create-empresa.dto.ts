import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, IsBoolean, IsOptional, MinLength, ValidateIf } from 'class-validator';

export class CreateEmpresaDto {
  @IsNotEmpty({ message: 'O tipo de pessoa é obrigatório' })
  tipo_pessoa: string;

  @ValidateIf(o => o.tipo_pessoa === 'juridica')
  @IsNotEmpty({ message: 'A Razão Social é obrigatória para Pessoa Jurídica' })
  @IsString()
  razao_social?: string;

  @ValidateIf(o => o.tipo_pessoa !== 'juridica')
  @IsNotEmpty({ message: 'O Nome é obrigatório' })
  @IsString()
  nome?: string;

  @IsNotEmpty({ message: 'O documento (CPF/CNPJ) é obrigatório' })
  @IsString()
  @MinLength(3, { message: 'Mínimo de caracteres não atingido' }) 
  documento: string;

  @IsNotEmpty({ message: 'Nome fantasia é obrigatório' })
  @IsString()
  nome_fantasia: string;

  @IsNotEmpty({ message: 'Selecione um perfil para a empresa' })
  perfil: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  faturamento_direto: boolean;

  @IsOptional()
  @IsString()
  responsavel_externo?: string | null;
}