---
title: Arch Linux 下安装 MATLAB 与中文输入修复
draft: false
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: 使用 MPM 安装 MATLAB R2026b，处理下载中断、授权启动崩溃，以及 Qt 与 Fcitx5 的中文输入兼容问题。
published: 2026-11-08
tags:
  - Linux
  - MATLAB
  - Fcitx5
---

这次在 Arch Linux 的 Niri/Wayland 桌面安装 MATLAB，先后遇到了下载中断、启动崩溃，以及中文输入法无法切换的问题。最终通过官方 MATLAB Package Manager（MPM）完成安装，并使用在线授权模式和 IBus Portal 连接恢复了正常使用。

## 环境与安装位置

本次实际验证的环境如下，其他版本可以参考排查思路，但不保证遇到相同问题。

| 项目 | 版本或配置 |
| --- | --- |
| 系统 | Arch Linux，x86_64 |
| 内核 / glibc | 7.2.14-arch1-1 / 2.44 |
| 桌面 | Niri，Wayland 会话 |
| MATLAB | R2026b Update 1，26.2.0.3433840 |
| MATLAB 自带 Qt | 6.8.5 |
| 输入法 | Fcitx5 5.1.22，Rime |
| 安装位置 | `~/.local/opt/MATLAB/R2026b` |

MATLAB 放在用户目录下，无需 sudo。这里的 `~/.local/opt` 与系统的 `/opt` 是不同目录；前者由当前用户管理，后者一般用于系统级的附加软件。软件不必统一安装到同一个 `opt` 目录。

Arch Linux 不在本次查询的 MathWorks 官方验证发行版列表中。这篇文章记录的是本机实测结果，官方支持范围可查阅 [Linux 系统要求](https://www.mathworks.com/support/requirements/matlab-linux.html)。

## 使用官方 MPM 安装

MPM 可以从命令行下载并安装 MATLAB，授权在之后启动时处理。使用前需要准备可用的 MathWorks 账号和 MATLAB 授权，例如学校提供的授权。

先下载官方工具：

```bash
mkdir -p "$HOME/.cache/mathworks-mpm"
cd "$HOME/.cache/mathworks-mpm"

curl -fL --continue-at - --connect-timeout 30 \
  https://www.mathworks.com/mpm/glnxa64/mpm \
  -o mpm.download

chmod u+x mpm.download
mv mpm.download mpm
```

以上命令应逐步执行，只有 `curl` 成功结束后才运行 `chmod` 和 `mv`，避免把不完整的下载当成可执行程序。

安装 MATLAB 主程序：

```bash
"$HOME/.cache/mathworks-mpm/mpm" install \
  --release=R2026b \
  --destination="$HOME/.local/opt/MATLAB/R2026b" \
  --products=MATLAB
```

如果有 Simulink 授权且需要使用，将最后一行改为 `--products=MATLAB Simulink`。其他工具箱也可以通过产品名称添加，具体参数见 [MPM 安装文档](https://www.mathworks.com/help/install/ug/mpminstall.html)。

### 下载慢与连接中断

本次最开始的 ZIP 文件是空文件，旁边还有一个未完成的 `.part` 文件，不能直接解压安装。改用 MPM 后，下载工具本身时又遇到了：

```text
curl: (56) OpenSSL SSL_read: ... unexpected eof while reading
```

这表示下载连接提前结束，并不能据此判断是证书、代理还是服务器端的问题。当时约 72 MB 的工具只下载到 40 MB。保留 `mpm.download`，重新执行上面的 `curl` 命令即可尝试续传：`--continue-at -` 会从已有文件末尾继续。如果服务器不支持续传，curl 会报错，需要单独处理，不能将部分文件直接改名运行。

下载慢时可以比较当前网络、手机热点或不同代理线路的速度。本次没有证据证明某一个网络因素就是根因。

### 安装停在 89%，如何判断是否卡住

MPM 的百分比不是连续刷新的。此次安装进度在 89% 停留了较长时间，但临时目录中的一个 `.enc` 文件仍从约 327 MB 增长到 332 MB，说明下载还在继续。

可以在另一个终端检查日志：

```bash
tail -n 20 /tmp/mathworks_"$USER".log
```

若日志中提示了临时下载文件，可间隔十几秒用 `stat` 检查该文件大小。临时目录名每次不同，应使用本次日志中的路径。只要文件还在增长，就不要因为百分比未变化而反复中断安装。

本次最终日志包含：

```text
Exiting with status 0
End - Successful
```

这确认安装完成；它并不代表之后的授权与图形界面启动一定正常。

## 启动崩溃：切换在线授权模式

安装完成后首次启动，出现了“MATLABWindow (Browser) 已停止工作”的窗口。本机同时生成的 `~/matlab_crash_dump.*` 显示，MATLAB 启动崩溃栈涉及：

```text
matlab_startup_plugins/lmgrimpl/libmwlmgrimpl.so
lc_new_job
```

这是本次诊断的线索，不能把所有 MATLABWindow 崩溃都归因为授权组件。对本机有效的处理是改为在线授权启动：

```bash
"$HOME/.local/opt/MATLAB/R2026b/bin/matlab" \
  -desktop -licmode onlinelicensing
```

之后使用有授权的 MathWorks 账号登录。这个参数用于选择授权方式，不会提供或绕过许可证。相似记录可参考 [MATLAB R2025b 启动崩溃讨论](https://www.mathworks.com/matlabcentral/answers/2182377-matlab-r2025b-crash-on-startup)。

## 中文输入无法切换：Qt、Fcitx5 与 IBus Portal

### 表现与诊断

MATLAB 能够打开，但编辑器中不能切换到中文输入。其他程序可以正常使用 Fcitx5。此次没有通过重新安装输入法解决，而是逐步检查实际运行环境。

首先，在 MATLAB 开着的情况下运行：

```bash
fcitx5-remote
fcitx5-remote -n
fcitx5-diagnose > "$HOME/Downloads/matlab-ime-diagnose.txt" 2>&1
```

最好保持 MATLAB 编辑器获得焦点时采集，或先延迟几秒再切回编辑器，以便查看对应输入上下文。报告可能包含用户名、路径和运行程序名称，公开前应检查内容。

本次报告与安装目录提供了以下证据：

- Fcitx5、Rime 与 IBus Frontend 均已启用。
- MATLAB 进程实际继承了输入法变量，问题不是简单的变量没有生效。
- `MATLABWindow` 链接 MATLAB 自带的 Qt 6.8.5。
- 自带的 `platforminputcontexts` 目录只有 IBus 和 Compose 插件，没有 Fcitx 插件。
- 系统中不存在 `ibus-daemon` 可执行文件。

### 为什么前面的设置没有解决

仅设置 `GTK_IM_MODULE=fcitx` 或 `xim` 没有解决本次问题。决定该窗口输入接口的是它自带的 Qt，不能只按 GTK 程序处理。

将 `QT_IM_MODULE` 改为 `ibus` 后，诊断报告确认 `libibusplatforminputcontextplugin.so` 已加载，但依然没有相应的 IBus 输入连接。**插件加载成功与输入法连接成功是两个不同的检查点。**

继续核对 [Qt 6.8 的 IBus 插件源码](https://github.com/qt/qtbase/blob/6.8/src/plugins/platforminputcontexts/ibus/qibusplatforminputcontext.cpp)，可以看到普通模式会通过 `findExecutable("ibus-daemon")` 检查程序是否存在。使用 Fcitx5 的系统可能没有这个程序，即使 Fcitx5 已提供 IBus 兼容接口，这个检查仍会阻止插件按普通模式初始化。

Portal 模式则通过会话 D-Bus 连接 `org.freedesktop.portal.IBus`，并跳过上述检查。Fcitx5 的 IBus Frontend 提供了这个接口。因此这里使用的是 **Fcitx5 的 IBus 兼容接口**，并没有另行启动一套 IBus 输入法。

### 最终有效的启动脚本

创建 `~/.local/bin/matlab-fcitx`，内容如下：

```bash
#!/usr/bin/env bash

# 只影响 MATLAB，避免 LC_ALL 覆盖单项 locale 设置。
unset LC_ALL
export LANG=zh_CN.UTF-8
export LC_CTYPE=zh_CN.UTF-8

export XMODIFIERS=@im=fcitx
export GTK_IM_MODULE=fcitx
export GDK_BACKEND=x11

# 使用 MATLAB 自带的 IBus 插件连接 Fcitx5。
export QT_IM_MODULE=ibus
export QT_IM_MODULES=ibus
export QT_QPA_PLATFORM=xcb
export IBUS_USE_PORTAL=1

exec "$HOME/.local/opt/MATLAB/R2026b/bin/matlab" \
  -licmode onlinelicensing "$@"
```

给脚本执行权限，然后启动：

```bash
chmod u+x "$HOME/.local/bin/matlab-fcitx"
"$HOME/.local/bin/matlab-fcitx" -desktop
```

需要系统已经生成 `zh_CN.UTF-8` locale，可用 `locale -a` 确认。每次修改启动环境后，应先保存工作并完全退出旧的 MATLAB，再重新启动；已有进程不会自动应用新变量。

在保留前面设置的基础上，最后增加 **`IBUS_USE_PORTAL=1`** 后，本机中文切换与输入恢复正常。这是此次验证有效的关键步骤，而不是通用的“安装 IBus”方案。Fcitx 对自带 Qt 的第三方软件也有相关配置说明，参见 [Using Fcitx 5 on Wayland](https://www.fcitx-im.org/wiki/Using_Fcitx_5_on_Wayland#QT_IM_MODULE)。

## 添加应用菜单入口

创建 `~/.local/share/applications/matlab-r2026b.desktop`。其中 `Exec` 必须填写实际的绝对路径，不能直接写 `$HOME` 或 `~`；下面使用 `/home/你的用户名` 作为占位符：

```ini
[Desktop Entry]
Type=Application
Name=MATLAB R2026b
Exec=/home/你的用户名/.local/bin/matlab-fcitx -desktop
Terminal=false
Categories=Development;Science;Math;
```

目录不存在时先创建：

```bash
mkdir -p "$HOME/.local/bin" "$HOME/.local/share/applications"
```

之后从菜单启动也会经过上述脚本，保留在线授权和输入法修复设置。若直接调用安装目录下的原始 `bin/matlab`，则不会经过这个脚本。
