
import React, { useState } from 'react';
import { UserPlus, Search, Mail, Phone, Hash, Trash2 } from 'lucide-react';
import { Customer } from '../types';

interface Props {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
}

const Customers: React.FC<Props> = ({ customers, setCustomers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newCust, setNewCust] = useState({ name: '', nif: '', email: '', phone: '' });

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.nif.includes(searchTerm)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer: Customer = {
      id: Date.now().toString(),
      ...newCust
    };
    setCustomers([...customers, customer]);
    setIsModalOpen(false);
    setNewCust({ name: '', nif: '', email: '', phone: '' });
  };

  const deleteCustomer = (id: string) => {
    if (confirm('Eliminar cliente?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Base de Clientes</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center space-x-2 bg-black text-white px-6 py-3 rounded-xl hover:bg-[#d4a373] transition-all shadow-lg"
        >
          <UserPlus size={20} />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input 
            type="text"
            placeholder="Pesquisar por nome ou NIF..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-[#d4a373]"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(customer => (
            <div key={customer.id} className="p-6 rounded-3xl border border-gray-100 bg-gray-50 hover:border-[#d4a373] transition-all relative group">
              <button 
                onClick={() => deleteCustomer(customer.id)}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={18} />
              </button>
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl font-bold mb-4 shadow-sm">
                {customer.name.charAt(0)}
              </div>
              <h4 className="text-lg font-bold mb-4">{customer.name}</h4>
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center"><Hash size={14} className="mr-2"/> NIF: {customer.nif}</div>
                <div className="flex items-center"><Mail size={14} className="mr-2"/> {customer.email}</div>
                <div className="flex items-center"><Phone size={14} className="mr-2"/> {customer.phone}</div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 italic">
              Nenhum cliente registado.
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6">Registar Cliente</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Nome Completo" required className="w-full p-3 rounded-xl border" value={newCust.name} onChange={e => setNewCust({...newCust, name: e.target.value})}/>
              <input type="text" placeholder="NIF (Número de Contribuinte)" required className="w-full p-3 rounded-xl border" value={newCust.nif} onChange={e => setNewCust({...newCust, nif: e.target.value})}/>
              <input type="email" placeholder="Email" className="w-full p-3 rounded-xl border" value={newCust.email} onChange={e => setNewCust({...newCust, email: e.target.value})}/>
              <input type="tel" placeholder="Telemóvel" className="w-full p-3 rounded-xl border" value={newCust.phone} onChange={e => setNewCust({...newCust, phone: e.target.value})}/>
              <div className="flex space-x-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold">Voltar</button>
                <button type="submit" className="flex-1 py-3 bg-black text-white rounded-xl font-bold hover:bg-[#d4a373]">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
