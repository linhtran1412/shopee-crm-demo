"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, TrendingUp, Zap, BarChart2 } from "lucide-react";

interface TopProduct { article_id: number; product_type_name: string; product_group_name: string; recommendation_count: number; }
interface StreamProduct { article_id: number; purchase_count: number; unique_buyers: number; popularity_score: number; }
interface PurchaseCycle { cycle_range: string; user_count: number; }

export default function ProductsPage() {
  const [top, setTop] = useState<TopProduct[]>([]);
  const [stream, setStream] = useState<StreamProduct[]>([]);
  const [cycle, setCycle] = useState<PurchaseCycle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/top_products.json").then(r => r.json()),
      fetch("/data/streaming_popularity.json").then(r => r.json()),
      fetch("/data/purchase_cycle.json").then(r => r.json()),
    ]).then(([t, s, c]) => {
      setTop(t.data || []);
      setStream((s.data || []).slice(0, 15));
      setCycle(c.data || []);
      setLoading(false);
    });
  }, []);

  const maxRec = Math.max(...top.map(p => p.recommendation_count), 1);
  const maxPop = Math.max(...stream.map(p => p.popularity_score), 1);
  const maxCycle = Math.max(...cycle.map(c => c.user_count), 1);
  const CYCLE_COLORS = ["#ee4d2d","#ff7337","#facc15","#4ade80","#94a3b8"];

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-[#ee4d2d] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium">Đang tải dữ liệu sản phẩm...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Phân Tích Sản Phẩm</h1>
          <p className="text-slate-500 mt-1 text-sm">Item-Based CF + Spark Streaming • Dữ liệu thật từ Databricks</p>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />Real-time Streaming
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Sản phẩm CF", value: top.length, icon: ShoppingBag, color: "text-[#ee4d2d]", bg: "bg-[#ee4d2d]/10" },
          { label: "Lượt gợi ý cao nhất", value: maxRec, icon: TrendingUp, color: "text-orange-500", bg: "bg-orange-50" },
          { label: "Sản phẩm Streaming", value: stream.length, icon: Zap, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Max Popularity Score", value: maxPop.toFixed(0), icon: BarChart2, color: "text-blue-500", bg: "bg-blue-50" },
        ].map(c => (
          <motion.div key={c.label} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.bg}`}>
              <c.icon className={`w-6 h-6 ${c.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{c.label}</p>
              <p className="text-xl font-bold text-slate-900">{c.value.toLocaleString()}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Recommended */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-1">🏆 Top Sản Phẩm Được Gợi Ý</h2>
          <p className="text-xs text-slate-400 mb-5">Item-Based Collaborative Filtering</p>
          <div className="space-y-3">
            {top.map((p, i) => (
              <div key={p.article_id} className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === 0 ? "bg-[#ee4d2d] text-white" : i === 1 ? "bg-slate-400 text-white" : i === 2 ? "bg-yellow-400 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">#{p.article_id}</p>
                  <p className="text-xs text-slate-400 capitalize truncate">{p.product_type_name} • {p.product_group_name}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#ee4d2d] rounded-full" style={{ width: `${(p.recommendation_count / maxRec) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-[#ee4d2d] w-10 text-right">{p.recommendation_count}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Streaming Popularity */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-800">⚡ Real-time Popularity</h2>
              <p className="text-xs text-slate-400 mt-0.5">Spark Streaming • AvailableNow trigger</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />LIVE
            </span>
          </div>
          <div className="space-y-2.5 max-h-80 overflow-y-auto">
            {stream.map((p, i) => (
              <div key={p.article_id} className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-5 text-right flex-shrink-0">#{i+1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-slate-800">Article #{p.article_id}</p>
                  <p className="text-xs text-slate-400">{p.purchase_count?.toLocaleString()} mua • {p.unique_buyers?.toLocaleString()} người</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full" style={{ width: `${(p.popularity_score / maxPop) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-orange-500 w-12 text-right">{p.popularity_score?.toFixed(0)}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Purchase Cycle */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-1">📅 Phân Bố Chu Kỳ Mua Hàng</h2>
        <p className="text-xs text-slate-400 mb-6">Purchase Cycle Analysis • Cơ sở dự đoán Voucher Timing</p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...cycle].sort((a, b) => b.user_count - a.user_count).map((c, i) => (
            <div key={c.cycle_range} className="text-center p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
              <div className="w-8 h-8 rounded-lg mx-auto mb-3" style={{ backgroundColor: CYCLE_COLORS[i] + "30" }}>
                <div className="w-full h-full rounded-lg flex items-center justify-center">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: CYCLE_COLORS[i] }} />
                </div>
              </div>
              <p className="text-xs font-medium text-slate-500 mb-1">{c.cycle_range}</p>
              <p className="text-lg font-bold text-slate-900">{c.user_count.toLocaleString()}</p>
              <p className="text-xs text-slate-400">người</p>
              <div className="mt-2 h-1 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${(c.user_count / maxCycle) * 100}%`, backgroundColor: CYCLE_COLORS[i] }} />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
