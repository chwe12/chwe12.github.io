---
sidebar_position: 2
title: Auto Update, Reset tool
---

# Git Local Reset & Update Tool 批次檔介紹
*最後更新時間：2026/10/28*<br />

update_and_deploy.bat 是在 Windows 上執行的自動化工具，將操作整合用選項的方式執行 reset、pull、local build test、commit、push。<br />
使用前需要：<br />
1. 確認電腦已安裝 git和 node.js
2. git 已登入自己的 GitHub 帳號，可以 push 到 origin/main
3. 第一次使用前先執行 `npm ci` 安裝套件，否則選項 3、4 會失敗
4. 不需要手動執行 npm run deploy：push 到 main 分支後，GitHub Actions（.github/workflows/deploy.yml）會自動 build 並部署到 GitHub Pages
<br />
---

## 功能選單說明

執行檔案後會出現以下選單：<br />
1. Reset and clean only (discard local changes)
2. Reset, clean, and pull latest from origin/main
3. devTest
4. Local test (Production Build and Production Preview)
5. Commit and push to formal release
6. Exit

## 1. Reset and clean only

此選項會：
- 強制還原工作目錄到最新一次 commit 的狀態
- 移除所有未追蹤檔案與未提交的變更
- 不會向 Git 雲端拉取最新版本
- 適合在想清除本地實驗修改、回到乾淨環境時使用

## 2. Reset, clean, and pull latest from origin/main

此選項包含選項 1 的所有動作，並多做雲端拉取版本：
- 從 origin/main 拉取最新版本
- 避免誤觸，批次檔額外加入了雙重確認機制：
  - 顯示大型警告文字提示此操作會刪除所有本地變更
  - 使用者必須輸入 y 才會繼續執行 reset + pull
  - 避免不小心按到導致內容遺失
- 適合用於同步不同電腦環境文件

## 3. devTest（Development Server）

此選項會啟動 Docusaurus 的開發模式，功能如下：
- 自動重新載入
- 適合日常撰寫、內容開發與即時查看變更
- 不執行壓縮或最佳化
- 適用於開發過程中需要快速查看修改結果的情況

## 4. Local test（正式版本地預覽）

此選項會執行兩件事：
- npm run build
  - 建置 Docusaurus 正式版
  - 若建置錯誤會中止流程並顯示錯誤訊息
- npm run serve
  - 啟動 localhost 預覽正式網站

這個流程用於預覽，上線前確認網站呈現是否正確時使用的模式，<br />
若改到設定檔（例如 docusaurus.config.js、sidebars.js），這個模式才會顯示變化，沒有自動重新載入。

## 5. Commit and push to formal release

詳細流程如下：
1. 顯示目前變更狀態
2. 選擇這次修改的類型（空白會取消）
3. 輸入 commit 說明（空白會取消），類型會自動加在前面
4. 自動進行 add → commit
5. 使用 git pull --rebase 同步雲端版本，避免產生多餘的 merge commit
6. 最後 push 到 origin/main，GitHub Actions 會自動部署

| 選項 | 前綴 | 用在 |
|---|---|---|
| 1 | blog: | 部落格文章 |
| 2 | game: | 遊戲頁面 |
| 3 | docs: | 文件、研究筆記 |
| 4 | fix: | 修正錯誤、錯字 |
| 5 | site: | 版面、設定、網站結構 |
| 6 | （無） | 不加前綴 |

範例：選 1，輸入「新增 10/28 日記」→ commit 訊息為 `blog: 新增 10/28 日記`

此流程用於正式更新部署到 GitHub

## 6. Exit

結束檔案