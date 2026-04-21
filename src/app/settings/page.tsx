"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Settings, Database, Cpu, CheckCircle, Info } from "lucide-react";

interface ModelMetric {
  metric_name: string;
  value: number;
  unit: string;
  category: string;
}

export default function SettingsPage() {
  const [metrics, setMetrics] = useState<ModelMetric[]>([]);

  useEffect(() => {
    fetch("/data/model_metrics.json").then((r) => r.json()).then((d) => setMetrics(d.data || []));
  }, []);

  const systemInfo = [
    { label: "Platform", value: "Databricks Community Edition", icon: Database },
    { label: "Engine", value: "Apache Spark (PySpark)", icon: Cpu },
    { label: "Storage", value: "Delta Lake + Unity Catalog", icon: Database },
    { label: "Algorithm", value: "Item-Based Collaborative Filtering", icon: Cpu },
    { label: "Dataset", value: "H&M Fashion (31.7M transactions)", icon: Database },
    { label: "Streaming", value: "Spark Structured Streaming (AvailableNow)", icon: Cpu },
    { label: "CI/CD", value: "GitHub Actions + Docker", icon: CheckCircle },
    { label: "Frontend", value: "Next.js 16 + Tailwind CSS", icon: Info },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Thông Tin Hệ Thống</h1>
        <p className="text-slate-500 mt-1">Big Data Pipeline • Đồ án cuối kỳ Nhóm 18</p>
      </div>

      {/* System Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#ee4d2d]/10 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-[#ee4d2d]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Công Nghệ Sử Dụng</h2>
            <p className="text-xs text-slate-400">Big Data Technology Stack</p>
          </div>
        </div>
        <div className="divide-y divide-slate-100">
          {systemInfo.map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
              <item.icon className="w-5 h-5 text-slate-400 flex-shrink-0" />
              <span className="text-sm font-medium text-slate-500 w-32 flex-shrink-0">{item.label}</span>
              <span className="text-sm font-semibold text-slate-800">{item.value}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Model Performance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">Model Performance - Kết Quả Thật</h2>
          <p className="text-xs text-slate-400 mt-1">Temporal Split • Train &lt; 2020-08-01 • Test ≥ 2020-08-01</p>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {metrics.map((m, i) => (
            <motion.div key={m.metric_name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 + i * 0.05 }}
              className={`p-4 rounded-xl border-2 ${m.category === "Accuracy" ? "border-blue-100 bg-blue-50" : m.category === "Coverage" ? "border-green-100 bg-green-50" : m.category === "Overall" ? "border-[#ee4d2d]/20 bg-[#ee4d2d]/5" : "border-slate-100 bg-slate-50"}`}>
              <p className="text-xs font-medium text-slate-500 mb-1">{m.category}</p>
              <p className="text-sm font-bold text-slate-800 mb-2">{m.metric_name}</p>
              <p className={`text-2xl font-black ${m.category === "Overall" ? "text-[#ee4d2d]" : "text-slate-900"}`}>
                {m.value}{m.unit}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
