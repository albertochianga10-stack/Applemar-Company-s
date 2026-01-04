
import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Lightbulb, TrendingUp, RefreshCw, BarChart3, ShieldCheck } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Transaction, Product } from '../types.ts';

interface Props {
  transactions: Transaction[];
  products: Product[];
}

const AIInsights: React.FC<Props> = ({ transactions, products }) => {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);

  const generateInsights = async () => {
    setLoading(true);
    try {
      // Tenta obter a chave de forma segura
      const apiKey = (window as any).process?.env?.API_KEY || "";
      
      if (!apiKey) {
        setInsight("Chave de API não configurada no ambiente. Por favor, configure a API_KEY nas variáveis do Netlify.");
        setLoading(false);
        return;
      }

      const ai = new GoogleGenAI({ apiKey });
      const income = transactions.filter(t => t.type === 'INCOME').reduce((s,t) => s+t.amount, 0);
      const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((s,t) => s+t.amount, 0);
      
      const prompt = `
        Analise o status financeiro global da empresa Applemar Company em Angola:
        - Receita Total (Entradas): ${income} Kz
        - Despesas Totais (Custos): ${expense} Kz
        - Margem de Lucro: ${income - expense} Kz
        - Total de Produtos em Stock: ${products.length}
        - Stock Crítico (<5): ${products.filter(p => p.stock < 5).length} produtos.

        Aja como um CFO (Diretor Financeiro) de alto nível. Dê 4 conselhos estratégicos detalhados em Português de Angola para o mercado de Luanda.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      setInsight(response.text || 'Ocorreu um erro ao processar a inteligência financeira.');
    } catch (error) {
      console.error(error);
      setInsight("A Applemar AI requer configuração de chave válida e conexão ativa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12">
      <div className="bg-slate-900 text-white rounded-[3.5rem] overflow-hidden relative shadow-2xl p-12 lg:p-20 group">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4a373] opacity-5 rounded-full -mr-40 -mt-40 blur-[120px]"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex p-4 bg-white/5 rounded-3xl backdrop-blur-xl border border-white/10">
              <Sparkles className="text-[#d4a373]" size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-5xl font-black tracking-tight leading-tight">Consultoria Financeira <br /><span className="text-[#d4a373]">Inteligente</span></h2>
            <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-lg">
              Deixe que a IA da Applemar analise os seus números e forneça estratégias de nível mundial para o mercado Angolano.
            </p>
            <button 
              onClick={generateInsights}
              disabled={loading}
              className="px-12 py-6 bg-[#d4a373] text-black font-black rounded-2xl text-lg uppercase tracking-widest shadow-2xl hover:bg-white transition-all flex items-center disabled:opacity-30"
            >
              {loading ? <RefreshCw className="mr-3 animate-spin" /> : <BrainCircuit className="mr-3" />}
              {loading ? 'Processando...' : 'ANALISAR SAÚDE DA EMPRESA'}
            </button>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-6">
             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10">
                <BarChart3 className="text-[#d4a373] mb-4" />
                <h4 className="font-bold text-lg mb-2">Previsão de Risco</h4>
                <p className="text-sm text-slate-500">Análise em tempo real de vulnerabilidades.</p>
             </div>
             <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 mt-12">
                <ShieldCheck className="text-emerald-400 mb-4" />
                <h4 className="font-bold text-lg mb-2">Conformidade AGT</h4>
                <p className="text-sm text-slate-500">Sugestões para otimização do IVA.</p>
             </div>
          </div>
        </div>
      </div>
      {insight && (
        <div className="bg-white p-12 lg:p-16 rounded-[3.5rem] border border-slate-100 shadow-2xl relative">
           <div className="absolute top-0 left-0 w-3 h-full bg-[#d4a373]"></div>
           <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6">
              {insight.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
