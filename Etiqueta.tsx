import { QRCodeSVG } from 'qrcode.react';
import type { Motor, Controle } from '../types';
import { Button } from './ui/button';
import { Printer } from 'lucide-react';

interface EtiquetaMotorProps {
  motor: Motor;
  index: number;
}

export function EtiquetaMotor({ motor, index }: EtiquetaMotorProps) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const conteudoQR = `${motor.caixa} NFe ${motor.notaFiscal} ${motor.serie}`;
  
  return (
    <div 
      className="bg-white border border-gray-300 flex items-center gap-3"
      style={{ 
        width: '68mm',
        height: '27mm',
        maxHeight: '27mm',
        padding: '2mm 3mm',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div className="flex-shrink-0" style={{ width: '20mm', height: '20mm' }}>
        <QRCodeSVG
          value={conteudoQR}
          size={75}
          level="H"
          includeMargin={false}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      <div className="flex flex-col justify-center flex-1 min-w-0 overflow-hidden">
        <div className="font-bold text-sm text-gray-900 truncate">
          {motor.caixa} NF{motor.notaFiscal}
        </div>
        <div className="font-mono text-xs text-gray-700 truncate">
          {motor.serie}
        </div>
        <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500">
          <span className="font-semibold">#{index}</span>
          <span>{dataAtual}</span>
        </div>
      </div>
    </div>
  );
}

interface EtiquetaControleProps {
  controle: Controle;
  index: number;
}

export function EtiquetaControle({ controle, index }: EtiquetaControleProps) {
  const dataAtual = new Date().toLocaleDateString('pt-BR');
  const conteudoQR = `${controle.modelo} NFe ${controle.notaFiscal} ${controle.serieFormatada}`;
  
  return (
    <div 
      className="bg-white border border-gray-300 flex items-center gap-3"
      style={{ 
        width: '68mm',
        height: '27mm',
        maxHeight: '27mm',
        padding: '2mm 3mm',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <div className="flex-shrink-0" style={{ width: '20mm', height: '20mm' }}>
        <QRCodeSVG
          value={conteudoQR}
          size={75}
          level="H"
          includeMargin={false}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      
      <div className="flex flex-col justify-center flex-1 min-w-0 overflow-hidden">
        <div className="font-bold text-sm text-gray-900 truncate">
          {controle.modelo} NF{controle.notaFiscal}
        </div>
        <div className="font-mono text-xs text-gray-700 truncate">
          {controle.serieFormatada}
        </div>
        <div className="flex items-center justify-between mt-1 text-[10px] text-gray-500">
          <span className="font-semibold">#{index}</span>
          <span>{dataAtual}</span>
        </div>
      </div>
    </div>
  );
}

interface EtiquetaListProps {
  motores: Motor[];
  controles?: Controle[];
}

export function EtiquetaList({ motores, controles = [] }: EtiquetaListProps) {
  const totalItens = motores.length + controles.length;
  
  if (totalItens === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        Nenhum item cadastrado para gerar etiquetas
      </div>
    );
  }
  
  const handleImprimir = () => {
    window.print();
  };
  
  return (
    <div>
      <div className="mb-4 print:hidden">
        <Button onClick={handleImprimir} className="bg-primary hover:bg-primary/90">
          <Printer className="h-4 w-4 mr-2" />
          Imprimir Etiquetas ({totalItens})
        </Button>
      </div>
      
      <div 
        className="print:hidden"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 68mm)',
          gap: '4mm',
        }}
      >
        {motores.map((motor, index) => (
          <EtiquetaMotor 
            key={motor.id} 
            motor={motor} 
            index={index + 1}
          />
        ))}
        {controles.map((controle, index) => (
          <EtiquetaControle 
            key={controle.id} 
            controle={controle} 
            index={motores.length + index + 1}
          />
        ))}
      </div>
    </div>
  );
}
