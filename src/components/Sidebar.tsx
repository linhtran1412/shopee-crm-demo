"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Users, ShoppingBag, Settings } from "lucide-react";
import { clsx } from "clsx";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Shopee Demo", href: "/demo", icon: Store },
    { name: "Khách hàng", href: "/customers", icon: Users },
    { name: "Sản phẩm", href: "/products", icon: ShoppingBag },
    { name: "Cài đặt", href: "/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col">
      <div className="p-6 border-b border-slate-200 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#ee4d2d] flex items-center justify-center">
          <Store className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 tracking-tight">Shopee CRM</h1>
      </div>
      
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-2">
          Menu
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-[#ee4d2d]/10 text-[#ee4d2d] font-medium" 
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={clsx("w-5 h-5", isActive ? "text-[#ee4d2d]" : "text-slate-400 group-hover:text-slate-600")} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-slate-50">
          <div className="w-8 h-8 rounded-full bg-[#ee4d2d]/20 flex items-center justify-center text-[#ee4d2d] font-bold">
            AD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-slate-900 truncate">Admin</p>
            <p className="text-xs text-slate-500 truncate">admin@shopee.vn</p>
          </div>
        </div>
      </div>
    </div>
  );
}
