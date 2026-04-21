"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface SegPerf { customer_segment: string; total_users: number; users_with_recs: number; users_with_voucher: number; avg_rfm_score: number; rec_coverage_pct: number; voucher_coverage_pct: number; }
interface RFM { customer_segment: string; customer_count: number; percentage: number; avg_rfm_score: number; }

const SEG_COLORS: Record<string, { bg: string; dot: string; badge: string }> = {
  "Champions":           { bg: "bg-red-500",    dot: "#ee4d2d", badge: "bg-red-100 text-red-700 border-red-200" },
  "Loyal Customers":     { bg: "bg-orange-500", dot: "#ff7337", badge: "bg-orange-100 text-orange-700 border-orange-200" },
  "Potential Loyalists": { bg: "bg-yellow-400", dot: "#facc15", badge: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  "At Risk":             { bg: "bg-rose-400",   dot: "#f87171", badge: "bg-rose-100 text-rose-700 border-rose-200" },
  "New Customers":       { bg: "bg-green-500",  dot: "#4ade80", badge: "bg-green-100 text-green-700 border-green-200" },
  "Lost Customers":      { bg: "bg-slate-400",  dot: "#94a3b8", badge: "bg-slate-100 text-slate-600 border-slate-200" },
};

const ACTIONS: Record<string, string> = {
  "Champions": "Tặng quà VIP 🎁", "Loyal Customers": "Cross-sell 💡",
  "At Risk": "Gửi Voucher 🚨", "New Customers": "Onboarding 🌱",
  "Potential Loyalists": "Khuyến mãi 🎯", "Lost Customers": "Win-back 💌",
};

export default function CustomersPage() {
  const [perf, setPerf] = useState<SegPerf[]>([]);
  const [rfm, setRfm] = useState<RFM[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/segment_performance.json").then(r => r.json()),
      fetch("/data/rfm_distribution.json").then(r => r.json()),
    ]).then(([p, r]) => { setPerf(p.data || []); setRfm(r.data || []); setLoading(false); });
  }, []);

  const totalUsers = rfm.reduce((a, b) => a + b.customer_count, 0);

  if (loading) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 border-4 border-[#ee4d2d] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-slate-500 font-medium">Đang tải dữ liệu khách hàng...</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Quản Lý Khách Hàng</h1>
          <p className="text-slate-500 mt-1 text-sm">Phân tích RFM • {totalUsers.toLocaleString()} khách hàng thật từ Databricks</p>
        </div>
        <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-sm font-medium px-3 py-1 rounded-full border border-green-200">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />Dữ liệu thật
        </span>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {rfm.map((s, i) => {
          const col = SEG_COLORS[s.customer_segment];
          const perfData = perf.find(p => p.customer_segment === s.customer_segment);
          return (
            <motion.div key={s.customer_segment} whileHover={{ y: -4 }} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${col?.bg || "bg-slate-400"} flex items-center justify-center`}>
                  <Users className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full border ${col?.badge}`}>{s.percentage}%</span>
              </div>
              <p className="text-xs font-medium text-slate-500">{s.customer_segment}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{s.customer_count.toLocaleString()}</p>
              <div className="flex gap-3 mt-2 text-xs text-slate-400">
                <span>RFM: <span className="font-bold text-slate-700">{s.avg_rfm_score.toFixed(1)}</span></span>
                {perfData && <span>Voucher: <span className="font-bold text-slate-700">{perfData.voucher_coverage_pct.toFixed(0)}%</span></span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Hiệu Suất Từng Phân Khúc</h2>
          <p className="text-xs text-slate-400 mt-0.5">RFM Score, Rec Coverage, Voucher Coverage từ Databricks Pipeline</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left">
                {["Phân Khúc","Số Lượng","RFM Score","Rec Coverage","Voucher Coverage","Hành Động"].map(h => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {perf.map(s => {
                const col = SEG_COLORS[s.customer_segment];
                const rfmSeg = rfm.find(r => r.customer_segment === s.customer_segment);
                const rfmScore = rfmSeg?.avg_rfm_score ?? s.avg_rfm_score;
                return (
                  <tr key={s.customer_segment} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${col?.badge}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: col?.dot }} />
                        {s.customer_segment}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">{s.total_users.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <span className={`font-bold ${rfmScore >= 10 ? "text-green-600" : rfmScore >= 6 ? "text-yellow-600" : "text-red-500"}`}>
                        {rfmScore.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.min(s.rec_coverage_pct * 20, 100)}%` }} />
                        </div>
                        <span className="text-xs text-slate-600 font-medium">{s.rec_coverage_pct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#ee4d2d] rounded-full" style={{ width: `${s.voucher_coverage_pct}%` }} />
                        </div>
                        <span className={`text-xs font-bold ${s.voucher_coverage_pct === 100 ? "text-green-600" : "text-orange-500"}`}>
                          {s.voucher_coverage_pct.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs">{ACTIONS[s.customer_segment] || "—"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
