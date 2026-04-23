"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Bell, ChevronDown, X, Star, Zap, Heart, Tag, CheckCircle, ChevronRight, HelpCircle, Globe, Truck, FileText } from "lucide-react";

interface Article { article_id: string; prod_name: string; product_type_name: string; price: string; image: string; }
interface UserRecommend { customer_id: string; customer_name: string; segment: string; recommended_items: string[]; }

const CATEGORIES = [
  { name: "Thời Trang Nam", image: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=100&h=100&fit=crop" },
  { name: "Điện Thoại", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&h=100&fit=crop" },
  { name: "Thiết Bị Điện Tử", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop" },
  { name: "Máy Tính & Laptop", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=100&h=100&fit=crop" },
  { name: "Máy Ảnh", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop" },
  { name: "Đồng Hồ", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop" },
  { name: "Giày Dép Nam", image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=100&h=100&fit=crop" },
  { name: "Thiết Bị Điện Gia Dụng", image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=100&h=100&fit=crop" },
  { name: "Thể Thao & Du Lịch", image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=100&h=100&fit=crop" },
  { name: "Ô Tô & Xe Máy", image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=100&h=100&fit=crop" },
  { name: "Thời Trang Nữ", image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100&h=100&fit=crop" },
  { name: "Mẹ & Bé", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=100&h=100&fit=crop" },
  { name: "Nhà Cửa & Đời Sống", image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=100&h=100&fit=crop" },
  { name: "Sắc Đẹp", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=100&h=100&fit=crop" },
  { name: "Sức Khỏe", image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&h=100&fit=crop" },
  { name: "Giày Dép Nữ", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=100&h=100&fit=crop" },
  { name: "Túi Ví Nữ", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=100&h=100&fit=crop" },
  { name: "Phụ Kiện", image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?w=100&h=100&fit=crop" },
  { name: "Bách Hóa", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=100&h=100&fit=crop" },
  { name: "Chăm Sóc Thú Cưng", image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=100&h=100&fit=crop" },
];

const BANNERS = [
  { img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=1200&auto=format&fit=crop", link: "#" },
  { img: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200&auto=format&fit=crop", link: "#" },
  { img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?q=80&w=1200&auto=format&fit=crop", link: "#" },
];

const FLASH_PRODUCTS = [
  { name: "Áo Thun Nam Nữ Unisex", price: "49.000₫", original: "129.000₫", sold: 89, pct: 89, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop" },
  { name: "Quần Jean Ống Rộng", price: "189.000₫", original: "350.000₫", sold: 72, pct: 72, img: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop" },
  { name: "Váy Babydoll Dễ Thương", price: "135.000₫", original: "280.000₫", sold: 95, pct: 95, img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&h=300&fit=crop" },
  { name: "Áo Khoác Nam Dù", price: "245.000₫", original: "480.000₫", sold: 61, pct: 61, img: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=300&h=300&fit=crop" },
  { name: "Giày Thể Thao Nam Nữ", price: "320.000₫", original: "590.000₫", sold: 84, pct: 84, img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop" },
  { name: "Túi Đeo Chéo Nữ", price: "89.000₫", original: "175.000₫", sold: 77, pct: 77, img: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=300&h=300&fit=crop" },
];

function useCountdown() {
  const [time, setTime] = useState({ h: 2, m: 45, s: 30 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--; if (s < 0) { s = 59; m--; } if (m < 0) { m = 59; h--; } if (h < 0) { h = 2; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  return time;
}

export default function ShopeeDemo() {
  const [users, setUsers] = useState<UserRecommend[]>([]);
  const [articles, setArticles] = useState<Record<string, Article>>({});
  const [selectedUser, setSelectedUser] = useState<UserRecommend | null>(null);
  const [showVoucher, setShowVoucher] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [bannerIdx, setBannerIdx] = useState(0);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [cartFlash, setCartFlash] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [voucherClaimed, setVoucherClaimed] = useState(false);
  const [activeTab, setActiveTab] = useState("AI_REC");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [modalQty, setModalQty] = useState(1);
  const [modalColor, setModalColor] = useState("Đen");
  const [modalSize, setModalSize] = useState("L");
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [shippingInfo, setShippingInfo] = useState({ name: "", phone: "", address: "" });
  
  const [showCart, setShowCart] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<any[]>([]);
  const [selectedCartIndices, setSelectedCartIndices] = useState<Set<number>>(new Set());
  
  const time = useCountdown();

  useEffect(() => {
    if (selectedUser) {
      setModalQty(1);
      setModalColor("Đen");
      setModalSize("L");
      setShippingInfo({ name: selectedUser.customer_name, phone: "0912345678", address: "123 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh" });
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser && Object.keys(articles).length > 0) {
      const sampleProduct = Object.values(articles)[0] || { prod_name: "Sản phẩm Demo", price: "150.000₫", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300" };
      setOrders([{
        id: "ORD-" + Math.floor(Math.random() * 1000000),
        date: "2025-12-15T10:00:00Z",
        status: "Đã giao",
        items: [{ product: sampleProduct, qty: 2, color: "Đen", size: "L" }],
        total: parseInt(sampleProduct.price.replace(/\D/g, '')) * 2,
        address: { name: selectedUser.customer_name, phone: "0912345678", address: "123 Đường Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh" },
        aiFlag: true
      }]);
    }
  }, [selectedUser, articles]);

  useEffect(() => {
    Promise.all([
      fetch("/data/user_recommendations.json").then(r => r.json()),
      fetch("/data/articles_info.json").then(r => r.json()),
    ]).then(([u, a]) => {
      setUsers(u); setSelectedUser(u[0]);
      const map: Record<string, Article> = {};
      a.forEach((x: Article) => { map[x.article_id] = x; });
      setArticles(map);
    });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setBannerIdx(i => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);

  const handleAddToCart = () => {
    if(!selectedProduct) return;
    const newItem = { product: selectedProduct, qty: modalQty, color: modalColor, size: modalSize };
    setCartItems(prev => [...prev, newItem]);
    setCartCount(c => c + modalQty);
    setCartFlash(selectedProduct.prod_name || selectedProduct.name);
    setTimeout(() => setCartFlash(null), 2500);
    setProcessing(true);
    setSelectedProduct(null);
    setTimeout(() => { setProcessing(false); setShowVoucher(true); setVoucherClaimed(false); setTimeout(() => setShowVoucher(false), 12000); }, 1800);
  };
  
  // Refined Buy Now logic
  const handleBuyNow = () => {
    if(!selectedProduct) return;
    const newItem = { product: selectedProduct, qty: modalQty, color: modalColor, size: modalSize };
    // Add to cart as well
    setCartItems(prev => [...prev, newItem]);
    setCartCount(c => c + modalQty);
    // Proceed to checkout only with this item
    setCheckoutItems([newItem]);
    setSelectedProduct(null);
    setShowCheckout(true);
  };
  
  // Cart Actions
  const updateCartQty = (idx: number, delta: number) => {
    setCartItems(prev => {
      const next = [...prev];
      const item = {...next[idx]};
      const oldQty = item.qty;
      item.qty = Math.max(1, item.qty + delta);
      next[idx] = item;
      setCartCount(c => c - oldQty + item.qty);
      return next;
    });
  };

  const removeCartItem = (idx: number) => {
    setCartItems(prev => {
      const next = prev.filter((_, i) => i !== idx);
      setCartCount(c => c - prev[idx].qty);
      return next;
    });
    const nextSelected = new Set(selectedCartIndices);
    nextSelected.delete(idx);
    setSelectedCartIndices(nextSelected);
  };

  const toggleSelectCartItem = (idx: number) => {
    const next = new Set(selectedCartIndices);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setSelectedCartIndices(next);
  };

  const selectAllCartItems = () => {
    if (selectedCartIndices.size === cartItems.length) {
      setSelectedCartIndices(new Set());
    } else {
      setSelectedCartIndices(new Set(cartItems.map((_, i) => i)));
    }
  };

  const handleCartCheckout = () => {
    if (selectedCartIndices.size === 0) return;
    const selected = cartItems.filter((_, i) => selectedCartIndices.has(i));
    setCheckoutItems(selected);
    setShowCart(false);
    setShowCheckout(true);
  };

  const handleClaimVoucher = () => {
    setVoucherClaimed(true);
    setTimeout(() => {
      setShowVoucher(false);
    }, 2500);
  };

  const pad = (n: number) => String(n).padStart(2, "0");
  if (!selectedUser) return <div className="p-8 text-center text-slate-500 min-h-screen bg-[#f5f5f5] flex items-center justify-center">Đang tải trải nghiệm...</div>;

  return (
    <div className="bg-[#f5f5f5] min-h-screen flex flex-col relative font-[family-name:var(--font-inter)]">

      {/* ── HEADER ── */}
      <header className="bg-gradient-to-b from-[#f53d2d] to-[#ff6633] text-white sticky top-0 z-40 shadow-sm">
        {/* Top Navbar */}
        <div className="max-w-[1200px] mx-auto px-4 flex justify-between items-center text-[13px] py-1.5 font-light">
          <div className="flex items-center gap-3 divide-x divide-white/40">
            <span className="hover:text-white/80 cursor-pointer transition-colors">Kênh Người Bán</span>
            <span className="pl-3 hover:text-white/80 cursor-pointer transition-colors">Trở thành Người bán Shopee</span>
            <span className="pl-3 hover:text-white/80 cursor-pointer transition-colors">Tải ứng dụng</span>
            <div className="pl-3 flex items-center gap-1.5">
              Kết nối 
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 cursor-pointer hover:opacity-80"><path d="M12 2.04c-5.5 0-10 4.48-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.54-4.5-10.02-10-10.02Z"/></svg>
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 cursor-pointer hover:opacity-80"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.64-.07-4.85s.01-3.58.07-4.85C2.38 3.86 3.9 2.31 7.15 2.16c1.27-.06 1.64-.07 4.85-.07Zm0-2.16C8.74 0 8.33.01 7.05.07 2.76.26.26 2.76.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.19 4.29 2.69 6.79 6.98 6.98 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c4.29-.19 6.79-2.69 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.19-4.29-2.69-6.79-6.98-6.98C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm5.8-9.8a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z"/></svg>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div onClick={() => setShowOrderHistory(true)} className="flex items-center gap-1.5 hover:text-white/80 cursor-pointer transition-colors font-medium">
              <FileText className="w-4 h-4" /> Đơn Mua
            </div>
            <div className="flex items-center gap-1.5 hover:text-white/80 cursor-pointer transition-colors">
              <Bell className="w-4 h-4" /> Thông báo
            </div>
            <div className="flex items-center gap-1.5 hover:text-white/80 cursor-pointer transition-colors">
              <HelpCircle className="w-4 h-4" /> Hỗ trợ
            </div>
            <div className="flex items-center gap-1.5 hover:text-white/80 cursor-pointer transition-colors">
              <Globe className="w-4 h-4" /> Tiếng Việt <ChevronDown className="w-3 h-3"/>
            </div>
            {/* User Selector Dropdown */}
            <div className="relative group ml-2 font-medium">
              <div className="flex items-center gap-1.5 cursor-pointer hover:text-white/80 py-1 transition-colors">
                <div className="w-5 h-5 rounded-full bg-white text-[#ee4d2d] flex items-center justify-center font-bold text-[10px]">
                  {selectedUser.customer_name.charAt(0)}
                </div>
                <span>{selectedUser.customer_name}</span>
                <ChevronDown className="w-3 h-3" />
              </div>
              <div className="absolute right-0 top-full mt-0 w-64 bg-white rounded-sm shadow-[0_1px_15px_rgba(0,0,0,0.1)] hidden group-hover:block z-50 text-slate-800 before:content-[''] before:absolute before:-top-2 before:right-4 before:border-4 before:border-transparent before:border-b-white">
                <div className="px-4 py-3 bg-orange-50/50 border-b border-slate-100 text-xs font-semibold flex items-center justify-between text-slate-500">
                  <span>🎭 Giao diện giả lập (Đổi User)</span>
                  <span className="bg-[#ee4d2d] text-white px-1.5 py-0.5 rounded text-[9px] font-black tracking-widest">AI DEMO</span>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {users.map(u => (
                    <div key={u.customer_id} onClick={() => { setSelectedUser(u); setShowVoucher(false); setCartCount(0); }}
                      className={`px-4 py-3 cursor-pointer hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors ${selectedUser.customer_id === u.customer_id ? "bg-orange-50/30" : ""}`}>
                      <div className="flex items-center justify-between">
                        <p className="text-[13px] font-medium text-slate-800">{u.customer_name}</p>
                        {selectedUser.customer_id === u.customer_id && <CheckCircle className="w-3 h-3 text-[#ee4d2d]"/>}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-[#ee4d2d]" /> Phân khúc: <span className="text-[#ee4d2d] font-medium">{u.segment}</span>
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar section */}
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center gap-10">
          <div className="flex items-end gap-1.5 cursor-pointer select-none">
            {/* Shopee Logo Mock */}
            <div className="text-3xl font-bold tracking-tighter flex items-center gap-2">
              <ShoppingBagIcon /> Shopee
            </div>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <div className="relative flex items-center bg-white rounded-sm p-1 shadow-sm">
              <input 
                type="text" 
                placeholder="FREESHIP ĐẾN 300K, MUA NGAY!" 
                className="flex-1 px-3 py-1.5 outline-none text-slate-700 text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              <button className="bg-[#fb5533] hover:bg-[#fb5533]/90 w-16 flex items-center justify-center py-2 rounded-sm transition-colors z-10">
                <Search className="w-4 h-4 text-white" />
              </button>
              
              {/* Search Suggestions Dropdown */}
              <AnimatePresence>
                {searchFocused && searchTerm && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="absolute top-[110%] left-0 right-0 bg-white shadow-[0_4px_15px_rgba(0,0,0,0.1)] rounded-sm border border-slate-100 z-50 overflow-hidden">
                    {(() => {
                      const allArticles = Object.values(articles);
                      const filtered = allArticles.filter(a => a.prod_name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 6);
                      
                      if (filtered.length === 0) return <div className="p-3 text-sm text-slate-500 italic flex items-center gap-2"><Search className="w-4 h-4"/> Không tìm thấy "{searchTerm}"</div>;
                      
                      return (
                        <div className="py-1">
                          <div className="px-3 py-1.5 text-[12px] font-semibold text-[#ee4d2d] bg-orange-50/50 flex items-center gap-1.5">
                            <Search className="w-3 h-3" /> Gợi ý sản phẩm
                          </div>
                          {filtered.map((a, i) => (
                            <div key={i} onClick={() => { setSelectedProduct(a); setSearchFocused(false); }} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 cursor-pointer text-slate-700 transition-colors">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={a.image} className="w-8 h-8 object-cover rounded-sm border border-slate-100" alt=""/>
                              <span className="text-[13px] truncate flex-1">{a.prod_name}</span>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="flex gap-3 text-[11px] text-white/90">
              <span className="cursor-pointer hover:text-white">Dép</span>
              <span className="cursor-pointer hover:text-white">Áo Phông</span>
              <span className="cursor-pointer hover:text-white">Áo Khoác</span>
              <span className="cursor-pointer hover:text-white">Túi Xách Nữ</span>
              <span className="cursor-pointer hover:text-white">Áo Croptop</span>
              <span className="cursor-pointer hover:text-white">Váy</span>
              <span className="cursor-pointer hover:text-white">Giày Búp Bê</span>
            </div>
          </div>
          <div className="relative cursor-pointer hover:bg-white/10 p-2 rounded-full transition-colors group">
            <ShoppingCart className="w-7 h-7" />
            {cartCount > 0 && (
              <motion.span key={cartCount} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="absolute 0 top-0 right-0 bg-white text-[#ee4d2d] border-2 border-[#ee4d2d] text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none translate-x-1/2 -translate-y-1/4">
                {cartCount}
              </motion.span>
            )}
            
            {/* Cart Dropdown Preview */}
            <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-sm shadow-[0_1px_20px_rgba(0,0,0,0.1)] hidden group-hover:block z-50 text-slate-800 before:content-[''] before:absolute before:-top-2 before:right-3 before:border-4 before:border-transparent before:border-b-white cursor-default">
              {cartCount === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingCart className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-sm text-slate-400">Chưa có sản phẩm</p>
                </div>
              ) : (
                <div>
                  <div className="px-3 py-2 text-sm text-slate-400">Sản phẩm mới thêm</div>
                  <div className="max-h-80 overflow-y-auto">
                     {/* Dynamic Cart Items */}
                     {cartItems.slice().reverse().slice(0, 5).map((item, i) => (
                       <div key={i} className="flex items-center gap-3 px-3 py-2.5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50 last:border-0">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                         <img src={item.product.image || item.product.img} className="w-10 h-10 object-cover border border-slate-100 rounded-sm" alt=""/>
                         <div className="flex-1 truncate">
                           <div className="text-sm truncate text-slate-700">{item.product.prod_name || item.product.name}</div>
                           <div className="text-[11px] text-slate-400 mt-0.5">Phân loại: {item.color}, {item.size} <span className="font-semibold px-1">x{item.qty}</span></div>
                         </div>
                         <div className="text-[#ee4d2d] text-sm">₫{parseInt((item.product.price || "0").replace(/\D/g, '')).toLocaleString()}</div>
                       </div>
                     ))}
                  </div>
                  <div className="p-3 bg-slate-50 flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">{cartItems.length} Thêm hàng vào giỏ</span>
                    <button onClick={() => setShowCart(true)} className="bg-[#ee4d2d] hover:bg-[#d44226] text-white px-4 py-2 rounded-sm text-sm transition-colors">Xem Giỏ Hàng</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── AI ENGINE FLOATING INDICATOR ── */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="bg-black/70 backdrop-blur-md border border-white/10 shadow-2xl rounded-full px-5 py-2.5 flex items-center gap-4 text-white pointer-events-auto cursor-pointer hover:bg-black/80 transition-colors group">
           <div className="relative flex items-center justify-center">
             <div className="absolute inset-0 bg-[#ee4d2d] rounded-full blur-md opacity-50 group-hover:opacity-100 animate-pulse transition-opacity"></div>
             <div className="w-8 h-8 bg-gradient-to-br from-[#ee4d2d] to-[#ff7337] rounded-full flex items-center justify-center relative z-10 shadow-inner">
               <Zap className="w-4 h-4 text-white" />
             </div>
           </div>
           <div className="flex flex-col">
             <div className="flex items-center gap-2">
               <span className="font-bold text-[13px] tracking-wide">AI RECOMMENDATION ENGINE</span>
               <span className="flex items-center gap-1.5 text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/30">
                 <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> LIVE
               </span>
             </div>
             <span className="text-[11px] text-white/60">Đang theo dõi hành vi của {selectedUser.customer_name}</span>
           </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1200px] mx-auto w-full px-4 py-8 space-y-6">

        {/* ── TOP BANNER CAROUSEL ── */}
        <div className="flex gap-2 h-[235px]">
          <div className="flex-[2] relative rounded-sm overflow-hidden group cursor-pointer">
            <AnimatePresence mode="wait">
              <motion.div key={bannerIdx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
                className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BANNERS[bannerIdx].img} className="w-full h-full object-cover" alt="Banner" />
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {BANNERS.map((_, i) => (
                <div key={i} onClick={() => setBannerIdx(i)} className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all border border-black/10 ${i === bannerIdx ? "bg-[#ee4d2d]" : "bg-white/80"}`} />
              ))}
            </div>
            <button className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-sm hover:bg-black/40"><ChevronRight className="w-6 h-6 rotate-180"/></button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/20 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-sm hover:bg-black/40"><ChevronRight className="w-6 h-6"/></button>
          </div>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex-1 rounded-sm overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop" alt="Side banner 1" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 rounded-sm overflow-hidden cursor-pointer hover:opacity-95 transition-opacity">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=600&auto=format&fit=crop" alt="Side banner 2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* ── CATEGORIES ── */}
        <div className="bg-white rounded-sm shadow-sm pt-4 pb-2">
          <div className="px-5 text-slate-500 font-medium uppercase text-sm mb-4">Danh Mục</div>
          <div className="grid grid-cols-10 grid-rows-2 border-t border-l border-slate-100">
            {CATEGORIES.map(c => (
              <div key={c.name} className="flex flex-col items-center justify-center p-2 border-r border-b border-slate-100 hover:shadow-[0_0_10px_rgba(0,0,0,0.05)] hover:z-10 cursor-pointer transition-shadow bg-white h-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.name} className="w-16 h-16 object-contain mb-2 hover:scale-110 transition-transform duration-300" />
                <span className="text-[13px] text-slate-700 text-center leading-tight">{c.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── FLASH SALE ── */}
        <div className="bg-white rounded-sm shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              {/* Flash Sale Logo Mock */}
              <div className="flex items-end italic tracking-tighter">
                <span className="text-2xl font-black text-[#ee4d2d] mr-1">F L A S H</span>
                <span className="text-2xl font-black text-[#ee4d2d]">S A L E</span>
                <Zap className="w-8 h-8 text-[#ee4d2d] ml-1 fill-[#ee4d2d]" />
              </div>
              <div className="flex items-center gap-1.5 ml-4">
                {[pad(time.h), pad(time.m), pad(time.s)].map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="bg-black text-white font-bold text-sm px-2.5 py-1 rounded-sm">{t}</span>
                  </span>
                ))}
              </div>
            </div>
            <span className="text-sm text-[#ee4d2d] cursor-pointer hover:text-[#ee4d2d]/80 flex items-center">Xem tất cả <ChevronRight className="w-4 h-4"/></span>
          </div>
          <div className="p-4 grid grid-cols-6 gap-4">
            {FLASH_PRODUCTS.map((p, i) => (
              <div key={i} className="cursor-pointer group flex flex-col items-center" onClick={() => setSelectedProduct(p)}>
                <div className="relative w-full aspect-square bg-slate-50 mb-2 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute top-0 right-0 bg-[#ffe97a] text-[#ee4d2d] text-[12px] font-bold px-1.5 py-0.5 flex flex-col items-center">
                    <span>{Math.round((1 - parseInt(p.price) / parseInt(p.original)) * 100)}%</span>
                    <span className="text-[10px] text-white bg-[#ee4d2d] px-1 w-[calc(100%+0.75rem)] text-center font-semibold mt-0.5">GIẢM</span>
                  </div>
                  {/* Flash sale frame overlay mock */}
                  <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-orange-200/50 to-transparent z-10"></div>
                </div>
                <p className="text-[#ee4d2d] font-bold text-lg leading-none">{p.price}</p>
                <div className="w-full mt-2 relative h-4 bg-[#ffbda6] rounded-full overflow-hidden flex items-center justify-center">
                  <div className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-[#ee4d2d] to-[#ff6633] rounded-full" style={{ width: `${p.sold}%` }} />
                  <span className="relative z-10 text-[10px] font-bold text-white uppercase shadow-sm">Đã bán {p.sold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── AI RECOMMENDATIONS ── */}
        <div className="mt-8">
          {/* Tabs */}
          <div className="bg-white flex rounded-sm shadow-sm mb-1 sticky top-[100px] z-30">
            <div onClick={() => setActiveTab("AI_REC")} className={`flex-1 py-4 text-center cursor-pointer transition-colors ${activeTab === "AI_REC" ? "border-b-4 border-[#ee4d2d] text-[#ee4d2d] font-medium" : "text-slate-500 hover:text-[#ee4d2d]"}`}>
              GỢI Ý DÀNH CHO BẠN
            </div>
            <div onClick={() => setActiveTab("NEW_ARRIVAL")} className={`flex-1 py-4 text-center cursor-pointer transition-colors ${activeTab === "NEW_ARRIVAL" ? "border-b-4 border-[#ee4d2d] text-[#ee4d2d] font-medium" : "text-slate-500 hover:text-[#ee4d2d]"}`}>
              HÀNG MỚI VỀ
            </div>
            <div onClick={() => setActiveTab("TOP_SELLER")} className={`flex-1 py-4 text-center cursor-pointer transition-colors ${activeTab === "TOP_SELLER" ? "border-b-4 border-[#ee4d2d] text-[#ee4d2d] font-medium" : "text-slate-500 hover:text-[#ee4d2d]"}`}>
              MUA NHIỀU NHẤT
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
            {(() => {
              const allArticles = Object.values(articles);
              let items = selectedUser.recommended_items.map(id => articles[id]).filter(Boolean);
              if (activeTab === "NEW_ARRIVAL") items = allArticles.slice(0, 15);
              if (activeTab === "TOP_SELLER") items = allArticles.slice().reverse().slice(0, 15);
              
              return items.map((a, idx) => {
                const liked = wishlist.has(a.article_id);
                return (
                  <div key={a.article_id + idx} onClick={() => setSelectedProduct(a)} 
                    className="bg-white rounded-sm overflow-hidden hover:shadow-[0_1px_20px_rgba(0,0,0,0.1)] border border-transparent hover:border-[#ee4d2d] transition-all cursor-pointer group flex flex-col h-full relative">
                    
                    {/* AI Badge Overlay */}
                    {activeTab === "AI_REC" && (
                      <div className="absolute top-0 left-0 z-10 bg-[#ee4d2d] text-white text-[10px] font-bold px-2 py-1 rounded-br-lg flex items-center gap-1 shadow-sm">
                        <Zap className="w-3 h-3 fill-white"/> Đề xuất bởi AI
                      </div>
                    )}
                    {activeTab === "NEW_ARRIVAL" && (
                      <div className="absolute top-0 left-0 z-10 bg-blue-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg shadow-sm">
                        Mới ra mắt
                      </div>
                    )}
                    {activeTab === "TOP_SELLER" && (
                      <div className="absolute top-0 left-0 z-10 bg-yellow-500 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg shadow-sm">
                        Bán chạy
                      </div>
                    )}

                    <div className="relative aspect-square bg-slate-50 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={a.image} alt={a.prod_name} className="w-full h-full object-cover" />
                      
                      {/* Hover actions */}
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform bg-[#ee4d2d] text-white text-center text-sm font-medium opacity-0 group-hover:opacity-100">
                        Tìm sản phẩm tương tự
                      </div>
                    </div>

                    <div className="p-2 flex flex-col flex-1">
                      <p className="text-[13px] text-slate-800 line-clamp-2 min-h-[36px] leading-tight mb-2">
                        {a.prod_name}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {activeTab === "TOP_SELLER" ? (
                          <span className="text-[10px] text-[#ee4d2d] border border-[#ee4d2d] px-1 bg-red-50">Đang bán chạy</span>
                        ) : activeTab === "AI_REC" ? (
                          <span className="text-[10px] text-[#ee4d2d] border border-[#ee4d2d] px-1 bg-red-50">Phù hợp với bạn</span>
                        ) : (
                          <span className="text-[10px] text-slate-500 border border-slate-300 px-1 bg-slate-50">Thời trang</span>
                        )}
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-start text-[#ee4d2d]">
                          <span className="text-[10px] mt-1 mr-0.5">₫</span>
                          <span className="text-base font-medium">{a.price}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">Đã bán {activeTab === "TOP_SELLER" ? "8,5k" : "1,2k"}</span>
                      </div>
                    </div>
                    
                    {/* Hover Add to cart button */}
                    <button onClick={(e) => { e.stopPropagation(); addToCart(a.prod_name, a); }}
                      className="absolute bottom-2 right-2 w-8 h-8 bg-[#ee4d2d] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-md translate-y-4 group-hover:translate-y-0 z-20">
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                );
              });
            })()}
          </div>
          
          <div className="mt-6 text-center">
            <button className="bg-white border border-slate-300 text-slate-600 px-32 py-2.5 rounded-sm hover:bg-slate-50 transition-colors text-sm font-medium">
              Xem Thêm
            </button>
          </div>
        </div>
      </main>

      {/* ── FOOTER MOCK ── */}
      <footer className="border-t-[4px] border-[#ee4d2d] bg-white mt-10 pt-10 pb-20">
        <div className="max-w-[1200px] mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 Shopee CRM Big Data Project. Demo Only.</p>
        </div>
      </footer>

      {/* ── PRODUCT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}>
            <motion.div initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-sm overflow-hidden shadow-2xl max-w-4xl w-full flex flex-col md:flex-row relative">
              
              <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center bg-black/10 hover:bg-black/20 rounded-full text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>

              <div className="w-full md:w-5/12 aspect-square md:aspect-auto bg-slate-50 relative p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={selectedProduct.image || selectedProduct.img} alt={selectedProduct.prod_name || selectedProduct.name} className="w-full h-full object-contain" />
              </div>
              
              <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-[#ee4d2d] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">Yêu Thích</span>
                  <span className="text-sm text-slate-500">{selectedProduct.product_type_name || "Sản phẩm chính hãng"}</span>
                </div>
                
                <h3 className="text-xl md:text-2xl font-medium text-slate-900 leading-snug">
                  {selectedProduct.prod_name || selectedProduct.name}
                </h3>
                
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-600">
                  <div className="flex items-center gap-1">
                    <span className="text-[#ee4d2d] font-medium text-base border-b border-[#ee4d2d]">4.9</span>
                    <div className="flex text-[#ee4d2d]">
                      <Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current" /><Star className="w-4 h-4 fill-current text-slate-200" />
                    </div>
                  </div>
                  <div className="w-px h-4 bg-slate-300"></div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-base text-slate-900 border-b border-slate-900">1,2k</span> Đánh giá
                  </div>
                  <div className="w-px h-4 bg-slate-300"></div>
                  <div>
                    <span className="font-medium text-base text-slate-900">{selectedProduct.sold || "10,5k"}</span> Đã bán
                  </div>
                </div>

                <div className="bg-slate-50 p-5 mt-5 rounded-sm flex items-center gap-4">
                  {(selectedProduct.original || selectedProduct.original_price) && (
                    <span className="text-slate-400 line-through text-base">{selectedProduct.original || selectedProduct.original_price}</span>
                  )}
                  <span className="text-[#ee4d2d] text-3xl font-medium flex items-start"><span className="text-lg mt-1 mr-0.5">₫</span>{selectedProduct.price.replace("₫", "")}</span>
                  {selectedProduct.original && (
                    <span className="bg-[#ee4d2d] text-white text-xs font-bold px-1.5 py-0.5 rounded-sm uppercase ml-2">
                      {Math.round((1 - parseInt(selectedProduct.price) / parseInt(selectedProduct.original)) * 100)}% GIẢM
                    </span>
                  )}
                </div>
                
                {/* Product Variants (Color, Size, Qty) */}
                <div className="mt-6 flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400 w-24">Màu sắc</span>
                    <div className="flex gap-2">
                      {["Đen", "Trắng", "Xám"].map(c => (
                        <button key={c} onClick={() => setModalColor(c)} className={`px-4 py-1.5 border rounded-sm transition-colors ${modalColor === c ? "border-[#ee4d2d] text-[#ee4d2d] bg-orange-50" : "border-slate-200 hover:border-[#ee4d2d] text-slate-700"}`}>{c}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-slate-400 w-24">Kích cỡ</span>
                    <div className="flex gap-2">
                      {["M", "L", "XL"].map(s => (
                        <button key={s} onClick={() => setModalSize(s)} className={`px-4 py-1.5 border rounded-sm transition-colors ${modalSize === s ? "border-[#ee4d2d] text-[#ee4d2d] bg-orange-50" : "border-slate-200 hover:border-[#ee4d2d] text-slate-700"}`}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm mt-2">
                    <span className="text-slate-400 w-24">Số lượng</span>
                    <div className="flex items-center border border-slate-200 rounded-sm">
                      <button onClick={() => setModalQty(Math.max(1, modalQty - 1))} className="px-3 py-1 border-r border-slate-200 hover:bg-slate-50 text-slate-600">-</button>
                      <span className="w-12 text-center text-slate-800">{modalQty}</span>
                      <button onClick={() => setModalQty(modalQty + 1)} className="px-3 py-1 border-l border-slate-200 hover:bg-slate-50 text-slate-600">+</button>
                    </div>
                    <span className="text-slate-400 ml-4">1245 sản phẩm có sẵn</span>
                  </div>
                </div>
                
                <div className="mt-6 text-sm text-slate-600 flex items-center gap-4">
                  <span className="text-slate-400 w-24">Vận chuyển</span>
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-[#00bfa5]" />
                    <span>Miễn phí vận chuyển</span>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-600 flex items-center gap-4">
                  <span className="text-slate-400 w-24">Phân tích bởi</span>
                  <div className="flex items-center gap-1.5 bg-[#ee4d2d]/10 text-[#ee4d2d] px-2 py-1 rounded-sm border border-[#ee4d2d]/20 w-fit">
                    <Zap className="w-4 h-4 fill-current"/> AI Recommendation Engine
                  </div>
                </div>
                
                <div className="mt-auto pt-8 flex gap-4">
                  <button onClick={handleAddToCart} 
                    className="flex-1 bg-[#ee4d2d]/10 border border-[#ee4d2d] text-[#ee4d2d] py-3 rounded-sm text-sm font-medium flex items-center justify-center gap-2 hover:bg-[#ee4d2d]/20 transition-colors">
                    <ShoppingCart className="w-5 h-5" /> Thêm Vào Giỏ Hàng
                  </button>
                  <button onClick={handleBuyNow}
                    className="flex-1 bg-[#ee4d2d] text-white py-3 rounded-sm text-sm font-medium shadow-sm hover:bg-[#d44226] transition-colors">
                    Mua Ngay
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CART FLASH NOTIFICATION ── */}
      <AnimatePresence>
        {cartFlash && (
          <motion.div initial={{ opacity: 0, y: 0, scale: 0.9 }} animate={{ opacity: 1, y: -40, scale: 1 }} exit={{ opacity: 0, y: -60, scale: 0.9 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white px-8 py-6 rounded-lg shadow-2xl z-[60] flex flex-col items-center gap-3 backdrop-blur-sm pointer-events-none">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <p className="text-lg font-medium">Sản phẩm đã được thêm vào Giỏ hàng</p>
            {processing && <p className="text-yellow-400 text-sm mt-2 flex items-center gap-2"><Zap className="w-4 h-4 animate-pulse"/> AI đang phân tích hành vi...</p>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── VOUCHER POPUP ── */}
      <AnimatePresence>
        {showVoucher && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.5, opacity: 0, rotate: -5 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} exit={{ scale: 0.8, opacity: 0, rotate: 5 }} transition={{ type: "spring", bounce: 0.5 }}
              className="bg-transparent relative w-full max-w-sm">
              
              {/* Confetti effect background layer could go here */}

              <div className="bg-[#f6422d] rounded-xl overflow-hidden shadow-[0_0_50px_rgba(238,77,45,0.5)] border-4 border-[#ffcdb2]">
                {/* Header pattern */}
                <div className="h-32 bg-gradient-to-br from-[#ff5e3a] to-[#ff2a00] relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle, #ffffff 2px, transparent 2px)", backgroundSize: "16px 16px" }}></div>
                  
                  {voucherClaimed ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="z-10 bg-white p-3 rounded-full shadow-lg">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </motion.div>
                  ) : (
                    <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="z-10 bg-white p-4 rounded-full shadow-lg">
                      <span className="text-4xl">🎁</span>
                    </motion.div>
                  )}
                  
                  <button onClick={() => setShowVoucher(false)} className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/20 rounded-full p-1 z-20"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="bg-white px-6 pt-8 pb-6 relative text-center">
                  {/* Decorative cutout circles */}
                  <div className="absolute top-0 left-0 w-8 h-8 bg-[#f6422d] rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 bg-[#f6422d] rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  <div className="absolute top-0 left-4 right-4 border-t-2 border-dashed border-slate-200"></div>

                  {voucherClaimed ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                      <h3 className="text-2xl font-bold text-slate-800">Lưu Thành Công!</h3>
                      <p className="text-slate-500 text-sm">Voucher <strong className="text-[#ee4d2d]">FREESHIP100K</strong> đã được thêm vào Kho Voucher của bạn.</p>
                      <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-500">Tự động đóng sau 2 giây...</div>
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-center gap-1.5 text-xs text-[#ee4d2d] font-bold mb-2 bg-[#ee4d2d]/10 w-fit mx-auto px-2 py-1 rounded">
                          <Zap className="w-3 h-3 fill-current"/> AI TRIGGERED
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 leading-tight">Thời Điểm Vàng Để Chốt Đơn!</h3>
                        <p className="text-sm text-slate-500 mt-2">Dựa trên phân tích hành vi, chúng tôi tặng bạn ưu đãi đặc quyền này.</p>
                      </div>
                      
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 my-6 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#ee4d2d]"></div>
                        <p className="text-3xl font-black text-[#ee4d2d] tracking-tight">FREESHIP<span className="text-xl">100K</span></p>
                        <p className="text-xs text-orange-600 mt-1">Hết hạn trong 15 phút tới!</p>
                      </div>
                      
                      <button onClick={handleClaimVoucher} className="w-full bg-[#ee4d2d] text-white py-3 rounded-sm font-bold text-base hover:bg-[#d44226] transition-colors shadow-lg shadow-[#ee4d2d]/30">
                        Lưu Voucher Ngay
                      </button>
                      <button onClick={() => setShowVoucher(false)} className="text-sm text-slate-400 hover:text-slate-600 mt-3 hover:underline">
                        Bỏ qua ưu đãi này
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* ── CHECKOUT MODAL ── */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#f5f5f5] w-full max-w-3xl rounded-sm shadow-2xl my-8 overflow-hidden relative flex flex-col max-h-[90vh]">
              {/* Checkout Header */}
              <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                <div className="text-[#ee4d2d] text-xl font-medium flex items-center gap-2">Thanh Toán Shopee</div>
                <button onClick={() => { setShowCheckout(false); setCheckoutSuccess(false); }} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors"><X className="w-5 h-5"/></button>
              </div>

              {checkoutSuccess ? (
                <div className="bg-white p-16 text-center flex flex-col items-center justify-center min-h-[50vh]">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", bounce: 0.6 }} className="mb-6">
                    <CheckCircle className="w-24 h-24 text-[#00bfa5]" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-3">Đặt Hàng Thành Công!</h2>
                  <p className="text-slate-500 mb-8 text-lg">Cảm ơn bạn đã mua sắm tại Shopee CRM Demo.</p>
                  <button onClick={() => { setShowCheckout(false); setCheckoutSuccess(false); setCartCount(0); setCartItems([]); }} className="bg-[#ee4d2d] text-white px-10 py-3 rounded-sm font-medium hover:bg-[#d44226] shadow-lg shadow-[#ee4d2d]/30 transition-colors">
                    Tiếp Tục Mua Sắm
                  </button>
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                  {/* Address */}
                  <div className="bg-white p-6 rounded-sm shadow-sm border-t-[3px] border-[#ee4d2d] relative overflow-hidden">
                    <div className="text-[#ee4d2d] font-medium text-base mb-4 flex items-center gap-2"><Globe className="w-4 h-4"/> Địa Chỉ Nhận Hàng</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input type="text" placeholder="Họ và Tên" value={shippingInfo.name} onChange={e => setShippingInfo({...shippingInfo, name: e.target.value})} className="border border-slate-300 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#ee4d2d] transition-colors" />
                      <input type="text" placeholder="Số điện thoại" value={shippingInfo.phone} onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} className="border border-slate-300 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#ee4d2d] transition-colors" />
                      <input type="text" placeholder="Địa chỉ chi tiết (Số nhà, Đường, Phường, Quận, Thành phố)" value={shippingInfo.address} onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})} className="col-span-1 md:col-span-2 border border-slate-300 rounded-sm px-3 py-2.5 text-sm outline-none focus:border-[#ee4d2d] transition-colors" />
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="bg-white p-6 rounded-sm shadow-sm">
                    <div className="grid grid-cols-12 text-slate-400 text-sm pb-3 border-b border-slate-100 mb-2">
                      <div className="col-span-12 md:col-span-6">Sản phẩm</div>
                      <div className="col-span-2 text-center hidden md:block">Đơn giá</div>
                      <div className="col-span-2 text-center hidden md:block">Số lượng</div>
                      <div className="col-span-2 text-right hidden md:block">Thành tiền</div>
                    </div>
                    {checkoutItems.map((item, i) => {
                      const itemPrice = parseInt((item.product.price || "0").replace(/\D/g, ''));
                      return (
                        <div key={i} className="grid grid-cols-12 items-center text-sm py-4 border-b border-slate-50 last:border-0 gap-y-2">
                          <div className="col-span-12 md:col-span-6 flex gap-4">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={item.product.image || item.product.img} className="w-14 h-14 object-cover border border-slate-200 rounded-sm" alt=""/>
                            <div className="flex flex-col justify-center">
                              <div className="text-slate-800 line-clamp-2">{item.product.prod_name || item.product.name}</div>
                              <div className="text-slate-500 text-xs mt-1 border border-slate-200 px-2 py-0.5 w-fit rounded-sm bg-slate-50">Phân loại: {item.color}, {item.size}</div>
                            </div>
                          </div>
                          <div className="col-span-4 md:col-span-2 text-center text-slate-600 hidden md:block">₫{itemPrice.toLocaleString()}</div>
                          <div className="col-span-4 md:col-span-2 text-center text-slate-600 hidden md:block">{item.qty}</div>
                          <div className="col-span-12 md:col-span-2 text-right text-[#ee4d2d] font-medium text-base">₫{(itemPrice * item.qty).toLocaleString()}</div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Voucher / Promo Code */}
                  <div className="bg-white p-6 rounded-sm shadow-sm flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                      <div className="font-medium text-slate-800 flex items-center gap-2"><Tag className="w-5 h-5 text-[#ee4d2d]" /> Shopee Voucher</div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 flex items-center border border-slate-300 rounded-sm overflow-hidden focus-within:border-slate-400 transition-colors">
                        <input type="text" placeholder="Nhập mã Shopee Voucher" 
                          value={promoCode} onChange={(e) => setPromoCode(e.target.value)} 
                          className="flex-1 px-4 py-2.5 outline-none text-sm" />
                        <button 
                          onClick={() => setAppliedPromo(promoCode)} 
                          className={`px-6 py-2.5 text-sm font-medium transition-colors ${promoCode ? 'bg-slate-200 text-slate-700 hover:bg-slate-300' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}>
                          Áp dụng
                        </button>
                      </div>
                      <button className="text-blue-600 hover:underline text-sm font-medium whitespace-nowrap">Chọn Voucher</button>
                    </div>
                    
                    {/* Suggested Vouchers */}
                    <div className="flex gap-3 mt-1 overflow-x-auto pb-2 scrollbar-hide">
                      {voucherClaimed && (
                        <div onClick={() => { setPromoCode("FREESHIP100K"); setAppliedPromo("FREESHIP100K"); }} className="cursor-pointer flex-shrink-0 bg-orange-50 border border-orange-200 rounded-sm px-3 py-2 flex items-center gap-3 w-[220px] group hover:border-[#ee4d2d] transition-colors relative overflow-hidden">
                           <div className="absolute top-0 right-0 bg-[#ee4d2d] text-white text-[8px] font-bold px-1 py-0.5 rounded-bl-sm z-10"><Zap className="w-2 h-2 inline"/> AI Đề Xuất</div>
                           <div className="text-[#ee4d2d] bg-white p-1.5 rounded-full shadow-sm"><Truck className="w-5 h-5"/></div>
                           <div className="flex flex-col">
                             <span className="text-[12px] font-bold text-slate-800 leading-tight group-hover:text-[#ee4d2d]">FREESHIP100K</span>
                             <span className="text-[10px] text-slate-500">Giảm phí vận chuyển</span>
                           </div>
                        </div>
                      )}
                      <div onClick={() => { setPromoCode("GIAM10K"); setAppliedPromo("GIAM10K"); }} className="cursor-pointer flex-shrink-0 bg-blue-50 border border-blue-200 rounded-sm px-3 py-2 flex items-center gap-3 w-[200px] group hover:border-blue-500 transition-colors">
                         <div className="text-blue-500 bg-white p-1.5 rounded-full shadow-sm"><Tag className="w-5 h-5"/></div>
                         <div className="flex flex-col">
                           <span className="text-[12px] font-bold text-slate-800 leading-tight group-hover:text-blue-500">GIAM10K</span>
                           <span className="text-[10px] text-slate-500">Giảm 10.000₫ đơn từ 0₫</span>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods & Total */}
                  <div className="bg-white p-6 rounded-sm shadow-sm flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                      <div className="font-medium text-slate-800">Phương thức thanh toán</div>
                      <div className="flex gap-3">
                        <button className="border border-[#ee4d2d] text-[#ee4d2d] px-4 py-2 rounded-sm text-sm font-medium relative shadow-sm">
                          Thanh toán khi nhận hàng
                          <div className="absolute right-0 bottom-0 w-4 h-4 bg-[#ee4d2d] rounded-tl-lg flex items-center justify-center">
                            <CheckCircle className="w-2.5 h-2.5 text-white absolute bottom-0.5 right-0.5" />
                          </div>
                        </button>
                        <button className="border border-slate-200 text-slate-600 px-4 py-2 rounded-sm text-sm hover:border-slate-300 transition-colors">Ví ShopeePay</button>
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-2 bg-[#fafdff] -mx-6 -mb-6 p-6 border-t border-slate-100 border-dashed">
                      <div className="w-full md:w-96 flex flex-col gap-3 text-sm">
                        {(() => {
                          const subtotal = cartItems.reduce((acc, item) => acc + parseInt((item.product.price || "0").replace(/\D/g, '')) * item.qty, 0);
                          const shippingFee = 30000;
                          let discount = 0;
                          let discountLabel = "";
                          if (appliedPromo === "FREESHIP100K") { discount = 30000; discountLabel = "Miễn phí vận chuyển"; }
                          else if (appliedPromo === "GIAM10K") { discount = 10000; discountLabel = "Voucher giảm giá"; }
                          else if (appliedPromo) { discount = 0; discountLabel = "Mã không hợp lệ"; }
                          
                          const total = subtotal + shippingFee - discount;
                          return (
                            <>
                              <div className="flex justify-between text-slate-600"><span>Tổng tiền hàng</span><span>₫{subtotal.toLocaleString()}</span></div>
                              <div className="flex justify-between text-slate-600"><span>Phí vận chuyển</span><span>₫{shippingFee.toLocaleString()}</span></div>
                              {appliedPromo && (
                                <div className="flex justify-between text-slate-600 items-center">
                                  <span className="flex items-center gap-1.5"><Tag className="w-4 h-4 text-[#ee4d2d]"/> {discountLabel}</span>
                                  <span className="text-[#ee4d2d]">{discount > 0 ? "-" : ""}₫{discount.toLocaleString()}</span>
                                </div>
                              )}
                              <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-200">
                                <span className="text-slate-600 pb-1">Tổng thanh toán:</span>
                                <span className="text-3xl text-[#ee4d2d] font-medium">₫{Math.max(0, total).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between gap-4 mt-6">
                                <span className="text-xs text-slate-500 w-1/2">Nhấn "Đặt hàng" đồng nghĩa với việc bạn đồng ý tuân theo Điều khoản Shopee.</span>
                                <button onClick={() => {
                                  const newOrder = {
                                    id: "ORD-" + Math.floor(Math.random() * 1000000),
                                    date: new Date().toISOString(),
                                    status: "Chờ xác nhận",
                                    items: checkoutItems,
                                    total: Math.max(0, total),
                                    address: shippingInfo
                                  };
                                  setOrders([newOrder, ...orders]);
                                  // Remove purchased items from cart
                                  setCartItems(prev => prev.filter(item => !checkoutItems.includes(item)));
                                  setCartCount(prev => prev - checkoutItems.reduce((acc, item) => acc + item.qty, 0));
                                  setCheckoutSuccess(true);
                                }} className="flex-1 bg-[#ee4d2d] text-white py-3.5 rounded-sm text-lg font-medium shadow-md hover:bg-[#d44226] transition-colors">
                                  Đặt Hàng
                                </button>
                              </div>
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CART MODAL ── */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[85] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#f5f5f5] w-full max-w-5xl rounded-sm shadow-2xl my-8 overflow-hidden relative flex flex-col max-h-[90vh]">
              <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                <div className="text-[#ee4d2d] text-xl font-medium flex items-center gap-2"><ShoppingCart className="w-6 h-6"/> Giỏ Hàng</div>
                <button onClick={() => setShowCart(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors"><X className="w-5 h-5"/></button>
              </div>

              {cartItems.length === 0 ? (
                <div className="bg-white p-20 text-center flex flex-col items-center justify-center min-h-[50vh]">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-200">
                    <ShoppingCart className="w-12 h-12" />
                  </div>
                  <h2 className="text-xl font-medium text-slate-800 mb-2">Giỏ hàng của bạn còn trống</h2>
                  <button onClick={() => setShowCart(false)} className="mt-4 bg-[#ee4d2d] text-white px-8 py-2 rounded-sm hover:bg-[#d44226] transition-colors uppercase font-medium text-sm">Mua Sắm Ngay</button>
                </div>
              ) : (
                <div className="flex flex-col h-full overflow-hidden">
                  <div className="p-4 overflow-y-auto flex-1">
                    <div className="bg-white rounded-sm shadow-sm">
                      <div className="grid grid-cols-12 text-slate-500 text-sm p-4 border-b border-slate-100 bg-slate-50/50">
                        <div className="col-span-6 flex items-center gap-4">
                          <input type="checkbox" checked={selectedCartIndices.size === cartItems.length} onChange={selectAllCartItems} className="w-4 h-4 accent-[#ee4d2d]" />
                          <span>Sản Phẩm</span>
                        </div>
                        <div className="col-span-2 text-center">Đơn Giá</div>
                        <div className="col-span-2 text-center">Số Lượng</div>
                        <div className="col-span-1 text-center">Số Tiền</div>
                        <div className="col-span-1 text-center">Thao Tác</div>
                      </div>
                      
                      {cartItems.map((item, i) => {
                        const price = parseInt((item.product.price || "0").replace(/\D/g, ''));
                        return (
                          <div key={i} className="grid grid-cols-12 items-center p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/30 transition-colors">
                            <div className="col-span-6 flex items-center gap-4">
                              <input type="checkbox" checked={selectedCartIndices.has(i)} onChange={() => toggleSelectCartItem(i)} className="w-4 h-4 accent-[#ee4d2d]" />
                              <img src={item.product.image || item.product.img} className="w-20 h-20 object-cover border border-slate-100 rounded-sm" alt=""/>
                              <div>
                                <div className="text-slate-800 text-sm line-clamp-2">{item.product.prod_name || item.product.name}</div>
                                <div className="text-slate-400 text-xs mt-1">Phân loại: {item.color}, {item.size}</div>
                              </div>
                            </div>
                            <div className="col-span-2 text-center text-sm text-slate-800">₫{price.toLocaleString()}</div>
                            <div className="col-span-2 flex justify-center">
                              <div className="flex items-center border border-slate-200 rounded-sm">
                                <button onClick={() => updateCartQty(i, -1)} className="px-2.5 py-1 border-r border-slate-200 hover:bg-slate-50">-</button>
                                <span className="w-10 text-center text-sm">{item.qty}</span>
                                <button onClick={() => updateCartQty(i, 1)} className="px-2.5 py-1 border-l border-slate-200 hover:bg-slate-50">+</button>
                              </div>
                            </div>
                            <div className="col-span-1 text-center text-sm text-[#ee4d2d] font-medium">₫{(price * item.qty).toLocaleString()}</div>
                            <div className="col-span-1 text-center">
                              <button onClick={() => removeCartItem(i)} className="text-slate-400 hover:text-[#ee4d2d] transition-colors"><X className="w-5 h-5"/></button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 border-t border-slate-100 flex items-center justify-between sticky bottom-0 z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.03)]">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 cursor-pointer" onClick={selectAllCartItems}>
                        <input type="checkbox" checked={selectedCartIndices.size === cartItems.length && cartItems.length > 0} readOnly className="w-4 h-4 accent-[#ee4d2d]" />
                        <span className="text-sm text-slate-700">Chọn Tất Cả ({cartItems.length})</span>
                      </div>
                      <button onClick={() => {
                        setCartItems(prev => prev.filter((_, i) => !selectedCartIndices.has(i)));
                        setCartCount(prev => prev - cartItems.filter((_, i) => selectedCartIndices.has(i)).reduce((acc, item) => acc + item.qty, 0));
                        setSelectedCartIndices(new Set());
                      }} className="text-sm text-slate-700 hover:text-[#ee4d2d] transition-colors">Xóa Mục Đã Chọn</button>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-slate-800">Tổng thanh toán ({selectedCartIndices.size} sản phẩm):</div>
                        <div className="text-2xl text-[#ee4d2d] font-medium">₫{
                          cartItems
                            .filter((_, i) => selectedCartIndices.has(i))
                            .reduce((acc, item) => acc + parseInt((item.product.price || "0").replace(/\D/g, '')) * item.qty, 0)
                            .toLocaleString()
                        }</div>
                      </div>
                      <button onClick={handleCartCheckout} disabled={selectedCartIndices.size === 0} className={`px-12 py-3 rounded-sm font-medium text-white transition-all shadow-md ${selectedCartIndices.size > 0 ? 'bg-[#ee4d2d] hover:bg-[#d44226] shadow-[#ee4d2d]/20' : 'bg-slate-300 cursor-not-allowed'}`}>
                        Mua Hàng
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ORDER HISTORY MODAL ── */}
      <AnimatePresence>
        {showOrderHistory && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-[#f5f5f5] w-full max-w-4xl rounded-sm shadow-2xl my-8 overflow-hidden relative flex flex-col max-h-[90vh]">
              <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                <div className="text-xl font-medium flex items-center gap-2 text-slate-800">Lịch sử Đơn Hàng</div>
                <button onClick={() => setShowOrderHistory(false)} className="text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-1 transition-colors"><X className="w-5 h-5"/></button>
              </div>

              <div className="p-4 flex flex-col gap-4 overflow-y-auto">
                {orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">Chưa có đơn hàng nào.</div>
                ) : (
                  orders.map(order => (
                    <div key={order.id} className="bg-white rounded-sm shadow-sm overflow-hidden flex flex-col">
                      <div className="border-b border-slate-100 p-4 flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <span className="font-medium text-slate-800">{order.id}</span>
                          <span className="text-slate-500">{new Date(order.date).toLocaleDateString("vi-VN")}</span>
                        </div>
                        <div className="text-[#ee4d2d] uppercase font-medium">{order.status}</div>
                      </div>
                      
                      {/* Tracking Timeline */}
                      <div className="py-6 px-12 border-b border-slate-50 hidden md:block">
                        <div className="relative flex justify-between items-center w-full">
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0"></div>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#26aa99] z-0 transition-all duration-1000" style={{ width: order.status === "Chờ xác nhận" ? "0%" : order.status === "Đã đóng gói" ? "33%" : order.status === "Đang giao" ? "66%" : "100%" }}></div>
                          
                          {["Chờ xác nhận", "Đã đóng gói", "Đang giao", "Đã giao"].map((s, idx) => {
                            const statuses = ["Chờ xác nhận", "Đã đóng gói", "Đang giao", "Đã giao"];
                            const currentIdx = statuses.indexOf(order.status);
                            const isActive = idx <= currentIdx;
                            return (
                              <div key={s} className="relative z-10 flex flex-col items-center gap-2 bg-white px-2">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isActive ? 'bg-[#26aa99] border-[#26aa99] text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                                  <CheckCircle className="w-5 h-5"/>
                                </div>
                                <span className={`text-[11px] ${isActive ? 'text-[#26aa99] font-medium' : 'text-slate-400'}`}>{s}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>

                      <div className="p-4 flex flex-col gap-3 border-b border-slate-100">
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex gap-4">
                            <img src={item.product.image || item.product.img} className="w-20 h-20 object-cover border border-slate-200" alt="" />
                            <div className="flex-1">
                              <div className="text-slate-800 font-medium">{item.product.prod_name || item.product.name}</div>
                              <div className="text-slate-500 text-sm mt-1">Phân loại: {item.color}, {item.size} <span className="font-bold">x{item.qty}</span></div>
                            </div>
                            <div className="text-[#ee4d2d] font-medium">₫{(parseInt((item.product.price || "0").replace(/\D/g, '')) * item.qty).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-[#fffefb] p-4 flex flex-col md:items-end gap-3 relative overflow-hidden">
                        {order.aiFlag && (
                          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="md:absolute left-4 top-4 bg-orange-50 border border-orange-200 p-3 rounded-md flex items-start gap-3 w-full md:w-[450px] mb-4 md:mb-0">
                            <div className="bg-[#ee4d2d] p-1.5 rounded-full text-white shrink-0"><Zap className="w-5 h-5"/></div>
                            <div>
                              <div className="text-[#ee4d2d] text-sm font-bold flex items-center gap-2">AI RE-ENGAGEMENT TRIGGER <span className="bg-red-100 text-red-600 text-[9px] px-1 rounded-sm">Chu kỳ 4 tháng</span></div>
                              <p className="text-xs text-slate-600 mt-1">Đã đến chu kỳ mua lại sản phẩm này. Hệ thống tự động tặng bạn Voucher Kích Hoạt.</p>
                            </div>
                          </motion.div>
                        )}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-600">Thành tiền:</span>
                          <span className="text-2xl text-[#ee4d2d] font-medium">₫{order.total.toLocaleString()}</span>
                        </div>
                        <div className="flex gap-3">
                          {order.aiFlag ? (
                            <button onClick={() => {
                              addToCart("Sản phẩm mua lại", order.items[0].product);
                              setPromoCode("MUALAI20");
                              setAppliedPromo("MUALAI20");
                              setShowOrderHistory(false);
                            }} className="bg-[#ee4d2d] text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-[#d44226] shadow-md shadow-[#ee4d2d]/30 flex items-center gap-2 animate-pulse">
                              <Zap className="w-4 h-4"/> Mua Lại (-20%)
                            </button>
                          ) : (
                            <button className="bg-[#ee4d2d] text-white px-6 py-2 rounded-sm text-sm font-medium hover:bg-[#d44226]">Mua Lại</button>
                          )}
                          <button className="border border-slate-300 text-slate-600 px-6 py-2 rounded-sm text-sm font-medium hover:bg-slate-50">Liên Hệ Người Bán</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ShoppingBagIcon() {
  return (
    <svg viewBox="0 0 32 32" className="w-10 h-10 fill-white"><path d="M16 2.5a5.5 5.5 0 00-5.5 5.5h-2.5A2.5 2.5 0 005.5 10.5v15A2.5 2.5 0 008 28h16a2.5 2.5 0 002.5-2.5v-15a2.5 2.5 0 00-2.5-2.5h-2.5A5.5 5.5 0 0016 2.5zm0 2.5a3 3 0 013 3h-6a3 3 0 013-3zm-5.5 5.5h11v2a1.5 1.5 0 01-3 0v-2h-5v2a1.5 1.5 0 01-3 0v-2z"></path></svg>
  );
}
