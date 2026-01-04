
import React from 'react';
import { FileText, Download, Trash2, ExternalLink } from 'lucide-react';
import { Sale } from '../types';

interface Props {
  sales: Sale[];
  setSales: React.Dispatch<React.SetStateAction<Sale[]>>;
}

const SalesHistory: React.FC<Props> = ({ sales, setSales }) => {
  const formatKz = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val).replace('AOA', 'Kz');
  };

  const deleteSale = (id: string) => {
    if (confirm('Tem certeza que deseja anular esta venda?')) {
      setSales(sales.filter(s => s.id !== id));
    }
  };

  const exportToPDF = () => {
    // In a production environment, use a library like jsPDF. 
    // Here we'll simulate the report generation.
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Histórico de Vendas</h2>
        <button 
          onClick={exportToPDF}
          className="flex items-center justify-center space-x-2 bg-[#d4a373] text-black px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-[#c49363] transition-all"
        >
          <Download size={20} />
          <span>Exportar Relatório (PDF)</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">ID Venda</th>
                <th className="px-6 py-4">Data/Hora</th>
                <th className="px-6 py-4">Itens</th>
                <th className="px-6 py-4">Pagamento</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sales.map(sale => (
                <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm font-bold">#{sale.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(sale.timestamp).toLocaleString('pt-AO')}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {sale.items.length} itens
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="px-2 py-1 bg-gray-100 rounded font-bold">{sale.paymentMethod}</span>
                  </td>
                  {/* Fix: Property 'total' does not exist on type 'Sale'. Use 'amount'. */}
                  <td className="px-6 py-4 font-bold text-gray-800">{formatKz(sale.amount)}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-500"><ExternalLink size={18}/></button>
                    <button onClick={() => deleteSale(sale.id)} className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-gray-400 italic">
                    Nenhuma venda encontrada no histórico.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary for History */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-black text-white p-6 rounded-3xl">
          <p className="text-gray-400 text-sm">Total Bruto</p>
          {/* Fix: Property 'total' does not exist on type 'Sale'. Use 'amount'. */}
          <p className="text-2xl font-bold">{formatKz(sales.reduce((a, b) => a + b.amount, 0))}</p>
        </div>
        <div className="bg-white border p-6 rounded-3xl">
          <p className="text-gray-400 text-sm">IVA Retido (14%)</p>
          {/* Fix: Property 'tax' does not exist on type 'Sale'. Use 'taxAmount'. */}
          <p className="text-2xl font-bold text-[#d4a373]">{formatKz(sales.reduce((a, b) => a + (b.taxAmount || 0), 0))}</p>
        </div>
        <div className="bg-white border p-6 rounded-3xl">
          <p className="text-gray-400 text-sm">Tickets Médio</p>
          <p className="text-2xl font-bold text-gray-800">
            {/* Fix: Property 'total' does not exist on type 'Sale'. Use 'amount'. */}
            {sales.length > 0 ? formatKz(sales.reduce((a, b) => a + b.amount, 0) / sales.length) : 'Kz 0,00'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesHistory;
