---
sidebar_position: 6
title: Firmware & software basics
---

# 電腦軟體和韌體簡介
*最後更新時間：2021/12/21*<br />

有時候看到一些不太懂電腦的人很想知道如何做基本除錯，因此有了這篇。

## 韌體

電腦的架構除了硬體以外，最粗淺的分成韌體和軟體。韌體最常接觸到的是主機板上的 UEFI，很多人也習慣稱之為 BIOS，但嚴格來說 BIOS（Legacy BIOS）是 UEFI 之前的舊式韌體，現在的電腦大多已經是 UEFI，只是口語上還是常叫 BIOS（SSD、顯卡等硬體其實也有各自的韌體，這裡先只談主機板的）。軟體最底層是作業系統，像是 Windows、Linux 就是不同種類的作業系統。

從一開始按下開機鍵跑的是韌體，接著韌體搜尋作業系統，然後到大家熟知的桌面。<br />
有時候開機遇到不是桌面的畫面，顯示電腦的資訊，像是 CPU、Memory...等等，又可以操作，很大部分是到了 UEFI 的介面。現在的 UEFI 介面已經非常人性化，其實使用者能輕易看懂，只是裡面的選項，**尤其是 Security、CSM 相關的最好不要隨便調整**。

至於為什麼沒有操作任何步驟就只能到 UEFI，而不是作業系統，常見原因是 SSD/HDD 損毀或作業系統損毀，但也可能只是 Boot order、SATA 模式（AHCI/RAID）、CSM、Secure Boot 等設定被改動，或是硬碟排線鬆脫。可以先看 UEFI 裡有沒有抓到硬碟、Boot order 對不對，再用重灌、換硬體的方式做交叉驗證。如果之前沒有備份的話，可以找轉接頭把 SSD/HDD 接到可以開機的電腦上，如果硬體沒有損壞，有機率可以把資料備份出來。

UEFI/BIOS 介面應該都會顯示 **Boot order**（或是 Boot priority、Boot device priority，總之就是 Boot，單看廠商如何描述），這是因為開機不僅僅可以到常見的作業系統，也可以到其他介面，如 Shell、CD、USB key。有些人會把作業系統的安裝檔做成 USB 安裝碟，作業系統損毀需要重灌的時候，就是從 Boot order 裡選擇 USB key，然後重灌。

UEFI Specification 是大家都可以查閱的文件，可參考官網，裡面定義了 UEFI 的基本架構：<br />
https://uefi.org/specifications

## 軟體

作業系統的部分，Windows 和 Linux 的安裝 USB 可以用懶人的方法製作：<br />
[Rufus](https://rufus.ie/) 是一個免費開源軟體，將下載好的 ISO 寫入 USB key 之後就可以灌作業系統。比較需要注意的是檔案系統格式，FAT32 的相容性較高，因為 UEFI 規格保證能從 FAT32 開機，但 FAT32 的單一檔案不能超過 4GB。Linux 的 ISO 通常用 FAT32 沒問題；Windows 10/11 的 ISO 裡有超過 4GB 的檔案（install.wim），Rufus 會自動改用 NTFS，照預設就好。如果是外接硬碟要存大檔案，則選用 NTFS 或 exFAT。

作業系統再往上就是大家熟知的驅動程式和應用程式。驅動程式看各家廠商，基本上就是連上網後到各家廠商官網更新。應用程式就是使用者自己下載使用。
