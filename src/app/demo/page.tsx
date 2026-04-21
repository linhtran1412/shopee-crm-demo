"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Bell, ChevronDown, TicketPercent, X } from "lucide-react";
import Image from "next/image";

interface Article {
  article_id: string;
  prod_name: string;
  product_type_name: string;
  price: string;
  image: string;
}

interface UserRecommend {
  customer_id: string;
  customer_name: string;
  segment: string;
  recommended_items: string[];
}

export default function ShopeeDemo() {
  const [users, setUsers] = useState<UserRecommend[]>([]);
  const [articles, setArticles] = useState<Record<string, Article>>({});
  const [selectedUser, setSelectedUser] = useState<UserRecommend | null>(null);
  const [showVoucher, setShowVoucher] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    // Load mock data
    Promise.all([
      fetch("/data/user_recommendations.json").then((res) => res.json()),
      fetch("/data/articles_info.json").then((res) => res.json()),
    ]).then(([usersData, articlesData]) => {
      setUsers(usersData);
      setSelectedUser(usersData[0]);
      
      const articleMap: Record<string, Article> = {};
      articlesData.forEach((a: Article) => {
        articleMap[a.article_id] = a;
      });
      setArticles(articleMap);
    });
  }, []);

  const triggerVoucher = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setShowVoucher(true);
      setIsSimulating(false);
      
      // Auto hide after 10s
      setTimeout(() => setShowVoucher(false), 10000);
    }, 1500); // Simulate processing time
  };

  if (!selectedUser) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-full rounded-2xl overflow-hidden shadow-sm border border-slate-200 flex flex-col relative">
      {/* Header Shopee */}
      <header className="bg-gradient-to-b from-[#f53d2d] to-[#ff6633] text-white p-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
            <ShoppingCart className="w-8 h-8" />
            Shopee
          </div>
          
          <div className="flex-1 max-w-2xl bg-white rounded-sm flex items-center px-3 py-2 shadow-sm">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm, thương hiệu..." 
              className="flex-1 outline-none text-slate-800 text-sm"
            />
            <div className="bg-[#fb5533] p-1.5 rounded-sm cursor-pointer">
              <Search className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-1 -right-2 bg-white text-[#ee4d2d] text-[10px] font-bold px-1.5 rounded-full border border-[#ee4d2d]">
                3
              </span>
            </div>
            
            {/* User Selector (Mock Login) */}
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer hover:text-white/80">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">
                  {selectedUser.customer_name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{selectedUser.customer_name}</span>
                <ChevronDown className="w-4 h-4" />
              </div>
              
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg border border-slate-100 hidden group-hover:block z-50">
                <div className="p-2 border-b border-slate-100 bg-slate-50 rounded-t-md">
                  <p className="text-xs text-slate-500 font-medium">Đổi khách hàng (Demo)</p>
                </div>
                {users.map(u => (
                  <div 
                    key={u.customer_id}
                    onClick={() => { setSelectedUser(u); setShowVoucher(false); }}
                    className="p-3 text-sm text-slate-700 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                  >
                    <p className="font-medium">{u.customer_name}</p>
                    <p className="text-xs text-[#ee4d2d] mt-0.5">{u.segment}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-5xl mx-auto w-full p-6">
        {/* Real-time Demo Controller */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800">Giả lập Hành vi Khách hàng</h3>
            <p className="text-sm text-slate-500">Mô phỏng khách hàng xem sản phẩm lâu hoặc thêm vào giỏ để kích hoạt hệ thống Real-time Voucher (Kafka Stream).</p>
          </div>
          <button 
            onClick={triggerVoucher}
            disabled={isSimulating || showVoucher}
            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSimulating ? (
              <span className="animate-pulse">Đang xử lý Stream...</span>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Thêm vào giỏ hàng
              </>
            )}
          </button>
        </div>

        {/* Recommendations Section */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-[#ee4d2d] uppercase">Gợi ý dành riêng cho bạn</h2>
            <span className="text-sm px-2 py-1 bg-[#ee4d2d]/10 text-[#ee4d2d] rounded font-medium ml-2">
              Mô hình ALS
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedUser.recommended_items.map((itemId, idx) => {
              const article = articles[itemId];
              if (!article) return null;
              
              return (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  key={itemId}
                  className="bg-white border border-slate-200 rounded-md overflow-hidden hover:border-[#ee4d2d] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="h-48 bg-slate-100 relative overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={article.image} 
                      alt={article.prod_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-0 left-0 bg-[#ee4d2d] text-white text-[10px] font-bold px-2 py-1 rounded-br-md z-10">
                      Yêu thích
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm text-slate-800 line-clamp-2 min-h-[40px] leading-snug">
                      {article.prod_name}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[#ee4d2d] font-medium">{article.price}</span>
                      <span className="text-[10px] text-slate-500">Đã bán 1.2k</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Voucher Toast Overlay */}
      <AnimatePresence>
        {showVoucher && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-8 right-8 bg-gradient-to-r from-[#ee4d2d] to-[#ff7337] p-1 rounded-xl shadow-2xl z-50 max-w-sm"
          >
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 relative overflow-hidden text-white border border-white/20">
              <button 
                onClick={() => setShowVoucher(false)}
                className="absolute top-2 right-2 text-white/70 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0 animate-bounce">
                  <TicketPercent className="w-6 h-6 text-[#ee4d2d]" />
                </div>
                <div>
                  <h4 className="font-bold text-lg leading-tight">Thời điểm vàng!</h4>
                  <p className="text-sm text-white/90 mt-1 mb-3">Hệ thống phát hiện bạn sắp thanh toán. Tặng bạn Voucher Freeship 100K để chốt đơn ngay!</p>
                  <button className="bg-white text-[#ee4d2d] px-4 py-1.5 rounded-full text-sm font-bold shadow-sm hover:scale-105 transition-transform">
                    Lưu Voucher
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
