
import React, { useState } from 'react';
import { Search, ShoppingCart, Trash2, Plus, Minus, CreditCard, Banknote, Landmark, Package } from 'lucide-react';
import { Product, Customer, Sale, SaleItem } from '../types';

interface Props {
  products: Product[];
  customers: Customer[];
  onSaleComplete: (sale: Sale) => void;
}

const POS: React.FC<Props> = ({ products, customers, onSaleComplete }) => {
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'CASH' | 'MULTICAIXA' | 'TRANSFER'>('CASH');

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) && p.stock > 0
  );

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item => 
          item.productId === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { 
        productId: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1 
      }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.productId === productId) {
        const newQty = Math.max(1, item.quantity + delta);
        const product = products.find(p => p.id === productId);
        if (product && newQty > product.stock) return item; // Stock limit
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.14; // IVA Angola 14%
  const total = subtotal + tax;

  const handleCheckout = () => {
    if (cart.length === 0) return;

    // Fix: Ensure the Sale object includes all required Transaction fields
    const newSale: Sale = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      type: 'INCOME',
      category: 'Venda POS',
      description: `Venda de ${cart.reduce((a, b) => a + b.quantity, 0)} itens`,
      amount: total,
      timestamp: Date.now(),
      paymentMethod,
      items: [...cart],
      taxAmount: tax,
      isTaxable: true,
      customerId: selectedCustomerId || undefined,
      status: 'PAID'
    };

    onSaleComplete(newSale);
    setCart([]);
    setSelectedCustomerId('');
    alert('Venda finalizada com sucesso! Recibo gerado.');
  };

  const formatKz = (val: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(val).replace('AOA', 'Kz');
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      {/* Products Selection */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Procurar produtos..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border-0 shadow-sm focus:ring-2 focus:ring-[#d4a373] outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-[#d4a373] transition-all text-left flex flex-col group"
            >
              <div className="h-32 bg-gray-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                {product.image ? (
                   <img src={product.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                ) : (
                  <ShoppingCart className="text-gray-300" size={32} />
                )}
              </div>
              <h4 className="font-bold text-sm mb-1 truncate">{product.name}</h4>
              <p className="text-gray-500 text-xs mb-2">Stock: {product.stock}</p>
              <p className="text-[#d4a373] font-bold mt-auto">{formatKz(product.price)}</p>
            </button>
          ))}
          {filteredProducts.length === 0 && (
             <div className="col-span-full py-20 text-center text-gray-500">
               <Package className="mx-auto mb-4 opacity-20" size={64} />
               Nenhum produto encontrado.
             </div>
          )}
        </div>
      </div>

      {/* Cart & Checkout */}
      <div className="w-full lg:w-96 bg-white rounded-3xl border border-gray-100 shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h3 className="text-xl font-bold flex items-center">
            <ShoppingCart className="mr-2" /> Carrinho
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.map(item => (
            <div key={item.productId} className="flex items-center space-x-3">
              <div className="flex-1">
                <p className="font-bold text-sm leading-tight">{item.name}</p>
                <p className="text-xs text-gray-500">{formatKz(item.price)}</p>
              </div>
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button onClick={() => updateQuantity(item.productId, -1)} className="p-1 hover:bg-white rounded transition-colors"><Minus size={14}/></button>
                <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.productId, 1)} className="p-1 hover:bg-white rounded transition-colors"><Plus size={14}/></button>
              </div>
              <button onClick={() => removeFromCart(item.productId)} className="text-red-400 p-2 hover:bg-red-50 rounded"><Trash2 size={16}/></button>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="h-40 flex flex-col items-center justify-center text-gray-400 italic">
              Carrinho vazio
            </div>
          )}
        </div>

        <div className="p-6 border-t bg-gray-50 rounded-b-3xl space-y-4">
          <div className="space-y-2">
            <select 
              className="w-full p-3 rounded-xl border bg-white outline-none focus:ring-2 focus:ring-[#d4a373]"
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
            >
              <option value="">Consumidor Final</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'CASH', icon: Banknote, label: 'Kz' },
                { id: 'MULTICAIXA', icon: CreditCard, label: 'TPA' },
                { id: 'TRANSFER', icon: Landmark, label: 'Transf' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id as any)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                    paymentMethod === method.id ? 'bg-black text-white border-black' : 'bg-white border-gray-200 text-gray-500'
                  }`}
                >
                  <method.icon size={20} />
                  <span className="text-[10px] font-bold mt-1 uppercase">{method.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal:</span>
              <span>{formatKz(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">IVA (14%):</span>
              <span>{formatKz(tax)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t mt-2">
              <span>Total:</span>
              <span className="text-[#d4a373]">{formatKz(total)}</span>
            </div>
          </div>

          <button 
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full py-4 bg-black text-white rounded-2xl font-bold tracking-widest hover:bg-[#d4a373] disabled:opacity-50 disabled:hover:bg-black transition-all shadow-xl active:scale-95"
          >
            FINALIZAR VENDA
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
