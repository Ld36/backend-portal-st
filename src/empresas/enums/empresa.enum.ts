export enum StatusEmpresa {
  PENDENTE = 'PENDENTE',
  APROVADO = 'APROVADO',
  REPROVADO = 'REPROVADO',
}

export enum TipoPessoa {
  FISICA = 'fisica',
  JURIDICA = 'juridica',
  ESTRANGEIRA = 'estrangeira',
}

export const PERFIS_VALIDOS = [
  'Despachante',
  'Beneficiário',
  'Consignatário',
  'Armador',
  'Agente de Carga',
  'Transportadora',
  'Novo usuário'
];