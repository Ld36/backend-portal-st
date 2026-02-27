import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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

  @Column({ unique: true })
  documento: string;

  @Column()
  nome_fantasia: string;

  @Column()
  perfil: string;

  @Column({ default: false })
  faturamento_direto: boolean;

  @Column({ default: 'PENDENTE' })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  responsavel_externo: string | null;
}