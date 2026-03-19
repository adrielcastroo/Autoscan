import { useState, useRef } from 'react';
import { Input } from '@/react-app/components/ui/input';
import { Label } from '@/react-app/components/ui/label';
import { Button } from '@/react-app/components/ui/button';
import { CircuitBoard, Scan, Zap } from 'lucide-react';

interface FormControleProps {
  onAdicionar: (modelo: string, notaFiscal: string, serieBruta: string) => void;
  quantidadeAtual: number;
  seriesExistentes: string[];
}

export function FormControle({ onAdicionar, quantidadeAtual, seriesExistentes }: FormControleProps) {
  const [modelo, setModelo] = useState('SI 5 PU');
  const [notaFiscal, setNotaFiscal] = useState('');
  const [serie, setSerie] = useState('');
  const serieInputRef = useRef<HTMLInputElement>(null);
  
  const adicionarItem = (valorSerie: string) => {
    const serieNormalizada = valorSerie.trim();
    
    if (!serieNormalizada || !modelo || !notaFiscal) return;
    
    if (seriesExistentes.includes(serieNormalizada)) {
      setSerie('');
      serieInputRef.current?.focus();
      return;
    }
    
    onAdicionar(modelo, notaFiscal, serieNormalizada);
    setSerie('');
    serieInputRef.current?.focus();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      adicionarItem(serie);
    }
  };
  
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
        <CircuitBoard className="h-5 w-5" />
        <h3 className="font-semibold text-base">Cadastro de Controle</h3>
        <span className="ml-auto flex items-center gap-1.5 text-sm bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-sky-600 dark:text-sky-400 px-3 py-1 rounded-full border border-sky-500/20">
          <Zap className="h-3.5 w-3.5" />
          #{quantidadeAtual + 1}
        </span>
      </div>
      
      {/* Modelo e NF */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="modeloControle" className="text-sm font-medium">Modelo</Label>
          <Input
            id="modeloControle"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            placeholder="SI 5 PU"
            className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="nfControle" className="text-sm font-medium">Nota Fiscal</Label>
          <Input
            id="nfControle"
            value={notaFiscal}
            onChange={(e) => setNotaFiscal(e.target.value)}
            placeholder="146842"
            className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
          />
        </div>
      </div>
      
      {/* Campo de Bipagem */}
      <div className="space-y-2">
        <Label htmlFor="serieControle" className="flex items-center gap-2 text-sm font-medium">
          <Scan className="h-4 w-4 text-primary" />
          Série (Bipar aqui)
        </Label>
        <Input
          ref={serieInputRef}
          id="serieControle"
          value={serie}
          onChange={(e) => setSerie(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Bipe o código de barras do controle..."
          className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/30 focus:border-primary text-base font-mono h-12"
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          Os dígitos antes de "F" serão extraídos automaticamente
        </p>
      </div>
      
      <Button 
        onClick={() => adicionarItem(serie)}
        className="w-full h-11 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white font-medium shadow-lg shadow-sky-500/25"
        disabled={!serie || !modelo || !notaFiscal}
      >
        Adicionar Controle
      </Button>
    </div>
  );
}
