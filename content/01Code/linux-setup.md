---
title: 初识Linux
draft: true
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: Linux安装及基本配置
published: 2025-01-01
tags:
  - Template
  - Mizuki
category: Technology
---

## Linux的双系统安装
### 引导模式查看
在安装时，ubuntu必须使用与windows相同的引导模式，右键菜单-运行，输msinfo32，查看其中bios模式是否为uefi，
### 磁盘分区格式查看
右键菜单-磁盘管理，找到windows所在的磁盘（一般是c盘所在的磁盘，对应左侧的磁盘0或者磁盘1），右键选择属性-卷，查看磁盘分区格式是否为gpt格式，如果为mbr格式，建议转换为gpt。

这样uefi+gpt的分区格式可以多个系统共享引导分区，同时重装系统时不会影响另一个系统的引导

### 下载ubuntu光盘映像文件
可以使用国内源进行下载自己需要的版本，其中标有server的不带图形桌面的。注意这里下载的是光盘映像文件iso而不是压缩包文件zip。

### 制作ubuntu安装盘
制作安装盘需要一个较大容量的u盘，并且有一定几率损坏。所以为了保险可以使用大厂的u盘，并务必在制作安装盘前备份u盘中的所有文件。

首先下载制作安装盘的所有工具，这里使用ventoy。下载后进行解压到文件夹。插入你所使用的u盘，打开ventoy2disk.exe开始制作启动盘。在设备中可以选择你所插入的u盘。此时注意磁盘格式为mbr，此时需要切换到与win一样的gpt格式，可以点击配置选项-分区类型选择gpt格式。最后确定设备类型与分区类型后进行安装。安装会将磁盘格式化，所以务必提前备份所有资料（再次提醒）。等待安装完成后，u盘名称会变为ventoy。此时将iso文件拷贝进去。

### 关闭bitlocker
右键开始-磁盘管理，如果在分区信息中显示（bitlocker已加密）等字样，此时需要进行此操作。如果需要48位密码可以在win账户的recovery keys进行查看。这里取消加密的操作是搜索栏中搜索设备加密设置，关闭设备加密。然后等待一大会儿直到解密完成。再次进入磁盘管理器进行查看可以发现（bitlocker已加密）字样已经消失。

### 关闭独显直连

### 压缩windows分区
右键开始-磁盘分区，然后挑选一个大空间的分区分给ubuntu，右键压缩卷并输入压缩空间量。如果可用空间与可压缩空间量差距较大，这是因为磁盘中存在大量文件碎片，此时可以使用diskgenius进行分区操作。点击压缩后会出现未分配空间

### bios设置
重启计算机，进入bios启动界面（看到to interrupt normal setup，press enter，后按下enter，接下来按照提示或者上网查bios启动快捷键，进入bios设置。首先关闭secure boot，根据不同的电脑可能在不同的位置，以联想为例，在security菜单中，secure boot选项下进行关闭。部分电脑需要关闭intel rst，即将bios中的sata磁盘管理模式设置为achi即可。最后设置改变引导顺序，直接进入u盘的引导，在startup-boot选项下将对应的u盘引导项拖到第一位。如果没有显示可以换一台电脑或者更换u盘再次尝试。然后点击右下角save and edit进行保存退出。

### u盘启动
重新启动后，可以看到ventoy下的光盘映像文件（当然ventoy盘下面有多个win或者ubuntu版本也是可以的），选择需要安装的版本，按enter确认。选择boot in normal mode，然后选择try or install ubuntu。然后就可以进入ubuntu的安装页面了。如果直接跳回windows，则需要检查bios中的引导顺序，或者更换rufus、imgburn等软件重新制作安装盘。

### 安装ubuntu
首先将语言改为中文简体，然后安装ubuntu，键盘布局保持默认。可以取消ubuntu下载更新选项，然后可以选择为图形或无线硬件，以及其它媒体格式安装第三方软件。然后选择安装类型-其他选项，跳过以ventoy开头的设备，找到空闲且大小与前面分出的差不多大小的分区选择，点击左下角的+，挂载点选择根挂载点。然后为引导其安装位置，找到windows的efi分区，即已装系统显示windows boot manager的分区。点击现在安装。然后进行时区的选择以及用户名、计算机名以及密码的设置即可






## Linux的软件配置

### 备份Backup
这个可以直接使用ubuntu自带的备份或下载timeshift进行系统备份。备份时需要注意是否备份了个人文件，还是仅备份系统文件。

### rime输入法
由于ubuntu 24.04自带的是ibus输入法，所以可以将rime输入法安装在`rime`文件夹下，在下载后，我们会在文件夹中发现这四个文件夹
```
rime/
|_build/

|_luna_pinyin.userdb
|_user.yaml
|_installation.yaml
```
一般的大厂输入法候选词都是横向，我们的rime万象刚开始配置的时候是纵向，可能会感到不习惯。可以在`/home/tianhao/.config/ibus/rime/build/ibus_rime.yaml`中更改成如下配置后重新部署。
```
style:
  cursor_type: insert
  horizontal: true
  inline_preedit: true
  preedit_style: composition
```

### flameshot 
当安装flameshot并进行截图时，会跳出报错`Unable to capture screen`，在于它现在默认使用名为wayland的显示功能，而在 21.04 之前的版本中，Ubuntu 默认使用 xorg 作为其显示服务器。Wayland 默认不支持屏幕共享（至少到现在为止！）。你可以通过以下命令查看所使用的显示服务器。
```bash
echo $XDG_SESSION_TYPE
```
此时，我们可以去更改系统配置将显示服务器更改为xorg(x11)，但是博主这里使用的是快捷键的方法。我们可以在`Settings -> Keyboard -> Custom Shortcuts -> +`，添加以下快捷方式进行使用。
```
Name: Flameshot
Command: sh -c "QT_QPA_PLATFORM=wayland flameshot gui"
Shortcut: Ctrl + 1　(快捷键)
```

### 音乐播放器安装
博主先尝试安装了listen1，但是它在下载AppImage格式文件后单击打开没有反应，于是使用` ./listen1_2.33.0_linux_x86_64.AppImage`查看是否缺失包，出现了如下提示
```bash
dlopen(): error loading libfuse.so.2

AppImages require FUSE to run. 
You might still be able to extract the contents of this AppImage 
if you run it with the --appimage-extract option. 
See 
for more information
```
按照使用如下命令对缺失的包进行安装（在 **Ubuntu (>= 24.04)** 上通过如下命令进行安装）
```bash
sudo add-apt-repository universe
sudo apt install libfuse2t64
```
安装完成后发现还是报沙箱的错误，错误信息如下：
```bash
[33527:1105/213855.071123:FATAL:setuid_sandbox_host.cc(163)] The SUID sandbox helper binary was found, but is not configured correctly. Rather than run without sandboxing I'm aborting now. You need to make sure that /tmp/.mount_listenUrdcN5/chrome-sandbox is owned by root and has mode 4755.
```
查阅后可以通过`./listen1_2.33.0_linux_x86_64.AppImage --no-sandbox`解除沙箱限制，然后可以通过双击运行应用。但是比较遗憾，#1372中提到v2.33.0目前没有办法进行网易云登录。所以博主尝试YesPlayMusic项目，但是出现了#2270中的错误且有封号的风险。接下来博主又找到了AlgerMusic项目，发现其可以完美适配网易云登录。

### fzf安装
