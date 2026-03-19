import { useState } from 'react';
import { useItems } from '../hooks/useItems';
import { useTheme } from '../hooks/useTheme';
import { FormMotor } from '../components/FormMotor';
import { FormControle } from '../components/FormControle';
import { ListaItens } from '../components/ListaItens';
import { EtiquetaList } from '../components/Etiqueta';
import { ExcelPreview } from '../components/ExcelPreview';
import { ThemeToggle } from '../components/ThemeToggle';
import { exportarParaExcel } from '../utils/exportExcel';
import { Card, CardContent } from '@/react-app/components/ui/card';
import { Button } from '@/react-app/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/react-app/components/ui/tabs';
import { 
  Scan,
  Cog,
  CircuitBoard,
  FileSpreadsheet, 
  Trash2,
  Printer,
  History,
  ListChecks,
  Download,
  Table,
  Tag
} from 'lucide-react';

interface HistoricoItem {
  id: string;
  tipo: 'motor' | 'controle' | 'export';
  descricao: string;
  data: Date;
}

export default function HomePage() {
  const { 
    motores, 
    controles, 
    adicionarMotor, 
    adicionarControle, 
    removerItem, 
    limparTudo 
  } = useItems();
  
  useTheme();
  
  const [abaAtiva, setAbaAtiva] = useState('motor');
  const [abaPrincipal, setAbaPrincipal] = useState('cadastro');
  const [historico, setHistorico] = useState<HistoricoItem[]>([]);
  
  const totalItens = motores.length + controles.length;
  
  const handleExportar = () => {
    if (totalItens === 0) {
      alert('Nenhum item para exportar');
      return;
    }
    exportarParaExcel(motores, controles);
    
    setHistorico(prev => [{
      id: Date.now().toString(),
      tipo: 'export',
      descricao: `Exportação XLSX: ${motores.length} motores, ${controles.length} controles`,
      data: new Date()
    }, ...prev]);
  };
  
  const handleAdicionarMotor = (caixa: string, modelo: string, notaFiscal: string, serie: string) => {
    const motor = adicionarMotor(caixa, modelo, notaFiscal, serie);
    setHistorico(prev => [{
      id: Date.now().toString(),
      tipo: 'motor',
      descricao: `Motor ${motor.caixa} - NF ${motor.notaFiscal}`,
      data: new Date()
    }, ...prev]);
    return motor;
  };
  
  const handleAdicionarControle = (modelo: string, notaFiscal: string, serieBruta: string) => {
    const controle = adicionarControle(modelo, notaFiscal, serieBruta);
    if (controle) {
      setHistorico(prev => [{
        id: Date.now().toString(),
        tipo: 'controle',
        descricao: `Controle ${controle.modelo} #${controle.sequencia} - NF ${controle.notaFiscal}`,
        data: new Date()
      }, ...prev]);
    }
    return controle;
  };

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 dark:from-slate-950 dark:via-indigo-950/50 dark:to-purple-950/30 relative overflow-hidden">
      {/* Background decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />
      </div>
      
      {/* Header */}
      <header className="relative border-b border-border/50 bg-gradient-to-r from-white/80 via-white/90 to-white/80 dark:from-slate-900/80 dark:via-slate-900/90 dark:to-slate-900/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-gradient-to-br from-primary via-accent to-purple-600 rounded-2xl shadow-xl shadow-primary/30 ring-2 ring-white/20">
                <Scan className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-purple-600 bg-clip-text text-transparent">
                  AutoScan
                </h1>
                <p className="text-xs text-muted-foreground font-medium">Motores e Controles</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Contadores */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 dark:border-amber-500/40 shadow-sm">
                  <Cog className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="font-bold text-amber-700 dark:text-amber-300">{motores.length}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500/10 to-cyan-500/10 border border-sky-500/30 dark:border-sky-500/40 shadow-sm">
                  <CircuitBoard className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                  <span className="font-bold text-sky-700 dark:text-sky-300">{controles.length}</span>
                </div>
              </div>
              
              <ThemeToggle />
              
              {totalItens > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={limparTudo}
                  className="text-rose-500 border-rose-300 dark:border-rose-700 hover:bg-rose-500/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="relative max-w-7xl mx-auto px-4 py-6 print:hidden">
        {/* Tabs Principais */}
        <Tabs value={abaPrincipal} onValueChange={setAbaPrincipal} className="mb-6">
          <TabsList className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-border/50 p-1.5 rounded-2xl shadow-lg shadow-black/5 w-full sm:w-auto grid grid-cols-4 sm:inline-flex gap-1">
            <TabsTrigger 
              value="cadastro" 
              className="rounded-xl px-5 py-3 text-sm font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-primary/30"
            >
              <Scan className="h-5 w-5 mr-2" />
              Cadastro
            </TabsTrigger>
            <TabsTrigger 
              value="excel"
              className="rounded-xl px-5 py-3 text-sm font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-green-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/30"
            >
              <Table className="h-5 w-5 mr-2" />
              Excel
            </TabsTrigger>
            <TabsTrigger 
              value="etiquetas"
              className="rounded-xl px-5 py-3 text-sm font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-violet-500/30"
            >
              <Tag className="h-5 w-5 mr-2" />
              Etiquetas
            </TabsTrigger>
            <TabsTrigger 
              value="historico"
              className="rounded-xl px-5 py-3 text-sm font-semibold transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-slate-500 data-[state=active]:to-slate-700 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-slate-500/30"
            >
              <History className="h-4 w-4 mr-2" />
              Histórico
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {abaPrincipal === 'cadastro' && (
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Formulários */}
            <Card className="border border-border shadow-xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Scan className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="font-semibold text-lg">Bipagem</h2>
                </div>
                
                <Tabs value={abaAtiva} onValueChange={setAbaAtiva}>
                  <TabsList className="grid grid-cols-2 mb-5 bg-muted p-1 rounded-xl border border-border">
                    <TabsTrigger 
                      value="motor" 
                      className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
                    >
                      <Cog className="h-4 w-4 mr-2" />
                      Motor
                    </TabsTrigger>
                    <TabsTrigger 
                      value="controle"
                      className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white"
                    >
                      <CircuitBoard className="h-4 w-4 mr-2" />
                      Controle
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="motor">
                    <FormMotor 
                      onAdicionar={handleAdicionarMotor}
                      seriesExistentes={motores.map(m => m.serie)}
                    />
                  </TabsContent>
                  
                  <TabsContent value="controle">
                    <FormControle 
                      onAdicionar={handleAdicionarControle}
                      quantidadeAtual={controles.length}
                      seriesExistentes={controles.map(c => c.serieBruta)}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* Lista de Itens */}
            <Card className="border border-border shadow-xl overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-sky-500" />
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-5">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <ListChecks className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="font-semibold text-lg">Itens Cadastrados</h2>
                  {totalItens > 0 && (
                    <span className="text-sm font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
                      {totalItens}
                    </span>
                  )}
                </div>
                
                <ListaItens 
                  motores={motores}
                  controles={controles}
                  onRemover={removerItem}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {abaPrincipal === 'excel' && (
          <Card className="border border-border shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-500" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <FileSpreadsheet className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <h2 className="font-semibold text-lg">Preview do Excel</h2>
                  <span className="text-sm text-muted-foreground">
                    ({motores.length} motores + {controles.length} controles)
                  </span>
                </div>
                <Button
                  onClick={handleExportar}
                  disabled={totalItens === 0}
                  className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg shadow-emerald-500/25"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Excel
                </Button>
              </div>
              
              <div className="rounded-xl border border-border overflow-hidden bg-white dark:bg-slate-900">
                <ExcelPreview motores={motores} controles={controles} />
              </div>
            </CardContent>
          </Card>
        )}

        {abaPrincipal === 'etiquetas' && (
          <Card className="border border-border shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-violet-500 via-purple-500 to-violet-500" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Tag className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <h2 className="font-semibold text-lg">Preview das Etiquetas</h2>
                  <span className="text-sm text-muted-foreground">
                    ({totalItens} etiquetas)
                  </span>
                </div>
                <Button
                  onClick={handlePrint}
                  disabled={totalItens === 0}
                  className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/25"
                >
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir
                </Button>
              </div>
              
              {totalItens > 0 ? (
                <EtiquetaList motores={motores} controles={controles} />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Tag className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Nenhuma etiqueta para visualizar</p>
                  <p className="text-sm mt-1">Cadastre motores ou controles primeiro</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {abaPrincipal === 'historico' && (
          <Card className="border border-border shadow-xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-slate-500 via-slate-400 to-slate-500" />
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-slate-500/10">
                    <History className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                  </div>
                  <h2 className="font-semibold text-lg">Histórico de Ações</h2>
                </div>
                {historico.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setHistorico([])}
                    className="text-rose-500 border-rose-300 dark:border-rose-700 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Limpar
                  </Button>
                )}
              </div>
              
              {historico.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">Nenhuma ação registrada</p>
                  <p className="text-sm mt-1">Suas ações aparecerão aqui</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                  {historico.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-md ${
                        item.tipo === 'motor'
                          ? 'bg-gradient-to-r from-amber-500/5 to-orange-500/5 border-amber-500/30'
                          : item.tipo === 'controle'
                          ? 'bg-gradient-to-r from-sky-500/5 to-cyan-500/5 border-sky-500/30'
                          : 'bg-gradient-to-r from-emerald-500/5 to-green-500/5 border-emerald-500/30'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${
                        item.tipo === 'motor' 
                          ? 'bg-amber-500/20' 
                          : item.tipo === 'controle'
                          ? 'bg-sky-500/20'
                          : 'bg-emerald-500/20'
                      }`}>
                        {item.tipo === 'motor' ? (
                          <Cog className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        ) : item.tipo === 'controle' ? (
                          <CircuitBoard className="h-4 w-4 text-sky-600 dark:text-sky-400" />
                        ) : (
                          <FileSpreadsheet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {item.descricao}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.data.toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setHistorico(prev => prev.filter(h => h.id !== item.id))}
                        className="text-muted-foreground hover:text-rose-500 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      
      {/* Print Area */}
      <div id="print-area">
        <div className="print-grid">
          {motores.map((motor, index) => {
            const dataAtual = new Date().toLocaleDateString('pt-BR');
            const conteudoQR = `${motor.caixa} NFe ${motor.notaFiscal} ${motor.serie}`;
            return (
              <div key={motor.id} className="print-label">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(conteudoQR)}`}
                  alt="QR"
                />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '9pt' }}>{motor.caixa} NF{motor.notaFiscal}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '8pt' }}>{motor.serie}</div>
                  <div style={{ fontSize: '7pt', color: '#666' }}>
                    <span>#{index + 1}</span> | <span>{dataAtual}</span>
                  </div>
                </div>
              </div>
            );
          })}
          {controles.map((controle, index) => {
            const dataAtual = new Date().toLocaleDateString('pt-BR');
            const conteudoQR = `${controle.modelo} NFe ${controle.notaFiscal} ${controle.serieFormatada}`;
            return (
              <div key={controle.id} className="print-label">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(conteudoQR)}`}
                  alt="QR"
                />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '9pt' }}>{controle.modelo} NF{controle.notaFiscal}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: '8pt' }}>{controle.serieFormatada}</div>
                  <div style={{ fontSize: '7pt', color: '#666' }}>
                    <span>#{motores.length + index + 1}</span> | <span>{dataAtual}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
