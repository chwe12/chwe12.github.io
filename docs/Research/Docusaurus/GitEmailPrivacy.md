---
sidebar_position: 3
title: Git email
---

# Git commit 處理紀錄
*最後更新時間：2026/11/09*<br />

整理網站時發現 git commit 紀錄裡可能帶有個人信箱，所以做了一次修正和確認各項設定，順便記錄步驟。<br />

## 設定步驟

### 1. commit 改用 GitHub noreply email

noreply email 格式：`<GitHub ID 數字>+<帳號>@users.noreply.github.com`<br />
ID 數字可以從 `https://api.github.com/users/<帳號>` 的 `"id"` 查到。

```
git config --global user.name <帳號>
git config --global user.email <ID>+<帳號>@users.noreply.github.com
```

- `--global` 是整台電腦的預設值，不加則只對目前的 repo 有效
- 每台電腦都要各設一次

### 2. GitHub 帳號設定

到 github > email勾選：
- **Keep my email addresses private**
- **Block command line pushes that expose my email**


### 3. 修正舊的 commit 紀錄

用 `git filter-repo` 搭配 mailmap，把舊的 email 換成 noreply：

```
pip install git-filter-repo
```

mailmap 檔案內容（一行一個要替換的 email）：
```
<帳號> <ID>+<帳號>@users.noreply.github.com <要替換的email>
```

```
git clone --mirror . ../backup.git              # 先備份
python -m git_filter_repo --mailmap mailmap --force
git remote add origin <repo網址>                # filter-repo 會移除 remote
```

- 改寫後所有 commit hash 都會改變，無法復原，一定要先備份
- commit 訊息裡如果也有 email，要一起檢查

### 4. 重新建立 repo

改寫後的歷史可以 force push，也可以刪掉 repo 重建，重建會比較乾淨：

1. 刪除原本紀錄並建立同名的repo
2. 本機推上去（新 repo 是空的，不需要 force）：`git push -u origin main`
3. 新 repo → Settings → **Pages** → Source 選 **GitHub Actions**，網站就會重新部署

### 5. 網站設定

`docusaurus.config.js` 裡的 `showLastUpdateAuthor` 會在頁面顯示最後修改者，不需要的話改成 `false`。

## 注意事項

- 改寫歷史後不要用 `update_and_deploy.bat` 的選項 2、5 去拉舊的 remote，`git pull --rebase` 會把舊紀錄拉回來
- 其他電腦上的舊 clone 要刪掉重新 clone
