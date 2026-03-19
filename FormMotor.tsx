import { useState, useRef } from 'react';
import { Input } from '@/react-app/components/ui/input';
import { Label } from '@/react-app/components/ui/label';
import { Button } from '@/react-app/components/ui/button';
import { Switch } from '@/react-app/components/ui/switch';
import { Cog, Scan, Package } from 'lucide-react';

interface FormMotorProps {
  onAdicionar: (caixa: string, modelo: string, notaFiscal: string, serie: string) => void;
  seriesExistentes: string[];
}

export function FormMotor({ onAdicionar, seriesExistentes }: FormMotorProps) {
  const [temCaixa, setTemCaixa] = useState(true);
  const [numeroCaixa, setNumeroCaixa] = useState('01');
  const [modelo, setModelo] = useState('1246344');
  const [notaFiscal, setNotaFiscal] = useState('');
  const [serie, setSerie] = useState('');
  const serieInputRef = useRef<HTMLInputElement>(null);
  
  const caixaFormatada = temCaixa ? `CX${numeroCaixa.padStart(2, '0')}` : 'S/CX';
  
  const extrairSerie = (valor: string): string => {
    const partes = valor.trim().split(/\s+/);
    const serie = partes.find(p => p.startsWith('NT'));
    if (serie) return serie;
    return partes[partes.length - 1] || valor.trim();
  };
  
  const adicionarItem = (valorSerie: string) => {
    const serieNormalizada = extrairSerie(valorSerie);
    
    if (!serieNormalizada || !modelo || !notaFiscal) return;
    
    if (seriesExistentes.includes(serieNormalizada)) {
      setSerie('');
      serieInputRef.current?.focus();
      return;
    }
    
    onAdicionar(caixaFormatada, modelo, notaFiscal, serieNormalizada);
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
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
        <Cog className="h-5 w-5" />
        <h3 className="font-semibold text-base">Cadastro de Motor</h3>
      </div>
      
      {/* Switch Caixa */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            <div>
              <p className="font-medium text-sm">Motor em Caixa</p>
              <p className="text-xs text-muted-foreground">
                {temCaixa ? 'Selecione o número da caixa' : 'Sem caixa (S/CX)'}
              </p>
            </div>
          </div>
          <Switch
            checked={temCaixa}
            onCheckedChange={setTemCaixa}
            className="data-[state=checked]:bg-amber-500"
          />
        </div>
        
        {temCaixa && (
          <div className="mt-4 flex items-center gap-3">
            <Label htmlFor="numeroCaixa" className="text-sm whitespace-nowrap">
              Nº da Caixa:
            </Label>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-amber-600 dark:text-amber-400 font-semibold">CX</span>
              <Input
                id="numeroCaixa"
                type="number"
                min="1"
                max="99"
                value={numeroCaixa}
                onChange={(e) => setNumeroCaixa(e.target.value)}
                className="w-20 text-center font-mono bg-white dark:bg-zinc-900 border-amber-500/30 focus:border-amber-500"
              />
            </div>
            <span className="text-sm font-medium px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300">
              {caixaFormatada}
            </span>
          </div>
        )}
      </div>
      
      {/* Modelo e NF */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="modelo" className="text-sm font-medium">Modelo</Label>
          <Input
            id="modelo"
            value={modelo}
            onChange={(e) => setModelo(e.target.value)}
            placeholder="1246344"
            className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notaFiscal" className="text-sm font-medium">Nota Fiscal</Label>
          <Input
            id="notaFiscal"
            value={notaFiscal}
            onChange={(e) => setNotaFiscal(e.target.value)}
            placeholder="146842"
            className="bg-white dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700"
          />
        </div>
      </div>
      
      {/* Campo de Bipagem */}
      <div className="space-y-2">
        <Label htmlFor="serie" className="flex items-center gap-2 text-sm font-medium">
          <Scan className="h-4 w-4 text-primary" />
          Série (Bipar aqui)
        </Label>
        <Input
          ref={serieInputRef}
          id="serie"
          value={serie}
          onChange={(e) => setSerie(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Bipe o código de barras..."
          className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/30 focus:border-primary text-base font-mono h-12"
          autoComplete="off"
        />
        <p className="text-xs text-muted-foreground">
          O leitor envia Enter automaticamente após a bipagem
        </p>
      </div>
      
      <Button 
        onClick={() => adicionarItem(serie)}
        className="w-full h-11 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium shadow-lg shadow-amber-500/25"
        disabled={!serie || !modelo || !notaFiscal}
      >
        Adicionar Motor
      </Button>
    </div>
  );
}
