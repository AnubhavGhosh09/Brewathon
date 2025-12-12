import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Plus, Filter, ShieldCheck, Tag, X, Send, Trash2 } from 'lucide-react';
import { MarketItem, User } from '../types';
import { db } from '../services/db';

interface MarketplaceProps {
    user: User | null;
}

const Marketplace: React.FC<MarketplaceProps> = ({ user }) => {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MarketItem | null>(null);

  useEffect(() => {
      // Load items from DB on mount
      setItems(db.getMarketItems());
  }, []);

  // Form State
  const [newItem, setNewItem] = useState({
    title: '',
    price: '',
    type: 'SELL',
    category: 'Electronics',
    description: '',
    contact: ''
  });

  const filteredItems = items.filter(item => filter === 'ALL' || item.type === filter);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const item: MarketItem = {
      id: Date.now().toString(),
      seller: user.username,
      isVerified: false,
      title: newItem.title,
      price: newItem.price,
      type: newItem.type as any,
      category: newItem.category,
      description: newItem.description,
      contact: newItem.contact
    };
    
    // Update DB
    const updatedItems = db.addMarketItem(item);
    setItems(updatedItems);
    
    setIsModalOpen(false);
    setNewItem({ title: '', price: '', type: 'SELL', category: 'Electronics', description: '', contact: '' });
  };

  const handleDelete = (e: React.MouseEvent, itemId: string) => {
      e.stopPropagation(); // Stop clicking the card
      if (!user) return;
      
      // Use standard confirm
      if (window.confirm('CONFIRM DELETION: Are you sure you want to remove this artifact?')) {
          try {
              const updatedItems = db.deleteMarketItem(itemId, user.username);
              setItems(updatedItems);
              setSelectedItem(null);
          } catch (e: any) {
              alert(e.message || "ACCESS_DENIED: Unauthorized Action.");
          }
      }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.5s_ease-out] relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3 font-mono">
            <span className="text-emerald-500">&gt;&gt;</span> BLACK_MARKET <span className="text-xs px-2 py-1 rounded bg-red-900/30 text-red-500 border border-red-500/30">UNREGULATED</span>
          </h2>
          <p className="text-slate-400 font-mono text-sm mt-1">Buy, Sell, Exchange. No snitches allowed.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 rounded-none clip-path-polygon bg-emerald-600 text-black font-bold hover:bg-emerald-500 transition-all flex items-center gap-2 border border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        >
          <Plus size={18} /> UPLOAD_LISTING
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search artifacts..." 
            className="w-full bg-black/40 border border-slate-700 rounded-lg py-3 pl-12 pr-4 text-emerald-100 focus:outline-none focus:border-emerald-500 font-mono transition-all"
          />
        </div>
        <div className="flex gap-2">
            {['ALL', 'SELL', 'BUY', 'EXCHANGE'].map((type) => (
                <button 
                    key={type}
                    onClick={() => setFilter(type)}
                    className={`px-4 py-2 text-xs font-mono border transition-all ${
                        filter === type 
                        ? 'bg-emerald-900/30 border-emerald-500 text-emerald-400' 
                        : 'bg-transparent border-slate-800 text-slate-500 hover:border-slate-600'
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div key={item.id} className="relative group">
              {/* Card Decoration */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
              
              <div className="relative bg-black border border-slate-800 p-5 h-full flex flex-col justify-between hover:bg-slate-900/50 transition-all">
                {/* Header: Badge & Delete */}
                <div className="absolute top-0 right-0 flex">
                     {user && item.seller === user.username && (
                         <button 
                            onClick={(e) => handleDelete(e, item.id)}
                            className="bg-red-900/80 hover:bg-red-600 text-white h-7 w-7 flex items-center justify-center transition-colors z-50 cursor-pointer"
                            title="Remove Listing"
                        >
                            <Trash2 size={12} />
                        </button>
                    )}
                    <span className={`text-[10px] font-bold px-2 py-1 font-mono uppercase tracking-widest h-7 flex items-center ${
                        item.type === 'SELL' ? 'bg-emerald-500 text-black' :
                        item.type === 'BUY' ? 'bg-cyan-500 text-black' :
                        'bg-purple-500 text-black'
                    }`}>
                        {item.type}
                    </span>
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Tag size={14} className="text-slate-500" />
                        <span className="text-xs text-slate-500 font-mono uppercase">{item.category}</span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors font-mono">{item.title}</h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{item.description}</p>
                </div>

                <div>
                    <div className="flex justify-between items-end border-t border-slate-800 pt-3">
                        <div>
                            <div className="text-xs text-slate-500 font-mono">SELLER_ID</div>
                            <div className="flex items-center gap-1 text-sm text-slate-300">
                                {item.seller === user?.username ? <span className="text-emerald-400 font-bold">(YOU)</span> : item.seller}
                                {item.isVerified && <ShieldCheck size={14} className="text-emerald-500" />}
                            </div>
                        </div>
                        <div className="text-xl font-bold text-emerald-400 font-mono">
                            {item.price}
                        </div>
                    </div>
                    
                    {item.seller !== user?.username ? (
                        <button 
                        onClick={() => setSelectedItem(item)}
                        className="w-full mt-3 py-2 border border-slate-700 hover:border-emerald-500 hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 text-xs font-mono uppercase tracking-wider transition-all"
                        >
                            INITIATE_CONTACT
                        </button>
                    ) : (
                        <div className="w-full mt-3 py-2 text-center text-slate-600 text-xs font-mono border border-transparent">
                            // LISTING_ACTIVE //
                        </div>
                    )}
                </div>
              </div>
          </div>
        ))}
      </div>

      {/* Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-black border border-emerald-500/50 rounded-xl shadow-[0_0_50px_rgba(16,185,129,0.2)] p-6 animate-[scaleIn_0.2s_ease-out]">
            <div className="flex justify-between items-center mb-6 border-b border-emerald-500/20 pb-4">
              <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
                <Plus className="text-emerald-500" /> NEW_LISTING
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-red-500 transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-emerald-500 mb-1">ITEM_TITLE</label>
                <input 
                  required
                  value={newItem.title}
                  onChange={e => setNewItem({...newItem, title: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none" 
                  placeholder="e.g. Mini Drafter"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-mono text-emerald-500 mb-1">PRICE</label>
                  <input 
                    required
                    value={newItem.price}
                    onChange={e => setNewItem({...newItem, price: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none" 
                    placeholder="e.g. ₹500"
                  />
                </div>
                <div className="flex-1">
                   <label className="block text-xs font-mono text-emerald-500 mb-1">TYPE</label>
                   <select 
                      value={newItem.type}
                      onChange={e => setNewItem({...newItem, type: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none"
                   >
                     <option value="SELL">SELL</option>
                     <option value="BUY">BUY</option>
                     <option value="EXCHANGE">EXCHANGE</option>
                   </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono text-emerald-500 mb-1">CATEGORY</label>
                 <select 
                      value={newItem.category}
                      onChange={e => setNewItem({...newItem, category: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none"
                   >
                     <option value="Electronics">Electronics</option>
                     <option value="Books">Books</option>
                     <option value="Stationery">Stationery</option>
                     <option value="Other">Other</option>
                   </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-emerald-500 mb-1">CONTACT_INFO</label>
                <input 
                  required
                  value={newItem.contact}
                  onChange={e => setNewItem({...newItem, contact: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none" 
                  placeholder="e.g. Discord: user#1234 or Phone"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-emerald-500 mb-1">DESCRIPTION</label>
                <textarea 
                  required
                  value={newItem.description}
                  onChange={e => setNewItem({...newItem, description: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white focus:border-emerald-500 outline-none h-24" 
                  placeholder="Details about condition, age, etc."
                />
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-black font-bold py-3 font-mono mt-2">
                CONFIRM_UPLOAD
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Contact Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="w-full max-w-sm bg-black border border-cyan-500/50 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.2)] p-6 animate-[scaleIn_0.2s_ease-out] text-center">
              <h3 className="text-xl font-bold text-white font-mono mb-2">SELLER_DATA_DECRYPTED</h3>
              <p className="text-slate-400 text-sm mb-6">Use this information to establish secure comms.</p>
              
              <div className="bg-slate-900/50 p-4 border border-dashed border-slate-700 mb-6 rounded-lg">
                 <p className="text-cyan-400 font-mono text-lg break-all select-all">{selectedItem.contact}</p>
                 <p className="text-xs text-slate-500 mt-1 uppercase">Seller: {selectedItem.seller}</p>
              </div>

              <button 
                onClick={() => setSelectedItem(null)}
                className="w-full border border-cyan-500 text-cyan-500 hover:bg-cyan-500/10 font-bold py-2 font-mono"
              >
                CLOSE_CONNECTION
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace;