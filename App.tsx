import React, { useState, useMemo } from 'react';
import { ViewState, SalesData, Book } from './types';
import { SalesChart } from './components/SalesChart';
import { MetadataGenerator } from './components/MetadataGenerator';
import { CoverAnalyzer } from './components/CoverAnalyzer';
import { LayoutDashboard, BookOpen, Image as ImageIcon, Settings, DollarSign, TrendingUp, Calendar, ShoppingBag } from 'lucide-react';

// Mock Data
const generateMockSalesData = (): SalesData[] => {
  const data: SalesData[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
      revenue: Math.floor(Math.random() * 500) + 50,
      units: Math.floor(Math.random() * 30) + 5,
    });
  }
  return data;
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>(ViewState.DASHBOARD);
  const [salesData] = useState<SalesData[]>(generateMockSalesData());
  const [drafts, setDrafts] = useState<Partial<Book>[]>([]);

  const totalRevenue = useMemo(() => salesData.reduce((acc, curr) => acc + curr.revenue, 0), [salesData]);
  const totalUnits = useMemo(() => salesData.reduce((acc, curr) => acc + curr.units, 0), [salesData]);

  const handleSaveDraft = (book: Partial<Book>) => {
    setDrafts([...drafts, { ...book, status: 'draft', id: Date.now().toString() }]);
    alert("Rascunho salvo na biblioteca!");
    setView(ViewState.DASHBOARD);
  };

  const SidebarItem = ({ id, icon: Icon, label }: { id: ViewState; icon: any; label: string }) => (
    <button
      onClick={() => setView(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
        view === id 
          ? 'bg-amazon-blue text-white shadow-md' 
          : 'text-gray-600 hover:bg-white hover:text-amazon-blue hover:shadow-sm'
      }`}
    >
      <Icon className={`w-5 h-5 ${view === id ? 'text-white' : 'text-gray-400 group-hover:text-amazon-blue'}`} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex bg-[#f3f4f6]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#f8f9fa] border-r border-gray-200 flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-amazon-orange to-yellow-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
            K
          </div>
          <h1 className="text-xl font-bold text-amazon-dark tracking-tight">KDP FastTrack</h1>
        </div>
        
        <nav className="flex-1 px-4 space-y-2">
          <SidebarItem id={ViewState.DASHBOARD} icon={LayoutDashboard} label="Painel Geral" />
          <SidebarItem id={ViewState.CREATE_BOOK} icon={BookOpen} label="Criar Produto" />
          <SidebarItem id={ViewState.ANALYZE_COVER} icon={ImageIcon} label="Analisar Capa" />
        </nav>

        <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-br from-amazon-dark to-amazon-light p-4 rounded-xl text-white shadow-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium opacity-80">Próximo Pagamento</span>
                    <Calendar className="w-4 h-4 opacity-80" />
                </div>
                <div className="text-2xl font-bold">29 Out</div>
                <p className="text-xs mt-1 opacity-70">Estimado: R$ {totalRevenue.toFixed(2)}</p>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
          <h2 className="text-xl font-semibold text-gray-800">
            {view === ViewState.DASHBOARD && 'Visão Geral de Vendas'}
            {view === ViewState.CREATE_BOOK && 'Novo Projeto KDP'}
            {view === ViewState.ANALYZE_COVER && 'Laboratório de Capas'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Conta: <b>Autor Pro</b>
            </span>
            <div className="w-8 h-8 rounded-full bg-amazon-blue text-white flex items-center justify-center font-bold cursor-pointer">
              A
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto">
            
            {/* Dashboard View */}
            {view === ViewState.DASHBOARD && (
              <div className="space-y-8 animate-fade-in">
                
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Faturamento (7 dias)</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">R$ {totalRevenue.toFixed(2)}</h3>
                      <span className="text-xs font-medium text-green-600 flex items-center mt-2">
                        <TrendingUp className="w-3 h-3 mr-1" /> +12.5% vs semana anterior
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Livros Vendidos</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalUnits}</h3>
                      <span className="text-xs font-medium text-green-600 flex items-center mt-2">
                         Alta demanda em "Não-Ficção"
                      </span>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-amazon-blue" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Royalties Estimados</p>
                      <h3 className="text-3xl font-bold text-gray-900 mt-1">R$ {(totalRevenue * 0.7).toFixed(2)}</h3>
                      <span className="text-xs text-gray-400 mt-2 block">Baseado em 70% de comissão</span>
                    </div>
                    <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                        <div className="text-amazon-orange font-bold text-lg">%</div>
                    </div>
                  </div>
                </div>

                <SalesChart data={salesData} />

                {/* Drafts Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Seus Rascunhos Recentes</h3>
                    <button onClick={() => setView(ViewState.CREATE_BOOK)} className="text-sm text-indigo-600 font-medium hover:underline">
                      Criar Novo
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {drafts.length === 0 ? (
                      <div className="p-8 text-center text-gray-400">
                        Nenhum rascunho salvo ainda. Comece a criar!
                      </div>
                    ) : (
                      drafts.map((draft, i) => (
                        <div key={i} className="p-4 hover:bg-gray-50 flex justify-between items-center transition-colors">
                          <div>
                            <h4 className="font-medium text-gray-800">{draft.title || 'Sem título'}</h4>
                            <p className="text-xs text-gray-500 truncate max-w-md">{draft.description}</p>
                          </div>
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Rascunho</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {view === ViewState.CREATE_BOOK && <MetadataGenerator onSave={handleSaveDraft} />}
            
            {view === ViewState.ANALYZE_COVER && <CoverAnalyzer />}

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;