import React, { useState, useRef } from 'react';
import { analyzeCoverImage } from '../services/geminiService';
import { AIAnalysisResult } from '../types';
import { Upload, Image as ImageIcon, AlertCircle, Star, Loader2 } from 'lucide-react';

export const CoverAnalyzer: React.FC = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setAnalysis(null); // Reset analysis on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setLoading(true);
    try {
      // Extract base64 data part
      const base64Data = preview.split(',')[1];
      const result = await analyzeCoverImage(base64Data);
      setAnalysis(result);
    } catch (e) {
      console.error(e);
      alert("Erro ao analisar imagem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-green-50 to-white">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-green-600" />
          Auditoria de Capa (Visão Computacional)
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Descubra se sua capa vai se destacar nas miniaturas da Amazon antes de publicar.
        </p>
      </div>

      <div className="p-8 flex flex-col md:flex-row gap-8">
        {/* Upload Area */}
        <div className="flex-1 flex flex-col items-center">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          
          <div 
            className={`w-full max-w-sm aspect-[2/3] rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden ${preview ? 'border-transparent' : 'border-gray-300 hover:border-amazon-blue hover:bg-gray-50'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6">
                <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 font-medium">Clique para enviar capa</p>
                <p className="text-xs text-gray-400 mt-1">PNG ou JPG</p>
              </div>
            )}
            
            {preview && (
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all flex items-center justify-center">
                    <span className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-bold opacity-0 hover:opacity-100 shadow-lg absolute bottom-4">Alterar Imagem</span>
                </div>
            )}
          </div>

          <button
            onClick={handleAnalyze}
            disabled={!preview || loading}
            className="mt-6 w-full max-w-sm py-3 bg-amazon-blue hover:bg-opacity-90 text-white font-bold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Star className="w-5 h-5" />}
            {loading ? 'Analisando...' : 'Analisar Potencial de Venda'}
          </button>
        </div>

        {/* Analysis Result */}
        <div className="flex-1 bg-gray-50 rounded-xl border border-gray-200 p-6 relative">
            {!analysis ? (
                 <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                    <AlertCircle className="w-12 h-12 mb-3 opacity-20" />
                    <p>Envie uma imagem e clique em analisar para receber o feedback da IA.</p>
                 </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <span className="text-gray-700 font-medium">Score de Venda</span>
                        <div className="flex items-center gap-2">
                             <span className={`text-4xl font-bold ${analysis.score && analysis.score >= 8 ? 'text-green-600' : analysis.score && analysis.score >= 5 ? 'text-amazon-orange' : 'text-red-500'}`}>
                                {analysis.score}
                             </span>
                             <span className="text-gray-400 text-xl">/ 10</span>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-gray-800 mb-2">Análise da IA</h4>
                        <p className="text-gray-700 leading-relaxed bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                            {analysis.coverFeedback}
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                        <h5 className="text-blue-800 text-sm font-bold mb-1">Dica Profissional</h5>
                        <p className="text-blue-700 text-xs">
                            Capas com alto contraste e tipografia grande tendem a performar 30% melhor em dispositivos móveis (onde ocorre a maioria das compras Kindle).
                        </p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};