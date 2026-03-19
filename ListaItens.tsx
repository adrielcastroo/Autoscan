import type { Motor, Controle } from '../types';
import { Trash2, Cog, CircuitBoard, ListChecks, Package } from 'lucide-react';
import { Button } from '@/react-app/components/ui/button';
import { ScrollArea } from '@/react-app/components/ui/scroll-area';

interface ListaItensProps {
  motores: Motor[];
  controles: Controle[];
  onRemover: (id: string) => void;
}

function formatarMotor(motor: Motor): string {
  return `${motor.caixa} NFe ${motor.notaFiscal} ${motor.serie}`;
}

function formatarControle(controle: Controle): string {
  return `${controle.modelo} NFe ${controle.notaFiscal} ${controle.serieFormatada}*${controle.sequencia}`;
}

export function ListaItens({ motores, controles, onRemover }: ListaItensProps) {
  const totalItens = motores.length + controles.length;
  
  if (totalItens === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
          <ListChecks className="h-10 w-10 opacity-40" />
        </div>
        <p className="font-medium">Nenhum item cadastrado</p>
        <p className="text-sm mt-1">Comece a bipar motores ou controles</p>
      </div>
    );
  }
  
  // Agrupa motores por caixa
  const motoresPorCaixa = motores.reduce((acc, motor) => {
    const key = `${motor.caixa} ${motor.modelo}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(motor);
    return acc;
  }, {} as Record<string, Motor[]>);
  
  // Agrupa controles por modelo
  const controlesPorModelo = controles.reduce((acc, controle) => {
    const key = `${controle.modelo} ${controle.notaFiscal}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(controle);
    return acc;
  }, {} as Record<string, Controle[]>);
  
  return (
    <ScrollArea className="h-[500px]">
      <div className="space-y-6 pr-4">
        {/* Motores */}
        {Object.entries(motoresPorCaixa).map(([grupo, motoresGrupo]) => (
          <div key={grupo} className="space-y-2">
            <div className="flex items-center gap-2 sticky top-0 bg-card/95 backdrop-blur-sm py-2 z-10 rounded-lg">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="font-semibold text-amber-700 dark:text-amber-300">
                {grupo}
              </span>
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                {motoresGrupo.length} {motoresGrupo.length === 1 ? 'motor' : 'motores'}
              </span>
            </div>
            
            {motoresGrupo.map((motor) => (
              <div
                key={motor.id}
                className="flex items-center justify-between bg-gradient-to-r from-amber-500/5 to-orange-500/5 p-3 rounded-xl border border-amber-500/20 group hover:border-amber-500/40 hover:shadow-md hover:shadow-amber-500/10 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Cog className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-medium truncate">
                      {motor.modelo}B {motor.serie}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {formatarMotor(motor)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemover(motor.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ))}
        
        {/* Controles */}
        {Object.entries(controlesPorModelo).map(([grupo, controlesGrupo]) => (
          <div key={grupo} className="space-y-2">
            <div className="flex items-center gap-2 sticky top-0 bg-card/95 backdrop-blur-sm py-2 z-10 rounded-lg">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-sky-500/20 to-cyan-500/20">
                <CircuitBoard className="h-4 w-4 text-sky-600 dark:text-sky-400" />
              </div>
              <span className="font-semibold text-sky-700 dark:text-sky-300">
                {grupo}
              </span>
              <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-muted">
                {controlesGrupo.length} {controlesGrupo.length === 1 ? 'controle' : 'controles'}
              </span>
            </div>
            
            {controlesGrupo.map((controle) => (
              <div
                key={controle.id}
                className="flex items-center justify-between bg-gradient-to-r from-sky-500/5 to-cyan-500/5 p-3 rounded-xl border border-sky-500/20 group hover:border-sky-500/40 hover:shadow-md hover:shadow-sky-500/10 transition-all"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-xs font-bold bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-2 py-1 rounded-lg flex-shrink-0">
                    *{controle.sequencia}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-sm font-medium truncate">
                      {controle.serieBruta.substring(0, 25)}...
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {formatarControle(controle)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemover(controle.id)}
                  className="opacity-0 group-hover:opacity-100 transition-all text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 h-8 w-8 p-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
