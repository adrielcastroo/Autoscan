import type { Motor, Controle } from '../types';
import { ScrollArea } from '@/react-app/components/ui/scroll-area';

interface ExcelPreviewProps {
  motores: Motor[];
  controles: Controle[];
}

const coresHeader = [
  '#FFC000', '#92D050', '#00B0F0', '#FF6B6B', '#BF8F00',
  '#7030A0', '#00B050', '#FF9933', '#0070C0', '#FF66CC',
];

export function ExcelPreview({ motores, controles }: ExcelPreviewProps) {
  // Agrupa motores por caixa + modelo
  const motoresPorCaixa = motores.reduce((acc, motor) => {
    const key = `${motor.caixa}|${motor.modelo}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(motor);
    return acc;
  }, {} as Record<string, Motor[]>);

  // Agrupa controles por modelo + NF
  const controlesPorModelo = controles.reduce((acc, controle) => {
    const key = `${controle.modelo}|${controle.notaFiscal}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(controle);
    return acc;
  }, {} as Record<string, Controle[]>);

  const gruposMotores = Object.entries(motoresPorCaixa);
  const gruposControles = Object.entries(controlesPorModelo);
  let contadorGrupos = 0;

  if (motores.length === 0 && controles.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum dado para visualizar</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <tbody>
            {/* Motores */}
            {gruposMotores.map(([key, motoresGrupo], indexGrupo) => {
              const [caixa, modelo] = key.split('|');
              const corHeader = coresHeader[contadorGrupos % coresHeader.length];
              const corTexto = contadorGrupos >= 5 ? '#FFFFFF' : '#000000';
              contadorGrupos++;
              
              return (
                <React.Fragment key={key}>
                  {indexGrupo > 0 && (
                    <>
                      <tr><td colSpan={2} className="h-2"></td></tr>
                      <tr><td colSpan={2} className="h-2"></td></tr>
                    </>
                  )}
                  <tr>
                    <td 
                      className="px-3 py-1.5 font-bold border border-border/50"
                      style={{ backgroundColor: corHeader, color: corTexto }}
                    >
                      {caixa} {modelo}
                    </td>
                    <td 
                      className="px-3 py-1.5 font-bold border border-border/50"
                      style={{ backgroundColor: corHeader, color: corTexto }}
                    >
                      séries
                    </td>
                  </tr>
                  {motoresGrupo.map((motor) => (
                    <tr key={motor.id}>
                      <td className="px-3 py-1.5 font-mono text-xs border border-border/50 bg-card">
                        {motor.modelo}B {motor.serie}
                      </td>
                      <td 
                        className="px-3 py-1.5 font-mono text-xs border border-border/50"
                        style={{ backgroundColor: '#FFFF00', color: '#000000' }}
                      >
                        {motor.caixa} NFe {motor.notaFiscal} {motor.serie}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}

            {/* Controles */}
            {gruposControles.map(([key, controlesGrupo], indexGrupo) => {
              const [modelo, notaFiscal] = key.split('|');
              const corHeader = coresHeader[contadorGrupos % coresHeader.length];
              const corTexto = contadorGrupos >= 5 ? '#FFFFFF' : '#000000';
              contadorGrupos++;
              
              return (
                <React.Fragment key={key}>
                  {(gruposMotores.length > 0 || indexGrupo > 0) && (
                    <>
                      <tr><td colSpan={2} className="h-2"></td></tr>
                      <tr><td colSpan={2} className="h-2"></td></tr>
                    </>
                  )}
                  <tr>
                    <td 
                      className="px-3 py-1.5 font-bold border border-border/50"
                      style={{ backgroundColor: corHeader, color: corTexto }}
                    >
                      {modelo} {notaFiscal}
                    </td>
                    <td 
                      className="px-3 py-1.5 font-bold border border-border/50"
                      style={{ backgroundColor: corHeader, color: corTexto }}
                    >
                      séries
                    </td>
                  </tr>
                  {controlesGrupo.map((controle) => (
                    <tr key={controle.id}>
                      <td className="px-3 py-1.5 font-mono text-xs border border-border/50 bg-card">
                        {controle.serieBruta}
                      </td>
                      <td 
                        className="px-3 py-1.5 font-mono text-xs border border-border/50"
                        style={{ backgroundColor: '#FFFF00', color: '#000000' }}
                      >
                        {controle.modelo} NFe {controle.notaFiscal} {controle.serieFormatada}*{controle.sequencia}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </ScrollArea>
  );
}

import React from 'react';
