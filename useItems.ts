import { useState, useCallback } from 'react';
import type { Motor, Controle, Item } from '../types';

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function extrairSerieControle(serieBruta: string): string {
  // Extrai apenas os dígitos antes de "F"
  const indexF = serieBruta.toUpperCase().indexOf('F');
  if (indexF > 0) {
    return serieBruta.substring(0, indexF);
  }
  return serieBruta;
}

export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  
  const adicionarMotor = useCallback((
    caixa: string,
    modelo: string,
    notaFiscal: string,
    serie: string
  ): Motor => {
    const motor: Motor = {
      id: generateId(),
      tipo: 'motor',
      caixa: caixa || 'S/CX',
      modelo,
      notaFiscal,
      serie,
      criadoEm: new Date()
    };
    
    setItems(prev => [...prev, motor]);
    return motor;
  }, []);
  
  const adicionarControle = useCallback((
    modelo: string,
    notaFiscal: string,
    serieBruta: string
  ): Controle | null => {
    const serieFormatada = extrairSerieControle(serieBruta);
    
    let novoControle: Controle | null = null;
    
    setItems(prev => {
      // Calcula a sequência baseada nos controles existentes com mesmo modelo e NF
      const controlesExistentes = prev.filter(
        (item): item is Controle => 
          item.tipo === 'controle' && 
          item.modelo === modelo && 
          item.notaFiscal === notaFiscal
      );
      
      const sequencia = controlesExistentes.length + 1;
      
      novoControle = {
        id: generateId(),
        tipo: 'controle',
        modelo,
        notaFiscal,
        serieBruta,
        serieFormatada,
        sequencia,
        criadoEm: new Date()
      };
      
      return [...prev, novoControle];
    });
    
    return novoControle;
  }, []);
  
  const removerItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);
  
  const limparTudo = useCallback(() => {
    setItems([]);
  }, []);
  
  const motores = items.filter((item): item is Motor => item.tipo === 'motor');
  const controles = items.filter((item): item is Controle => item.tipo === 'controle');
  
  return {
    items,
    motores,
    controles,
    adicionarMotor,
    adicionarControle,
    removerItem,
    limparTudo
  };
}
