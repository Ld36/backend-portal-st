import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { EncryptionTransformer } from '../../common/encryption/encryption.transformer';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  tipo_pessoa: string;

  @Column({ nullable: true })
  razao_social: string;

  @Column({ nullable: true })
  nome: string;

  @Column({ 
    unique: true,
    transformer: new EncryptionTransformer()
  })
  documento: string;

  @Column({ nullable: true })
  nome_fantasia: string;

  @Column()
  perfil: string;

  @Column({ default: false })
  faturamento_direto: boolean;

  @Column({ default: 'PENDENTE' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  responsavel_externo: string | null;

  @Column({ nullable: true })
  observacao_reprovacao: string;
}