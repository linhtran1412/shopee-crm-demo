# 🚀 Hướng Dẫn Chạy Web Shopee CRM - Cho Thành Viên Nhóm

## ✅ Cách 1: Nhanh Nhất (Dùng Node.js) — KHUYẾN NGHỊ

### Bước 1: Tải Node.js về máy
👉 https://nodejs.org/en → Bấm **"LTS"** → Tải về → Cài đặt (Next → Next → Finish)

### Bước 2: Copy thư mục project
Bạn gửi cho mình cái thư mục **`shopee-crm-demo`** (zip lại cho nhẹ)

📍 Thư mục nằm ở:
```
C:\Users\ADmin\.gemini\antigravity\scratch\shopee-crm-demo
```

**LƯU Ý QUAN TRỌNG:** Phải có đủ 7 file JSON trong `shopee-crm-demo/public/data/`:
```
rfm_distribution.json
top_products.json
model_metrics.json
voucher_priority.json
segment_performance.json
streaming_popularity.json
purchase_cycle.json
```

### Bước 3: Chạy web

Mở **Terminal / PowerShell / Command Prompt**, gõ:
```bash
# Di chuyển vào thư mục project
cd đường_dẫn_tới\shopee-crm-demo

# Cài thư viện (chỉ cần làm 1 lần)
npm install

# Chạy web
npm run dev
```

### Bước 4: Mở trình duyệt
👉 **http://localhost:3000**

---

## ✅ Cách 2: Dùng Docker (Không cần Node.js)

### Yêu cầu: Cài Docker Desktop
👉 https://www.docker.com/products/docker-desktop/

```bash
# Build image
docker build -t shopee-crm .

# Chạy container
docker run -p 3000:3000 shopee-crm
```

Mở trình duyệt: 👉 **http://localhost:3000**

---

## ❓ Câu Hỏi Thường Gặp

**Q: Báo lỗi `npm: command not found`?**
→ Chưa cài Node.js. Cài lại theo Bước 1.

**Q: Báo lỗi `port 3000 already in use`?**
→ Gõ: `npm run dev -- -p 3001` rồi vào `http://localhost:3001`

**Q: Web hiện nhưng không có số liệu?**
→ Kiểm tra 7 file JSON có trong thư mục `public/data/` chưa

**Q: Cần chạy lại Databricks không?**
→ **KHÔNG CẦN!** 7 file JSON đã export sẵn rồi. Web đọc thẳng từ file đó.

---

## 📁 Cấu Trúc File Quan Trọng

```
shopee-crm-demo/
├── public/
│   └── data/          ← 7 file JSON dữ liệu thật từ Databricks
├── src/
│   └── app/           ← Code Next.js
├── tests/
│   └── test_pipeline.py  ← Unit tests (pytest)
├── .github/workflows/ ← CI/CD GitHub Actions
├── Dockerfile         ← Docker config
└── package.json
```
