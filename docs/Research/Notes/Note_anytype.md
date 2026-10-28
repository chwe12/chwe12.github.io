---
sidebar_position: 4
title: AI tools & note system
---

# AI 工具與筆記系統
*最後更新時間：2026/10/28*<br />

整理我的筆記方法，以及用 AI 管理筆記的設定，原始紀錄在 blog：
[2025-12-04](/blog/2025-12-04)、[2026-10-22](/blog/2026-10-22)

## 各類筆記方法

| 方法 | 結構 | 我的用法 |
|:---|:---|:---|
| 一頁紙 | what、why、how + keyword、summary | 工作、平日外出隨手記 |
| 康乃爾 | 筆記 note、關鍵字 keyword、總結 summary | 參考 |
| 麥肯錫 | 現狀 what、原因 why、對策 how | 參考 |
| 卡片盒 | 靈感 Fleet、文獻 Literature、永久 Permanent | 週末整理成永久筆記 |

選 Anytype 的原因：有關聯圖（Obsidian 也有，但已經習慣 Anytype）；Notion 沒有關聯圖、連線慢、常常要更新

## Claude 連接 Anytype（MCP）

讓 Claude 可以直接讀寫 Anytype 裡的筆記。

### 需要
- Claude 桌面版
- Anytype 桌面版
- Node.js

### 步驟
1. Anytype：Settings → API，建立新的 API key
2. Claude：Settings → Developer → Edit Config，找到 `claude_desktop_config.json`，**先備份一份**
3. 關閉 Claude，到工作管理員確認沒有 Claude 背景程式
4. 在設定檔加入以下內容，把 `YOUR_NEW_API_KEY` 換成剛剛的 API key：

```json
{
  "mcpServers": {
    "anytype": {
      "command": "npx",
      "args": [
        "-y",
        "@anyproto/anytype-mcp"
      ],
      "env": {
        "OPENAPI_MCP_HEADERS": "{\"Authorization\":\"Bearer YOUR_NEW_API_KEY\",\"Anytype-Version\":\"2025-11-08\"}"
      }
    }
  }
}
```

5. 重新打開 Claude，確認連接器裡有 anytype

### 注意事項
- 建議在指示裡加上「未經確認，不刪除筆記、不覆寫整篇內容、不進行批次修改」，避免不小心毀掉整份筆記