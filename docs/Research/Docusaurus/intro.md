---
sidebar_position: 1
title: Docusaurus learning note
---

# Docusaurus learning note
*最後更新時間：2025/11/12*<br />

這一區紀錄了我研究 Docusaurus 的歷程，希望能幫助未來的自己快速回顧整個架構脈絡。<br />

尚未克服的難題：
- 更新原本docusaurus架構至最新版本

## 整理資訊

整體結構層級<br />

| 層級 | 名稱 | 功能說明 |
|------|------|-----------|
| 1️ | Core | Docusaurus CLI 與外掛系統，控制建構、啟動、部署流程 |
| 2️ | Themes | 提供 UI 結構與樣式（Navbar、Sidebar、Footer、Blog Layout） |
| 3️ | Plugins | 控制內容來源，如文件、部落格、頁面、自訂插件 |
| 4️ | Content | Markdown/MDX 寫成的內容（/docs、/blog、/src/pages） |
| 5️ | React | 將內容轉為 React Component，支援互動元件 |
| 6️ | Deployment | 輸出靜態檔案到 `/build`，部署至 GitHub Pages、Netlify、Vercel 等 |

## 專案目錄結構（Project Structure）

```plaintext
my-website/
│
├── blog/                      # 部落格文章（Markdown/MDX）
│   ├── 2025-01-01-new-year.md
│   └── ...
│
├── docs/                      # 文件資料夾
│   ├── intro.md
│   ├── tutorial-basics/
│   │   ├── create-a-page.md
│   │   └── ...
│   └── ...
│
├── src/                       # React 元件與靜態頁面
│   ├── components/            # 自訂元件（共用UI）
│   └── pages/                 # 特殊頁面（如 /about, /contact）
│
├── static/                    # 靜態資源（圖像、icon、PDF...）
│   └── img/
│
├── docusaurus.config.js       # 主設定檔（網站設定）
├── sidebars.js                # 文件側邊欄結構
├── package.json               # NPM 依賴與命令
└── tsconfig.json / jsconfig.json  # TypeScript/JS 開發設定 
```

## Docusaurus 三種執行模式

遇到npm run start 看不到改動，只有 npm run build 才看到的情況，通常是因為改動的是設定檔<br />
（例如 docusaurus.config.js、sidebars.js），需重新建置


### 開發模式（Development Mode）

```bash
npm run start
```

執行後會開啟本機伺服器（通常是 ``` http://localhost:3000 ```），並具備 Hot Reload 功能。<br />

- 任何放在 docs/、blog/、src/pages/ 的 Markdown 或 MDX 改動都會即時重新載入
- 適合日常撰寫與調整內容
- 建置速度快，但不包含壓縮與最佳化
- 若修改設定或架構檔（例如 docusaurus.config.js、sidebars.js、自訂主題元件），需要手動重啟

### 正式建置模式（Production Build）

```bash
npm run build
```

用於生成最終上線版本，會將整個網站編譯成靜態 HTML、CSS、JS，輸出到 build/ 資料夾，這就是部署到 GitHub Pages 或伺服器的最終檔案。<br />

- 每一頁都轉換成靜態檔案
- 不支援 Hot Reload
- 若要查看結果，需搭配下一步的 serve 指令

### 正式版預覽模式（Production Preview）

```bash
npm run build
```

啟動一個本地伺服器，直接展示 npm run build 產生的 /build 靜態檔案，就是上線前檢查用的模式<br />

- 預設網址為 ``` http://localhost:3000  ``` 或 ``` http://localhost:5000 ```
- 顯示結果與上線後完全相同
- 改檔案後需重新執行 npm run build 才會更新
- 適合上線前確認排版、連結與靜態資源是否正確

### Trouble shooting

1. 遇到 sidebar 每個文章的位置排列方式問題，原本想要從 sidebars.js 裡面去調整成客製化的排列方式，後來發現用資料夾分類時，資料夾裡面的順序似乎可以從1開始排列，就不用分資料夾內外的順序了
2. 要加新的資料夾到首頁顯示時，寫到 docusaurus.config.js