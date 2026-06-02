# 🎧 耳機電商專案規範 (TuneUp Earphone E-shop)

## 0. 專案架構 (Project Structure)

project-new/
├── src/
│   ├── assets/
│   │   └── image/           # 修正：所有圖片存放在此目錄
│   ├── components/          # 共用組件 (Navbar, Footer, ProductCard 等)
│   ├── data/
│   │   └── api.ts           # API 請求邏輯與 Zod Schema
│   ├── router/              # Vue Router 配置
│   ├── view/                # 修正：頁面組件 (HomeView, CartView 等)
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── db.json                  # JSON Server 資料庫
├── package.json
└── vite.config.ts

## 1. 頁面通用架構 (Global Layout)

- **所有頁面** 必須包含 `Navbar` (導覽列) 與 `AppFooter` (頁尾)。
- 狀態管理：登入按鈕預設狀態為「尚未登入」。

## 2. 導覽列與資料結構 (Navbar & Data)

- **Logo**: 連結至首頁。
- **功能選單**: 採「資料驅動」模式，包含以下分類：
  - 首頁 (Home)、入耳式 (In-ear)、耳塞式 (Earbuds)、耳罩式 (Over-ear)、其他耳機 (Others)
- **功能組件**: 搜尋 Bar (具備過濾功能)、登入/購物車入口。

## 3. 頁面區塊規範 (Page Sections)

- **HomeView (`src/view/HomeView.vue`)**:
  - 區塊 A：優惠折扣 (Discounts) - `ProductCard`
  - 區塊 B：售出最多 (Best Sellers) - `ProductCardTopSales`
  - 區塊 C：新品上市 (New Arrivals) - `ProductCardNew`
- **ProductDetailView**:
  - 需實作「折價與否」的價格顯示邏輯。

## 4. 開發技術要求 (Technical Requirements)

- **前端框架**: Vue 3 (Composition API / `<script setup>`)
- **開發語言**: TypeScript (TS)
- **樣式系統**: Tailwind CSS v4 + Sass (SCSS)
- **UI 組件庫**: PrimeVue (Aura 主題)
- **資料處理**: Axios (請求) + Zod (型別驗證與 Schema)
- **開發環境**: Vite (`npm run dev:all` 同時啟動前端與 API)

## 5. 目前待辦事項 (Pending Tasks)

- [ ] **RWD 響應式優化**
  - [ ] 分頁與購物車頁面 RWD 實作
- [ ] **功能開發**
  - [ ] 登入頁面製作 (Login View)
  - [ ] 加入購物車互動回饋 (Reaction/Feedback)
- [ ] **內容與邏輯**
  - [ ] 分頁 Demo 圖片與資訊更換 (資料校對)
  - [ ] 商品詳情頁：折價與原價顯示邏輯判斷

