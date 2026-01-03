
import React, { useState } from 'react';
import { 
  Plus, Search, ShoppingCart, CreditCard, Banknote, Landmark, 
  ArrowUpRight, Trash2, ListChecks, Filter 
} from 'lucide-react';
import { Product, Customer, Transaction, Sale, SaleItem } from '../types';

interface Props {
  transactions: Transaction[];
  customers: Customer[];
  products: Product[];
  onUpdate: (transactions: Transaction[]) => void;
  onProductsUpdate: (products: Product[]) => void;
}

const FinancialFlow: React.FC<Props> = ({ transactions, customers, products, onUpdate, onProductsUpdate }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MULTICAIXA' | 'TRANSFER'>('CASH');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatKz = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val).replace('AOA', 'Kz');
  };

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) return prev.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { productId: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  };

  const handleCheckout = () => {
    const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const tax = subtotal * 0.14;
    const total = subtotal + tax;

    const newSale: Sale = {
      id: `V-${Date.now()}`,
      type: 'INCOME',
      category: 'Venda de Produtos',
      description: `Venda de ${cart.length} itens`,
      amount: total,
      timestamp: Date.now(),
      paymentMethod,
      items: [...cart],
      customerId: selectedCustomerId,
      status: 'PAID',
      taxAmount: tax,
      isTaxable: true
    };

    onUpdate([newSale, ...transactions]);
    
    // Deduct stock
    const updatedProducts = products.map(p => {
      const item = cart.find(i => i.productId === p.id);
      return item ? { ...p, stock: p.stock - item.quantity } : p;
    });
    onProductsUpdate(updatedProducts);

    setCart([]);
    setSelectedCustomerId('');
    alert('Receita registada com sucesso no fluxo de caixa!');
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
      <div className="xl:col-span-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Registo de Entradas</h2>
          <div className="flex space-x-2">
            <button className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm text-slate-500 hover:text-black">
              <Filter size={20} />
            </button>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Pesquisar catálogo..." 
                className="pl-12 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl shadow-sm w-64 outline-none focus:ring-2 focus:ring-[#d4a373]"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <button 
              key={product.id} 
              onClick={() => addToCart(product)}
              className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#d4a373] transition-all group flex flex-col text-left"
            >
              <div className="h-32 bg-slate-50 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                {product.image ? <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" /> : <ShoppingCart className="text-slate-300" />}
              </div>
              <h4 className="font-bold text-sm text-slate-900 mb-1 leading-tight">{product.name}</h4>
              <p className={`text-[10px] font-black uppercase ${product.stock < 5 ? 'text-rose-500' : 'text-slate-400'}`}>Stock: {product.stock}</p>
              <p className="mt-auto pt-3 text-lg font-black text-[#d4a373]">{formatKz(product.price)}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="xl:col-span-4 flex flex-col">
        <div className="bg-slate-900 text-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[700px]">
           <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <h3 className="text-xl font-black italic">CAIXA<span className="text-[#d4a373]">LIVE</span></h3>
              <div className="flex items-center text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1.5 rounded-full uppercase tracking-widest">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 animate-pulse"></span>
                Sessão Ativa
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {cart.map(item => (
                <div key={item.productId} className="flex justify-between items-center group">
                   <div className="flex-1">
                      <p className="font-bold text-sm leading-none mb-1">{item.name}</p>
                      <p className="text-xs text-slate-400 font-medium">Qtd: {item.quantity} × {formatKz(item.price)}</p>
                   </div>
                   <div className="flex items-center space-x-3">
                      <p className="font-black text-[#d4a373] text-sm">{formatKz(item.price * item.quantity)}</p>
                      <button 
                        onClick={() => setCart(cart.filter(i => i.productId !== item.productId))}
                        className="p-1 text-slate-600 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-4">
                  <ShoppingCart size={48} strokeWidth={1} />
                  <p className="text-xs font-bold uppercase tracking-widest">Aguardando Lançamentos</p>
                </div>
              )}
           </div>

           <div className="p-10 bg-white/5 border-t border-white/10 space-y-8">
              <div className="space-y-4">
                 <select 
                   className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-[#d4a373]"
                   value={selectedCustomerId}
                   onChange={e => setSelectedCustomerId(e.target.value)}
                 >
                   <option value="" className="bg-slate-900">Consumidor Final / Direto</option>
                   {customers.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name}</option>)}
                 </select>

                 <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'CASH', icon: Banknote, label: 'Kz' },
                      { id: 'MULTICAIXA', icon: CreditCard, label: 'TPA' },
                      { id: 'TRANSFER', icon: Landmark, label: 'Transf' },
                    ].map(method => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                          paymentMethod === method.id ? 'bg-[#d4a373] text-black border-[#d4a373]' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        <method.icon size={20} strokeWidth={2.5} />
                        <span className="text-[10px] font-black mt-2 uppercase">{method.label}</span>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>Subtotal s/ IVA</span>
                    <span className="text-white">{formatKz(cart.reduce((s,i) => s + i.price * i.quantity, 0))}</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                    <span>IVA (14%)</span>
                    <span className="text-white">{formatKz(cart.reduce((s,i) => s + i.price * i.quantity, 0) * 0.14)}</span>
                 </div>
                 <div className="flex justify-between items-center pt-2">
                    <span className="text-lg font-black italic">TOTAL</span>
                    <span className="text-3xl font-black text-[#d4a373] tracking-tighter">
                      {formatKz(cart.reduce((s,i) => s + i.price * i.quantity, 0) * 1.14)}
                    </span>
                 </div>
              </div>

              <button 
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full py-6 bg-white text-black font-black rounded-[2rem] text-sm uppercase tracking-[0.2em] shadow-2xl hover:bg-[#d4a373] disabled:opacity-30 disabled:hover:bg-white active:scale-95 transition-all"
              >
                CONFIRMAR ENTRADA
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialFlow;
