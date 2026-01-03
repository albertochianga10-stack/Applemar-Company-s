
import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Package, Search, X } from 'lucide-react';
import { Product } from '../types';

interface Props {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

const Inventory: React.FC<Props> = ({ products, setProducts }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    costPrice: '',
    stock: '',
    category: 'Geral'
  });

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        costPrice: product.costPrice.toString(),
        stock: product.stock.toString(),
        category: product.category
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', price: '', costPrice: '', stock: '', category: 'Geral' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.stock) return;

    if (editingId) {
      const updated = products.map(p => 
        p.id === editingId ? {
          ...p,
          name: formData.name,
          price: parseFloat(formData.price),
          costPrice: parseFloat(formData.costPrice),
          stock: parseInt(formData.stock),
          category: formData.category
        } : p
      );
      setProducts(updated);
    } else {
      const product: Product = {
        id: `P-${Date.now()}`,
        name: formData.name,
        price: parseFloat(formData.price),
        costPrice: parseFloat(formData.costPrice),
        stock: parseInt(formData.stock),
        category: formData.category,
        image: `https://picsum.photos/seed/${formData.name}/200`
      };
      setProducts([...products, product]);
    }
    
    setIsModalOpen(false);
    setEditingId(null);
  };

  const deleteProduct = (id: string) => {
    if (confirm('Atenção Applemar: Deseja excluir este item permanentemente do inventário?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const formatKz = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val).replace('AOA', 'Kz');
  };

  return (
    <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Stock & Logística</h2>
          <p className="text-slate-500 font-medium">Controlo detalhado de produtos e margens de lucro.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center space-x-3 bg-black text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:bg-[#d4a373] transition-all active:scale-95"
        >
          <Plus size={22} />
          <span>Novo Item</span>
        </button>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Pesquisar por nome ou categoria..."
              className="w-full pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#d4a373] text-sm font-medium transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hidden md:flex items-center space-x-2 text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            <Package size={14} />
            <span>{filteredProducts.length} Produtos Ativos</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <th className="px-8 py-6">Produto Ativo</th>
                <th className="px-8 py-6">Categoria</th>
                <th className="px-8 py-6">Stock</th>
                <th className="px-8 py-6 text-right">Custo / Venda</th>
                <th className="px-8 py-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                        <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
                      </div>
                      <div>
                         <p className="font-black text-slate-900 text-sm leading-tight">{product.name}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">ID: {product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest">{product.category}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock < 10 ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></div>
                      <span className={`text-sm font-black ${product.stock < 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                        {product.stock} un
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <p className="text-[10px] text-slate-300 font-bold line-through">{formatKz(product.costPrice)}</p>
                    <p className="font-black text-[#d4a373] text-sm">{formatKz(product.price)}</p>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-black hover:text-white transition-all"
                      >
                        <Edit3 size={16}/>
                      </button>
                      <button 
                        onClick={() => deleteProduct(product.id)} 
                        className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-600 hover:text-white transition-all"
                      >
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center text-slate-300 font-black uppercase tracking-[0.2em] italic">
                    Nenhum item em stock.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Edição/Novo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[3rem] w-full max-w-xl p-10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                 <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center shadow-lg">
                    <Package className="text-[#d4a373]" size={24} />
                 </div>
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                   {editingId ? 'Editar Produto' : 'Novo Produto'}
                 </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-rose-500"><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nome Comercial</label>
                <input required type="text" className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#d4a373] font-bold" placeholder="Ex: Cerveja Tigra 33cl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Preço Custo (Kz)</label>
                <input required type="number" step="0.01" className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#d4a373] font-bold" placeholder="0.00" value={formData.costPrice} onChange={e => setFormData({...formData, costPrice: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Preço Venda (Kz)</label>
                <input required type="number" step="0.01" className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#d4a373] font-bold text-[#d4a373]" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Stock em Unidades</label>
                <input required type="number" className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#d4a373] font-bold" placeholder="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Categoria</label>
                <select className="w-full p-4 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-[#d4a373] font-bold" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>Alimentação</option>
                    <option>Bebidas</option>
                    <option>Vestuário</option>
                    <option>Eletrônicos</option>
                    <option>Logística</option>
                    <option>Serviços</option>
                    <option>Geral</option>
                </select>
              </div>

              <div className="md:col-span-2 flex space-x-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 text-sm font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 py-5 bg-black text-white rounded-[2rem] text-sm font-black uppercase tracking-widest shadow-xl hover:bg-[#d4a373] transition-all active:scale-95">
                   {editingId ? 'Salvar Alterações' : 'Confirmar Produto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
