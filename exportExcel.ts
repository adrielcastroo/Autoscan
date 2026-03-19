import XLSX from 'xlsx-js-style';
import type { Motor, Controle } from '../types';

// Cores para headers de diferentes grupos
const coresHeader = [
  'FFC000', // Laranja/Dourado
  '92D050', // Verde
  '00B0F0', // Azul claro
  'FF6B6B', // Vermelho coral
  'BF8F00', // Dourado escuro
  '7030A0', // Roxo
  '00B050', // Verde escuro
  'FF9933', // Laranja
  '0070C0', // Azul
  'FF66CC', // Rosa
];

function getEstiloHeader(indice: number) {
  const cor = coresHeader[indice % coresHeader.length];
  return {
    fill: { fgColor: { rgb: cor } },
    font: { bold: true, color: { rgb: indice >= 5 ? 'FFFFFF' : '000000' } },
  };
}

const estiloSerieFormatada = {
  fill: { fgColor: { rgb: 'FFFF00' } }, // Amarelo
};

export function exportarParaExcel(motores: Motor[], controles: Controle[]) {
  const workbook = XLSX.utils.book_new();
  
  // Cria planilha combinada - formato da imagem
  const dados: (string | null | { v: string; s: object })[][] = [];
  
  // Pega a primeira NF para o nome do arquivo
  const primeiraNotaFiscal = motores[0]?.notaFiscal || controles[0]?.notaFiscal || 'sem_nf';
  
  // ===== MOTORES =====
  // Agrupa motores por caixa + modelo
  const motoresPorCaixa = motores.reduce((acc, motor) => {
    const key = `${motor.caixa}|${motor.modelo}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(motor);
    return acc;
  }, {} as Record<string, Motor[]>);
  
  const gruposMotores = Object.entries(motoresPorCaixa);
  let contadorGrupos = 0;
  
  gruposMotores.forEach(([key, motoresGrupo], indexGrupo) => {
    const [caixa, modelo] = key.split('|');
    
    // Adiciona 2 linhas de espaçamento entre grupos (exceto o primeiro)
    if (indexGrupo > 0) {
      dados.push([null, null]);
      dados.push([null, null]);
    }
    
    // Linha do header do grupo: "CX01 1246344" | "séries"
    const estiloAtual = getEstiloHeader(contadorGrupos);
    dados.push([
      { v: `${caixa} ${modelo}`, s: estiloAtual },
      { v: 'séries', s: estiloAtual }
    ]);
    contadorGrupos++;
    
    // Linhas dos motores
    motoresGrupo.forEach((motor) => {
      // Coluna A: série bruta (modelo + B + série) - sem destaque
      const serieBruta = `${motor.modelo}B ${motor.serie}`;
      // Coluna B: série formatada completa - com destaque amarelo
      const serieFormatada = `${motor.caixa} NFe ${motor.notaFiscal} ${motor.serie}`;
      
      dados.push([
        serieBruta,
        { v: serieFormatada, s: estiloSerieFormatada }
      ]);
    });
  });
  
  // ===== CONTROLES =====
  // Agrupa controles por modelo + NF
  const controlesPorModelo = controles.reduce((acc, controle) => {
    const key = `${controle.modelo}|${controle.notaFiscal}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(controle);
    return acc;
  }, {} as Record<string, Controle[]>);
  
  const gruposControles = Object.entries(controlesPorModelo);
  
  gruposControles.forEach(([key, controlesGrupo], indexGrupo) => {
    const [modelo, notaFiscal] = key.split('|');
    
    // Adiciona 2 linhas de espaçamento entre grupos
    if (gruposMotores.length > 0 || indexGrupo > 0) {
      dados.push([null, null]);
      dados.push([null, null]);
    }
    
    // Linha do header do grupo
    const estiloAtual = getEstiloHeader(contadorGrupos);
    dados.push([
      { v: `${modelo} ${notaFiscal}`, s: estiloAtual },
      { v: 'séries', s: estiloAtual }
    ]);
    contadorGrupos++;
    
    // Linhas dos controles
    controlesGrupo.forEach((controle) => {
      // Coluna A: série bruta
      const serieBruta = controle.serieBruta;
      // Coluna B: série formatada
      const serieFormatada = `${controle.modelo} NFe ${controle.notaFiscal} ${controle.serieFormatada}*${controle.sequencia}`;
      
      dados.push([
        serieBruta,
        { v: serieFormatada, s: estiloSerieFormatada }
      ]);
    });
  });
  
  const worksheet = XLSX.utils.aoa_to_sheet(dados);
  
  // Define larguras das colunas
  worksheet['!cols'] = [
    { wch: 35 }, // Coluna A - série bruta
    { wch: 45 }, // Coluna B - séries formatadas
  ];
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Cadastros');
  
  // Nome do arquivo: "Motores NFe [número da nota fiscal]"
  const nomeArquivo = `Motores NFe ${primeiraNotaFiscal}.xlsx`;
  
  // Faz download
  XLSX.writeFile(workbook, nomeArquivo);
}
