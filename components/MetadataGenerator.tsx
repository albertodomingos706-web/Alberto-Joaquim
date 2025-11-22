import React, { useState } from 'react';
import { Book, AIAnalysisResult } from '../types';
import { generateBookMetadata } from '../services/geminiService';
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react';

interface MetadataGeneratorProps {
  onSave: (book: Partial<Book>) => void;
}

export const MetadataGenerator: React.FC<MetadataGeneratorProps> = ({ onSave }) => {
  const [topic, setTopic] = useState('');
  const [genre, setGenre] = useState('Não Ficção');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const data = await generateBookMetadata(topic, genre);
      setResult(data);
    } catch (e) {
      alert('Erro ao gerar metadados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-white">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          Criador de Best-Seller com IA
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Use a inteligência Gemini para criar títulos e descrições que convertem visitas em vendas.
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sobre o que é seu PDF?</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none h-32"
              placeholder="Ex: Um guia completo sobre dieta cetogênica para iniciantes com receitas..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gênero / Categoria</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              <option>Não Ficção</option>
              <option>Autoajuda</option>
              <option>Negócios</option>
              <option>Romance</option>
              <option>Técnico/Educacional</option>
              <option>Infantil</option>
            </select>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !topic}
            className="w-full py-3 px-4 bg-amazon-orange hover:bg-yellow-500 text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            {loading ? 'Gerando...' : 'Gerar Metadados Otimizados'}
          </button>
        </div>

        {/* Result Section */}
        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 h-full min-h-[400px]">
          {!result ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Sparkles className="w-12 h-12 mb-3 opacity-20" />
              <p>Os resultados aparecerão aqui</p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Título Sugerido</span>
                  <button onClick={() => handleCopy(result.titleSuggestion || '')} className="text-gray-400 hover:text-indigo-600">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-lg font-bold text-gray-900 bg-white p-3 rounded border border-gray-200 shadow-sm">
                  {result.titleSuggestion}
                </p>
              </div>

              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">Palavras-chave (Tags)</span>
                <div className="flex flex-wrap gap-2">
                  {result.keywords?.map((kw, i) => (
                    <span key={i} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Descrição de Venda</span>
                </div>
                <div className="bg-white p-3 rounded border border-gray-200 text-sm text-gray-600 h-48 overflow-y-auto shadow-sm whitespace-pre-wrap">
                  {result.descriptionSuggestion}
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                  <button 
                    onClick={() => onSave({ 
                        title: result.titleSuggestion, 
                        description: result.descriptionSuggestion,
                        keywords: result.keywords
                    })}
                    className="w-full py-2 bg-amazon-blue text-white rounded hover:bg-opacity-90 transition-colors text-sm font-semibold"
                  >
                      Salvar como Rascunho
                  </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};