---
title: 开源项目|WordGit
draft: false
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: 在 Word 和 WPS 文字中管理 DOCX 版本、合并返稿，并通过 GitHub 或 Gitee 协作。
published: 2026-11-28
tags:
  - 开源项目
  - Git
  - Word
  - WPS
---

[GitHub 仓库](https://github.com/QTH1225/WordGit) · [原始 README](https://github.com/QTH1225/WordGit/blob/main/README.md) · [WPS 安装说明](https://github.com/QTH1225/WordGit/blob/main/docs/WPS.md)

WordGit 为 Word 和 WPS 文字的 `.docx` 稿件提供 Git 版本管理。你可以在编辑器里提交修改、查看历史、合并返稿，也可以通过 GitHub 或 Gitee 与协作者同步。

- **版本历史**：在提交图中查看分支和旧版，选择提交后预览、对比或恢复。
- **返稿审阅**：基于送审版本生成修订合并稿，在侧栏处理批注和修订。原始返稿与合并结果都可在提交图中追溯。
- **多人协作**：一份稿件关联一个远程仓库。双方都有修改时，可以在合并稿里确认后再提交。

> [!CAUTION]
> 您是自己文档项目的**唯一负责人**。<br>因此对于文档的重要修改以及关键项目节点，您应该**提前备份**，避免插件问题造成的损失或者数据丢失。<br>开发者不对因软件 Bug、意外崩溃、系统环境异常或用户误操作导致的文档损坏、内容丢失或历史记录破坏承担任何责任。

## 界面展示

<table width="100%">
  <tr>
    <td width="19%" align="left" valign="middle">
      <strong>批&#8288;注&#8288;与&#8288;修&#8288;订</strong><br>
      查看批注和修订，按类型筛选，点击记录跳转到正文。
    </td>
    <td width="31%" align="center" valign="middle">
      <a href="https://github.com/QTH1225/WordGit/blob/main/docs/assets/review-pane.png"><img src="https://raw.githubusercontent.com/QTH1225/WordGit/main/docs/assets/review-pane.png" alt="WordGit 批注与修订" width="100%"></a>
    </td>
    <td width="19%" align="left" valign="middle">
      <strong>提&#8288;交&#8288;图&#8288;与&#8288;远&#8288;程&#8288;协&#8288;作</strong><br>
      查看分支、提交记录和同步状态，可预览旧版或对比当前稿。
    </td>
    <td width="31%" align="center" valign="middle">
      <a href="https://github.com/QTH1225/WordGit/blob/main/docs/assets/commit-graph.png"><img src="https://raw.githubusercontent.com/QTH1225/WordGit/main/docs/assets/commit-graph.png" alt="WordGit 提交图与远程协作" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="19%" align="left" valign="middle">
      <strong>提&#8288;交&#8288;版&#8288;本</strong><br>
      填写提交标题和可选说明，保存当前稿的一个版本。
    </td>
    <td width="31%" align="center" valign="middle">
      <a href="https://github.com/QTH1225/WordGit/blob/main/docs/assets/commit-dialog.png"><img src="https://raw.githubusercontent.com/QTH1225/WordGit/main/docs/assets/commit-dialog.png" alt="WordGit 提交版本" width="100%"></a>
    </td>
    <td width="19%" align="left" valign="middle">
      <strong>新&#8288;建&#8288;分&#8288;支</strong><br>
      从提交图选择起始版本，再创建分支。
    </td>
    <td width="31%" align="center" valign="middle">
      <a href="https://github.com/QTH1225/WordGit/blob/main/docs/assets/create-branch-dialog.png"><img src="https://raw.githubusercontent.com/QTH1225/WordGit/main/docs/assets/create-branch-dialog.png" alt="WordGit 新建分支" width="100%"></a>
    </td>
  </tr>
  <tr>
    <td width="19%" align="left" valign="middle">
      <strong>返&#8288;稿&#8288;合&#8288;并</strong><br>
      选定返稿文件和送审版本，生成修订合并稿。
    </td>
    <td width="31%" align="center" valign="middle">
      <a href="https://github.com/QTH1225/WordGit/blob/main/docs/assets/review-merge-dialog.png"><img src="https://raw.githubusercontent.com/QTH1225/WordGit/main/docs/assets/review-merge-dialog.png" alt="WordGit 返稿合并" width="100%"></a>
    </td>
    <td width="19%" align="left" valign="middle">
      <strong>关&#8288;联&nbsp;GitHub&nbsp;仓&#8288;库</strong><br>
      填写仓库地址和远程分支，连接协作仓库。
    </td>
    <td width="31%" align="center" valign="middle">
      <a href="https://github.com/QTH1225/WordGit/blob/main/docs/assets/link-repository-dialog.png"><img src="https://raw.githubusercontent.com/QTH1225/WordGit/main/docs/assets/link-repository-dialog.png" alt="WordGit 关联 GitHub 仓库" width="100%"></a>
    </td>
  </tr>
</table>

## 安装与环境要求

从 [GitHub Releases](https://github.com/QTH1225/WordGit/releases) 下载对应的安装包。Windows 安装包可部署 Word 和 WPS 文字加载项，Linux x86_64 包适用于 WPS 文字。

| 平台 | 安装包 | 安装入口 |
| --- | --- | --- |
| Windows 10 / 11 x64 | `WordGit-0.14.0-Setup.exe` 或 `WordGit-0.14.0-windows.zip` | 图形安装程序或 [WPS 独立安装](https://github.com/QTH1225/WordGit/blob/main/docs/WPS.md#安装windows) |
| Linux x86_64 | `WordGit-0.14.0-linux-x86_64.tar.gz` | 解压后运行 `./install.sh`，详见 [Linux WPS 安装](https://github.com/QTH1225/WordGit/blob/main/docs/WPS.md#安装linux) |
| macOS 12+（Apple Silicon / Intel） | `WordGit-0.14.0-macos-universal.tar.gz` | 适用于 WPS 文字。解压后双击 `Install.command` 或运行 `./install.sh`，详见 [macOS 安装说明](https://github.com/QTH1225/WordGit/blob/main/docs/MACOS.md) |

### Windows 安装要求

| 环境 | 要求 |
| --- | --- |
| 系统 | Windows 10 / 11 x64 |
| 编&#8288;辑&#8288;器 | 图形安装程序要求安装桌面版 Microsoft Word，可同时部署 WPS 文字加载项。仅使用 WPS 时见 [WPS 独立安装](https://github.com/QTH1225/WordGit/blob/main/docs/WPS.md#安装windows) |
| Git | [Git for Windows 2.51+](https://git-scm.com/install/windows) |
| 运&#8288;行&#8288;时 | [.NET Framework 4.8+](https://dotnet.microsoft.com/download/dotnet-framework/net48) |

版本历史、分支、返稿合并和远程同步由随安装包部署的 Rust 内核 `wordgit.exe` 完成。安装后会启动内核，内核退出后可由 Word 自动拉起。Windows 内核已静态链接 VC++ 运行库，安装包无需另外安装 VC++ 运行库或 Rust 工具链。

1. 从上面的发布页下载安装包。
2. 保存文档，关闭 Word 和 WPS 文字。
3. 运行安装程序，在 **数据目录** 中选择历史存放位置，然后点击 **安装 / 更新**。
4. 阅读 [插件使用免责声明](https://github.com/QTH1225/WordGit/blob/main/docs/INSTALL-DISCLAIMER.md)。同意后勾选 **我同意**，点击 **继续安装**。
5. 重新打开 Word，进入顶部 **WordGit** 选项卡。选项卡缺失时可按文档排查。 [加载项排查](#没有看到-wordgit-选项卡时)

ZIP 包的用法相同。完整解压 `WordGit-0.14.0-windows.zip`，运行其中的 `WordGit.Setup.exe`。也可以双击 `Install.cmd` 安装或用 `Check.cmd` 检查环境。

安装作用于当前 Windows 用户。升级时直接运行新版安装程序，已有提交、分支和审阅稿继续保留。卸载可从 Windows“已安装的应用”或安装程序进入，历史数据也会保留。

本轮发布包在 Windows 11 x64、64 位 Word 上完成实机回归。32 位 Word 已验证注册表写入，实机功能仍待验证。发布包的签名与兼容性状态见 [发布说明](https://github.com/QTH1225/WordGit/blob/main/docs/RELEASING.md)。

## 在 Word 中载入插件

WordGit 是 Word 的 COM 加载项，**不需要在 Word 里手动添加文件**：安装程序完成注册后，Word 每次启动都会自动载入它。

### 载入方式

<details>
<summary>查看 Word 加载项的注册表信息</summary>

安装程序只写当前用户（HKCU）的注册表，不需要管理员权限：

| 注册项 | 作用 |
| --- | --- |
| `Software\Classes\CLSID\{C5707F76-F46F-4A11-800B-18E7D98377D3}` 与 `WordGit.Connect` | 把插件登记为 COM 组件，指向 `%LOCALAPPDATA%\WordGit\app\WordGit.<版本>.<哈希>.dll`。 |
| `Software\Classes\CLSID\{F55EC3C1-B725-4ED8-9CA6-ED51D07C3361}` 与 `WordGit.HistoryPane` | 右侧“批注、修订与提交”窗格的控件。 |
| `Software\Microsoft\Office\Word\Addins\WordGit.Connect` | 告诉 Word 有这个加载项；`LoadBehavior = 3` 表示 Word 启动时自动载入。 |

安装程序会读取 `WINWORD.EXE` 判断 Word 是 32 位还是 64 位，再写入对应的注册表视图，所以两种 Word 使用同一个安装包。

</details>

### 确认已经载入

1. 安装完成后**完全关闭 Word 再重新打开**。仍在运行的 Word 不会载入新插件，可在任务管理器确认没有残留的 `WINWORD.EXE`。
2. 顶部出现 **WordGit** 选项卡即表示载入成功。
3. 也可以在 Word 中打开 **文件 → 选项 → 加载项**，“活动应用程序加载项”列表里应有 **WordGit**，类型为“COM 加载项”。

## 常见问题

### 没有看到 WordGit 选项卡时

| 情况 | 处理 |
| --- | --- |
| 加载项被取消勾选 | **文件 → 选项 → 加载项**，底部“管理”选择 **COM 加载项** → **转到**，勾选 **WordGit** → **确定**。 |
| 被 Word 自动禁用（Word 启动时崩溃或加载过慢后会这样做） | 同一页面“管理”选择 **禁用项目** → **转到**，选中 WordGit → **启用**，然后重启 Word，再按上一行勾选。 |
| 环境不完整 | 双击 ZIP 包中的 `Check.cmd`，或在安装程序中点击“检查环境”，确认 Word、Git for Windows 与 .NET Framework 4.8；缺什么装什么，再重新运行安装程序。 |
| 单位电脑开启了“要求应用程序加载项由受信任的发布者签名” | 当前安装包未做代码签名，会被该策略拦截（位置：**文件 → 选项 → 信任中心 → 信任中心设置 → 加载项**）。这项通常由管理员统一设置，需请管理员放行。 |
| 以安全模式启动 Word（如 `winword /safe`） | 安全模式不载入任何加载项，请正常启动 Word。 |
| 刚升级完 | 确认已关闭所有 Word 窗口后再运行新版安装程序；仍不出现时重新运行一次 **安装 / 更新**。 |

不要在“COM 加载项”对话框中用 **添加** 按钮浏览 WordGit 的 DLL：.NET 编写的加载项需要上面的注册表登记，直接添加 DLL 文件无效。

WPS 文字用户可在 **工具 → WPS 加载项** 查看 WordGit 的启用状态。确认加载状态或重新安装时可参考对应平台的说明。 [WPS 安装说明](https://github.com/QTH1225/WordGit/blob/main/docs/WPS.md)

### 暂时停用与卸载

- 暂时停用：在“COM 加载项”对话框中取消勾选 WordGit，Word 下次启动不再载入；重新勾选即可恢复。
- 卸载：从 Windows“已安装的应用”找到 WordGit，或运行安装程序点击 **卸载**。卸载只删除插件文件和上述注册项，稿件、`repositories` 历史、`sessions` 审阅稿和日志都会保留。

## 快速上手

1. 将稿件保存为本地 `.docx`，例如 `D:\Manuscripts\paper.docx`。WordGit 需要能直接读取的本地文件：OneDrive / SharePoint 中以网址打开的稿件，请打开同步到本机文件夹里的那份副本。需要切换分支、原地恢复或合并时，使用 OneDrive 等同步目录之外的本地文件夹。
2. 点击 **WordGit → 提交版本**，填写提交标题，按需补充详细内容。点击“提交”或按 Ctrl + Enter，插件保存当前稿并创建提交。
3. 点击 **提交图** 打开右侧窗格，选中历史版本后点击 **预览** 或 **对比当前稿**。
4. 继续修改，在需要保留进展时再次提交。

## 功能区

| 分组 | 用法 |
| --- | --- |
| 本地提交 | 提交当前稿，在**提交图**中查看历史、预览旧版或对比当前稿。 |
| 分支 | 从一个提交新建分支。工作完成后，合并分支并清理已合入的其他分支。 |
| 比较与审阅 | **对比版本**支持比较当前稿和旧版，按住 Ctrl 可选两个历史版本。收到审阅稿后用**返稿合并**。 |
| 远程协作 | **关联仓库**连接当前稿，**克隆稿件**将仓库历史还原为本地 DOCX。日常用**获取**查看远程进展，用**拉取**合入远程修改，再**推送**本地提交。 |
| 取回版本 | **另存旧版**生成新文件，**恢复旧版**写回当前稿并生成一条新提交。 |
| 关于与更新 | 查看当前版本、检查更新或迁移数据目录。关于窗口可单独开启 Beta 更新提醒。 |

在右侧窗格点击批注或修订即可跳到正文。处理一条修订后会定位到下一条，合并稿审阅完毕后点 **完成合并**。 [使用说明](https://github.com/QTH1225/WordGit/blob/main/docs/USAGE.md)

## 项目结构

```text
WordGit/
├─ crates/
│  ├─ wordgit-core/     版本历史内核：分块快照、分支、返稿合并、远程同步与崩溃恢复
│  └─ wordgit/          本地服务 wordgit.exe：HTTP 接口、安装与命令行
├─ src/                 Word 界面插件、侧栏，以及 Word 原生对比与修订合并
├─ addin-wps/           WPS 文字 JS 加载项
├─ packaging/           独立安装程序及其界面验证
├─ tests/               内核联调、界面、侧栏首帧和安装测试
├─ docs/
│  ├─ assets/           README 图片资源
│  ├─ USAGE.md          完整使用流程
│  ├─ DEVELOPMENT.md    构建、测试和开发说明
│  ├─ WPS.md            WPS 文字加载项说明
│  └─ RELEASING.md      打包、发布与验证记录
├─ .github/             CI、CodeQL、PR 与 Issue 模板
├─ scripts/
│  ├─ build.ps1          编译内核与界面插件并运行测试
│  ├─ package.ps1        打包 Windows EXE 和 ZIP
│  ├─ install.ps1        安装、升级和卸载
│  ├─ Install.cmd、Check.cmd、Uninstall.cmd
│  └─ Linux 打包、发布说明生成和 GitHub 发布脚本
├─ bin/                 编译与测试输出（生成）
├─ dist/                发布包（生成）
├─ Cargo.toml、Cargo.lock
├─ README.md
└─ LICENSE
```

`crates/wordgit-core` 负责与 Git 仓库打交道的一切：分块快照、提交、分支、返稿合并、远程同步、存储整理和崩溃恢复；`crates/wordgit` 把它包装成本地 HTTP 服务（只监听 `127.0.0.1`，口令写在 `%LOCALAPPDATA%\WordGit\service.json`）。Word 与 WPS 的加载项都只是这个服务的客户端。

`src/` 中的主要模块：

<details>
<summary>查看 Word 加载项的源码模块</summary>

| 文件 | 职责 |
| --- | --- |
| `AddIn.cs` | 插件入口、WordGit 功能区和各项操作的流程，经本地服务调用内核。 |
| `ServiceClient.cs`、`ServiceModels.cs` | 发现服务端口与口令、请求重试，以及请求与响应的数据模型。 |
| `Operations.cs` | 按稿件区分的后台操作状态、退出前等待，以及界面线程同步上下文。 |
| `TaskPanes.cs`、`HistoryPane.cs`、`PaneLoadingFrame.cs`、`CommitGraph.cs` | 右侧窗格、加载框架、批注与修订列表、提交图。 |
| `WordDocuments.cs` | Word 文档读写、原生对比与修订合并、两段式替换当前稿。 |
| `QuietWord.cs` | 在独立桌面启动不可见 Word 进程生成合并稿，不抢前台焦点。 |
| `ReturnReviewDecisions.cs`、`ReviewCommentStatus.cs`、`TrackedReviewSnapshot.cs` | 多次返稿合并的接受/拒绝处理、批注状态恢复与修订追踪。 |
| `RemoteDialog.cs`、`ImportReviewDialog.cs` | 远程连接、返稿导入与合并选项。 |
| `Dialogs.cs`、`DialogPlacement.cs` | 提交标题和详细内容、分支和历史操作对话框、居中显示的进度窗口。 |
| `AppInfo.cs`、`AboutDialog.cs`、`UpdateChecker.cs` | 版本信息、作者链接和更新检查。 |

</details>

## 数据位置与备份

| 目录 | 内容 |
| --- | --- |
| `%LOCALAPPDATA%\WordGit\app` | 界面插件、Rust 内核 `wordgit.exe` 和安装维护程序。 |
| `%LOCALAPPDATA%\WordGit\service.json` | 内核当前端口与口令；加载项据此连接，两处不一致时重启编辑器即可。 |
| `<数据目录>\repositories` | 稿件的 Git 历史仓库。默认数据目录是 `%LOCALAPPDATA%\WordGit`。 |
| `%LOCALAPPDATA%\WordGit\sessions` | 预览、对比和合并审阅文件；一天前的残留会自动清理。 |
| `%LOCALAPPDATA%\WordGit\logs` | 出错记录 `wordgit.log`（超过 1 MB 自动轮转），反馈问题时请附上。日志中的用户目录写作 `%USERPROFILE%`。 |

在 Word 或 WPS 的 **WordGit → 数据目录** 中可以更改存放位置。WordGit 会校验并迁移全部历史，Word 和 WPS 共用这项设置。正在使用的审阅稿和预览继续保存在 `sessions`。

历史按稿件的完整路径关联。稿件改名或移动后会对应新的历史位置，原历史仓库仍保留。

切换分支、恢复旧版或拉取时，内核先把原稿备份到 `sessions` 中的临时文件，成功后立即删除。如果 Word 在替换途中退出，下次启动时内核会自动还原原稿或完成操作；无法自动处理时会提示备份位置，这类备份保留 30 天。后台提交、推送等操作尚未完成时关闭 Word，Word 会等待它们结束。

备份时关闭 Word，同时保存原稿和整个 `repositories` 文件夹；有未完成的合并审阅时，再保存 `sessions`。提交时会复用相同的数据块，历史版本可重新生成 DOCX。 [空间与历史压缩](https://github.com/QTH1225/WordGit/blob/main/docs/USAGE.md#空间与历史压缩)

## 开发与更多说明

### 从源码载入

开发者不需要安装包，在项目根目录依次运行（需要 [Rust 工具链](https://rustup.rs/) 来编译内核）：

```powershell
# 1. 编译界面插件与 Rust 内核，生成 bin\WordGit.dll 和 bin\wordgit.exe
pwsh -NoProfile -ExecutionPolicy Bypass -File .\scripts\build.ps1

# 2. 关闭所有 Word 窗口后，注册到当前用户（与安装程序写入相同的注册项，并部署内核与 WPS 加载项）
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\install.ps1
```

`scripts/install.ps1` 面向 Windows PowerShell 5.1，用 `powershell.exe` 运行。重新编译后再运行一次 `scripts/install.ps1`，Word 下次启动就会载入新版本；`scripts/install.ps1 -Uninstall` 可撤销注册。只想编译 C# 界面时可加 `-NoRust`，直接复用已有的 `bin\wordgit.exe`。

### 构建与打包

在项目根目录运行以下命令。

```powershell
# 构建并检查功能与界面
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\build.ps1 -Test -UiTest

# 生成并验证发布包
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\package.ps1 -Test
```

- [使用说明](https://github.com/QTH1225/WordGit/blob/main/docs/USAGE.md)：分支合并、返稿导入、远程协作和版本取回的详细步骤。
- [开发说明](https://github.com/QTH1225/WordGit/blob/main/docs/DEVELOPMENT.md)：源码安装、测试命令和模块开发。
- [发布说明](https://github.com/QTH1225/WordGit/blob/main/docs/RELEASING.md)：安装包制作、发布检查及兼容性记录。

## 贡献与反馈

- **报告问题**时请附上 WordGit 版本、操作系统、Word 或 WPS 版本，以及复现步骤和报错。与特定文档有关时，可附一份可共享的测试稿。 [提交 Issue](https://github.com/QTH1225/WordGit/issues/new/choose)
- **提交改进**时可以补充功能、修复问题或改进文档。Pull Request 中请说明改动和验证方式。 [开发说明](https://github.com/QTH1225/WordGit/blob/main/docs/DEVELOPMENT.md)

## 许可证

Copyright (C) 2026 QTH1225。

本项目采用 GNU General Public License v3.0（SPDX：`GPL-3.0-only`）。使用、修改和再分发遵循 [LICENSE](https://github.com/QTH1225/WordGit/blob/main/LICENSE)。分发安装包时，同时提供对应版本的完整源码和构建脚本。

## Star History

如果 WordGit 对你有帮助，欢迎点个 Star。

<a href="https://www.star-history.com/?repos=QTH1225%2FWordGit&amp;type=date">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=QTH1225%2FWordGit&amp;type=date&amp;theme=dark">
    <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=QTH1225%2FWordGit&amp;type=date">
    <img src="https://api.star-history.com/chart?repos=QTH1225%2FWordGit&amp;type=date" alt="WordGit 在 GitHub 上的 Star 增长曲线">
  </picture>
</a>
