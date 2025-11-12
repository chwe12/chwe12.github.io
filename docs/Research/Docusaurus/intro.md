---
sidebar_position: 1
title: Docusaurus learning note
---

# Docusaurus learning note
*最後更新時間：2025/11/12*<br />

這一區紀錄了我研究 Docusaurus 的歷程，希望能幫助未來的自己快速回顧整個架構脈絡。<br />

尚未克服的難題：
- 更新原本docusaurus架構至最新版本


### Trouble shooting

1. 遇到 sidebar 每個文章的位置排列方式問題，原本想要從 sidebars.js 裡面去調整成客製化的排列方式，後來發現用資料夾分類時，資料夾裡面的順序似乎可以從1開始排列，就不用分資料夾內外的順序了
2. 要加新的資料夾到首頁顯示時，寫到 docusaurus.config.js