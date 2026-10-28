---
sidebar_position: 3
title: Arduino & Raspberry Pi note
---

# Arduino & 樹莓派筆記
*最後更新時間：2026/10/28*<br />

上課和自己測試 Arduino、樹莓派 5 的紀錄，原始紀錄在 blog：
[2025-09-09](/blog/2025-09-09)、[2025-09-23](/blog/2025-09-23)、[2025-10-25](/blog/2025-10-25)

尚未克服的難題：
- 從外面連回樹莓派：目前要先遠端連進筆電；把樹莓派帶出去又需要重新設定網路
- Windows 遠端桌面可以連進去但會黑屏
- 公司螢幕限制多，HDMI / VGA 輸出還有問題

## Arduino

### 燒錄錯誤排除
1. 燒錄工具出現 `requestMetadata is not a function` 錯誤 → 要用**系統管理員**身分開啟
   - [參考討論](https://forums.balena.io/t/error-0-h-requestmetadata-is-not-a-function/371138/17)
   - 也可以改用 Win32 Disk Imager（[其他指令參考](https://korewa72.blogspot.com/2018/09/blog-post.html)）
2. 下載的映像檔**不用解壓縮**，直接給燒錄工具即可

### 實作紀錄
- 連上藍芽和濕度感測器，成功抓到數值（還沒拿另一個感測器校正）
- 用手機藍芽控制 Arduino 上的 LED，另外做了讓燈號閃爍的 case
- 發現色碼其實就是 2,2,2 位的 16 進位

## 樹莓派 5

### SSH 連線
- 在筆電的 CMD 直接打 `ssh 帳號@hostname`，輸入密碼就能連線，不需要 PuTTY，比設定 VNC 簡單
- [參考影片](https://youtu.be/dU-4Bq-Trdg)

### 沒有藍芽鍵盤滑鼠
- 拆下 iPad 的藍芽鍵盤來用：可以打字，但觸控板可能有針對 iPad 設定，沒辦法滑到整個螢幕

### SSD 開機掛載
- 讓 SSD 開機時自動掛載，之後放 PXE 檔案會比較方便
- 不需要另外開 PCIe 通道
- [參考文章：Ubuntu 開機自動掛載硬碟](https://www.weichen.idv.tw/wordpress/2023/02/20/ubuntu-%E9%96%8B%E6%A9%9F%E8%87%AA%E5%8B%95%E6%8E%9B%E8%BC%89%E7%A1%AC%E7%A2%9F/)