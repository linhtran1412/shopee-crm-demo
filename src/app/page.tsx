"use client";

import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { Users, AlertCircle, Zap, Award } from "lucide-react";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface RFMSegment { customer_segment: string; customer_count: number; avg_rfm_score: number; percentage: number; }
interface TopProduct { article_id: number; product_type_name: string; product_group_name: string; recommendation_count: number; }
interface ModelMetric { metric_name: string; value: number; unit: string; category: string; }
interface VoucherPriority { final_priority: string; customer_segment: string; customer_count: number; }

const SEG_COLORS: Record<string, string> = {
  "Champions": "#ee4d2d", "Loyal Customers": "#ff7337",
  "Potential Loyalists": "#facc15", "At Risk": "#f87171",
  "Lost Customers": "#94a3b8", "New Customers": "#4ade80",
};

export default function Dashboard() {
  const [segments, setSegments] = useState<RFMSegment[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [metrics, setMetrics] = useState<ModelMetric[]>([]);
  const [vouchers, setVouchers] = useState<VoucherPriority[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/rfm_distribution.json").then(r => r.json()),
      fetch("/data/top_products.json").then(r => r.json()),
      fetch("/data/model_metrics.json").then(r => r.json()),
      fetch("/data/voucher_priority.json").then(r => r.json()),
    ]).then(([rfm, prod, met, vou]) => {
      setSegments(rfm.data || []);
      setTopProducts((prod.data || []).slice(0, 8));
      setMetrics(met.data || []);
      setVouchers(vou.data || []);
      setLoading(false);
    });
  }, []);

  const totalUsers = segments.reduce((a, s) => a + s.customer_count, 0);
  const champions = segments.find(s => s.customer_segment === "Champions");
  const atRisk = segments.find(s => s.customer_segment === "At Risk");
  const critical = vouchers.filter(v => v.final_priority === "CRITICAL").reduce((a, b) => a + b.customer_count, 0);
  const overallScore = metrics.find(m => m.metric_name === "Overall Score");

  const donutData = {
    labels: segments.map(s => `${s.customer_segment} (${s.percentage}%)`),
    datasets: [{ data: segments.map(s => s.customer_count), backgroundColor: segments.map(s => SEG_COLORS[s.customer_segment] || "#64748b"), borderWidth: 0, hoverOffset: 8 }],
  };

  const barData = {
    labels: topProducts.map(p => `#${p.article_id}`),
    datasets: [{ label: "Lượt gợi ý", data: topProducts.map(p => p.recommendation_count), backgroundColor: topProducts.map((_, idx) => idx === 0 ? "#ee4d2d" : idx === 1 ? "#ff7337" : idx === 2 ? "#facc15" : "#94a3b8"), borderRadius: 6 }],
  };

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-[#ee4d2d] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium">Đang tải dữ liệu từ Databricks...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tổng Quan Hệ Thống CRM</h1>
          <p className="text-slate-500 mt-1 text-sm">Dữ liệu thật từ Databricks • H&M Dataset • 31.7M+ giao dịch</p>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          Dữ liệu thật từ Databricks
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {[
          { label: "Tổng Khách Hàng", value: totalUsers.toLocaleString(), icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
          { label: "Champions 🏆", value: champions?.customer_count.toLocaleString() || "0", icon: Award, color: "text-[#ee4d2d]", bg: "bg-[#ee4d2d]/10" },
          { label: "At Risk ⚠️", value: atRisk?.customer_count.toLocaleString() || "0", icon: AlertCircle, color: "text-yellow-600", bg: "bg-yellow-50" },
          { label: "Cần Voucher Gấp ⚡", value: critical.toLocaleString(), icon: Zap, color: "text-purple-500", bg: "bg-purple-50" },
        ].map((c) => (
          <motion.div key={c.label} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.bg}`}>
              <c.icon className={`w-6 h-6 ${c.color}`} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">{c.label}</p>
              <p className="text-xl font-bold text-slate-900">{c.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* RFM Chart + Chiến lược */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Phân Khúc Khách Hàng (RFM)</h2>
          <p className="text-xs text-slate-400 mb-6">Thật • {totalUsers.toLocaleString()} khách hàng • {segments.length} phân khúc</p>
          <div className="h-72 flex items-center justify-center">
            {segments.length > 0 && <Doughnut data={donutData} options={{ cutout: "68%", plugins: { legend: { position: "right", labels: { padding: 14, font: { size: 12 } } } } }} />}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-4">Chiến Lược CRM</h2>
          <div className="space-y-3">
            {[
              { seg: "Champions", action: "Tặng quà tri ân, ra mắt sản phẩm độc quyền", color: "bg-[#ee4d2d]" },
              { seg: "Loyal Customers", action: "Cross-sell & upsell sản phẩm liên quan", color: "bg-orange-400" },
              { seg: "At Risk", action: "Voucher Freeship + Email cá nhân hóa", color: "bg-yellow-400" },
              { seg: "Lost Customers", action: "Chiến dịch win-back với ưu đãi khủng", color: "bg-slate-400" },
            ].map(item => (
              <div key={item.seg} className="flex gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors">
                <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${item.color}`} />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{item.seg}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.action}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Products + Model Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 mb-1">Top Sản Phẩm Được Gợi Ý Nhiều Nhất</h2>
          <p className="text-xs text-slate-400 mb-5">Thật • Item-Based Collaborative Filtering</p>
          <div className="h-64">
            <Bar data={barData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { grid: { color: "#f1f5f9" } }, x: { grid: { display: false }, ticks: { font: { size: 10 } } } } }} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Hiệu Quả Mô Hình AI</h2>
              <p className="text-xs text-slate-400 mt-0.5">Thật • Temporal Split (cutoff: 2020-08-01)</p>
            </div>
            {overallScore && (
              <div className="text-center bg-[#ee4d2d] rounded-2xl px-4 py-2 text-white">
                <div className="text-2xl font-black">{overallScore.value}</div>
                <div className="text-xs opacity-80">/100</div>
              </div>
            )}
          </div>
          <div className="space-y-4">
            {metrics.filter(m => ["Precision@10","Recall@10","Hit Rate@10","User Coverage","Item Coverage","F1-Score"].includes(m.metric_name)).map((m, i) => (
              <div key={m.metric_name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-slate-600">{m.metric_name}</span>
                  <span className="font-bold text-slate-900">{m.value}{m.unit}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(m.value, 100)}%` }} transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }} className="h-full rounded-full bg-gradient-to-r from-[#ee4d2d] to-[#ff7337]" />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Voucher Timing */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold text-slate-800 mb-1">🎫 Chiến Lược Gửi Voucher — Voucher Timing Prediction</h2>
        <p className="text-xs text-slate-400 mb-6">Thật • Purchase Cycle Analysis</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {vouchers.map(v => {
            const isCrit = v.final_priority === "CRITICAL";
            const isHigh = v.final_priority === "HIGH";
            return (
              <div key={`${v.final_priority}-${v.customer_segment}`}
                className={`p-4 rounded-xl border-2 ${isCrit ? "border-red-200 bg-red-50" : isHigh ? "border-orange-200 bg-orange-50" : "border-slate-100 bg-slate-50"}`}>
                <div className={`text-xs font-bold mb-1 ${isCrit ? "text-red-600" : isHigh ? "text-orange-600" : "text-slate-500"}`}>
                  {isCrit ? "🔴 GỬI NGAY" : isHigh ? "🟠 ƯU TIÊN CAO" : "🟡 TRUNG BÌNH"}
                </div>
                <div className="font-semibold text-slate-800 text-sm">{v.customer_segment}</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{v.customer_count.toLocaleString()}</div>
                <div className="text-xs text-slate-500">khách hàng</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
