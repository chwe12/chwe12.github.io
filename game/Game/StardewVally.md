---
sidebar_position: 4
title: StardewVally
---

# StardewVally
*最後更新時間：2021/12/05*<br /><br />
很久沒有玩了，把一些以前的紀錄放上來。<br />

## 紀錄
### 存檔修改
要用mod的話下載SMAPI然後安裝CJB就可以了。<br />
存檔位置：%AppData%\Roaming\StardewValley\Saves\<br />
後面帶_old的是前一天的資料，修改前可以先把不帶_old的複製，避免修改錯誤。<br />
另外，不要在loading之後的頁面修改，有機率檔案損毀。<br />

### 物品修改
存檔內容似乎會隨著版本更新改變，沒有拿到過的物品就不會顯示在存檔裡。<br />
修改物品數量的時候，如果有兩個stack都要改。<br />
物品可參考網址：https://gist.github.com/wotupset/74eda7205ee3c9de625e<br />
<br />
如果是身上的斧頭需要升級，找到upgradeLevel之後，修改數字，1~4，4是最高級。<br />
<br />
身上的錢，找位置：<br />
```xml
<money>3566303</money>
```
賺了多少錢的成就：<br />
```xml
<totalMoneyEarned>1004417</totalMoneyEarned>
```
<br />
起手輕鬆一點需要調的物品有錢、炸彈、武器、工具，這樣開局就可以一直存物品解收藏包，基本上種的農作物全部存下來就對了...。<br />

### 村民好感度
以Haley為例，找到以下的位置，把points以後的數字改成2500，2500是滿好感度。<br />
![CK](/img/game/StV/StV0.png)<br />

### 技能修改
以釣魚為例，找到fishinglevel的數字，調到高一點就可以，但是最好不要超過技能點數的等級(5, 10)<br />
技能點數超過10容易閃退。<br />

### 物品代碼
將玩家名字取成物品代碼，當NPC說一次名字就會獲得物品，或是買動物、小孩的名字等等都有用。<br />
例如將玩家名字改成[166]（包含括號），當NPC叫玩家一次就能獲得價值5000的財寶箱...<br />

## 姜島
1. 姜島需要的幣有Golden Walnut、Qi Gem。
2. 鍛造可以附魔武器和農場工具，鍛造用的物品有Cinder Shard 、Galaxy Soul (對Galaxy Sword使用三個可以變成更強的武器)、Prismatic Shard。其中Cinder Shard和Prismatic shard用來對武器附魔。
3. 兩個戒指可以合成一個，這樣帶滿戒指就會有4個戒指的效果。
4. 附魔武器的部分還能用各種寶石加強武器效果，像是增加暴擊率、暴擊傷害、防禦力...。

## 參考連結
SMAPI - Stardew Modding API<br />
https://www.nexusmods.com/stardewvalley/mods/2400<br />

CJB Item Spawner<br />
https://www.nexusmods.com/stardewvalley/mods/93<br />

CJB Cheats Menu<br />
https://www.nexusmods.com/stardewvalley/mods/4<br />
