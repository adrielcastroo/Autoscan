export interface Motor {
  id: string;
  tipo: 'motor';
  caixa: string;
  modelo: string;
  notaFiscal: string;
  serie: string;
  criadoEm: Date;
}

export interface Controle {
  id: string;
  tipo: 'controle';
  modelo: string;
  notaFiscal: string;
  serieBruta: string;
  serieFormatada: string;
  sequencia: number;
  criadoEm: Date;
}

export type Item = Motor | Controle;
