---
sidebar_position: 2
title: Auto Update, Reset tool
---

# Git Local Reset & Update Tool 批次檔介紹

update_and_deploy.bat 是在 Windows 上執行的自動化工具，用來簡化開發過程中的版本控制與測試流程。  <br />
將多項 Git 與 Docusaurus 操作整合，用選項的方式執行 reset、pull、local build test、commit、push 等動作。<br />

---

## 功能選單說明

執行批次檔後會出現以下選單：<br />
Reset and clean only (discard local changes)<br />
Reset, clean, and pull latest from origin/source<br />
devTest<br />
Local test (Production Build and Production Preview)<br />
Commit and push to formal release<br />
Exit<br />

## Reset and clean only

此選項會：
- 強制還原工作目錄到最新一次 commit 的狀態
- 移除所有未追蹤檔案與未提交的變更
- 不會向遠端拉取最新版本
- 適合在想清除本地實驗性修改、回到乾淨環境時使用

## Reset, clean, and pull latest from origin/source

此選項包含選項 1 的所有動作，並多做一件事：
- 從 origin/source 拉取最新版本
- 避免誤觸，批次檔額外加入了雙重確認機制：
- 顯示大型警告文字提示此操作會刪除所有本地變更
- 使用者必須輸入 y 才會繼續執行 reset + pull
- 避免不小心按到導致內容遺失
- 適合用於同步不同電腦環境文件

## devTest（Development Server）

此選項會啟動 Docusaurus 的開發模式，功能如下：
- 自動重新載入
- 適合日常撰寫、內容開發與即時查看變更
- 不執行壓縮或最佳化
- 適用於開發過程中需要快速查看修改結果的情況

## Local test（正式版本地預覽）

此選項會執行兩件事：
- npm run build
  - 建置 Docusaurus 正式版
  - 若建置錯誤會中止流程並顯示錯誤訊息
- npm run serve
  - 啟動 localhost 預覽建置後的正式網站

這個流程用於「正式版預覽」，也就是上線前確認網站呈現是否正確時使用的模式，<br />
若改到設定檔（例如 docusaurus.config.js、sidebars.js），這個模式才會顯示變化，沒有自動重新載入。

## Commit and push to formal release

詳細流程如下：
1. 顯示目前變更狀態
2. 要求輸入 commit 訊息（空白會自動取消）
3. 自動進行 add → commit
4. 使用 git pull --rebase 來避免復雜的 merge commit
5. 最後 push 到 origin/source

此流程用於正式更新部署到 GitHub

## Exit

結束檔案