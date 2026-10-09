---
title: Getting Started with Linux
draft: true
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: Installing Linux and completing the basic setup.
published: 2025-01-01
tags:
- Template
- Mizuki
translations:
  zh: /01dev/linux-setup
lang: en-US
---

## Linux's double system installation
### Guide Mode View
When installed, ubuntu must use the same guide mode as windows, right-key menu - running, losing msinfo 32, see if the bios mode is auefi,
### Disk partition format view
Right-key menu-disk management finds the disk where windows are located (usually the disk on the c-disk, corresponding to disk 0 on the left or disk 1), right-key selection of attributes-roll, and a view of whether the disk partition format is in gpt format, and if it is in mbr format, it is recommended that the disk be converted to gpt.

This way the partition format of the eufi+gpt will allow multiple systems to share the guide partitions while re-assembly the system without affecting the direction of another system

### Download ubuntu image files
You can download your own version using a domestic source, marked as a server's non-figured desktop. Note that the download is a CD-ROM image of the file Iso, not a compressed package of fileszip.

### Create ubuntu installation disk
The installation disk is made with a large capacity of u-disk and with a certain probability of damage. So, for insurance purposes, you can use the u-disk from the big factory and must back up all the files in the u-disk before you make the installation disk.

First downloads all tools that make the installation disk, where it is used. Downloads then release to the folder. Inserts the utensils you use, opens the ventoy2disk.exe and starts making the startup disk. You can select the utensils you insert. At this point, note that the disk format is mbr, and then changes to the same gpt format as the bin format, and clicks on configuration options - partition types to select the gpt format. Installs after finalizing the device type and partition type. Installs the disk format, so it is important to backup all information in advance (recall again). When installation is complete, the udisk name becomes vatoy. I'll copy the Iso file.

### Close bitlocker
Right key starts - disk management, and this is required if the words (bitlocker encrypted) are shown in partition information. If you need 48 passwords to view the bin account, the encryption is done by searching the device encryption settings in the search bar and closing the device encryption. Then wait a while until decrypting. Once again, entering the disk manager to see that the words (bitlocker encrypted) are gone.

### Close Sight Line

### Compressed Windows Division
Right key starts -- disk partitions, then selects a large space to separate the fractions to ubuntu, right-click compressed volume and enter compressed space volume. If the difference between available space and compressable space is large, because of the large number of file fragments in disk, then partition operations can be performed using Diskgenius. Clicking on compressed space will result in unallocated space.

### Bios Settings
Starts the computer again, entering the bios startup interface (to interrupt nomal setup, press entry, then press enter, then click the shortcut key to the beos settings, either by hint or by online checkbios. First, turn off the secret Boot, using the different computer locations, for example, the scenity button, which is closed under the scenity menu option. Some computers need to close the intel rst, and set the sata disk management mode in the bios to achi. Finally, set the lead order to change the direction, go straight to the disk, drag the corresponding utup-boot guide into first place under the startup-boot option. If you do not show a computer, or try again, replace the utex. Then click on the lower right corner to save and edit to save.

### u-disk start
Once restarted, you can see the CD-ROM image files on ventoy (and, of course, multiple bins or ubuntu versions are available under the ventoy disk), select the version that needs to be installed, confirm by the inter. Choose the boot in nomal mode, then choose the try or install ubuntu. Then you can access the installation page in ubuntu. If you jump back to the windows, you need to check the lead sequence in the bios or replace the rufus, imgburn, etc.

### Install ubuntu
First, replace the language with Chinese and then install the ubuntu, the keyboard layout remains default. You can cancel the ubuntu download update option, then you can choose to install third-party software for graphic or wireless hardware, and other media formats. Then select the type of installation - other options, skip the partition selection starting with ventoy, find the space and size that is available, click on + at the lower left corner, and mount the point to select the root mount point. Then, to guide its installation, find the bindows efi partition, which is the partition that shows the Windows Boot manager. Then you can choose the time zone and set the user name, the computer name and the password.






## Linux software configuration

### Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup Backup
This allows you to back up the system directly using the ubuntu back-up or download the timeshift. When you back up, you need to be careful whether you have a personal file back up or just a system file back up.

### Rime input method
Since ubuntu 24.04 is self-ported with ibus input method, the rime input method can be installed on`rime`Under folders, after downloading, we will find the four folders in the folders
```
rime/
|_build/

|_luna_pinyin.userdb
|_user.yaml
|_installation.yaml
```
The usual big factory input candidates are horizontal, and our rimeVan was vertical when it was first configured, and may feel uncomfortable.`/home/tianhao/.config/ibus/rime/build/ibus_rime.yaml`Redeployed as follows:
```
style:
  cursor_type: insert
  horizontal: true
  inline_preedit: true
  preedit_style: composition
```

### flameshot 
When you install and screen the flameshot, you jump out of the report.`Unable to capture screen`, which is that it now uses the display function named "wayland" by default, while in the pre-21.04 version Ubuntu uses xorg by default as its display server. Wayland default does not support screen sharing (at least until now!). You can view the display server by using the following command.
```bash
echo $XDG_SESSION_TYPE
```
At this point, we can change the system configuration to show the server to xorg(x11), but the user here uses the shortcut. We can use the shortcut.`Settings -> Keyboard -> Custom Shortcuts -> +`, add the following shortcuts to use.
```
Name: Flameshot
Command: sh -c "QT_QPA_PLATFORM=wayland flameshot gui"
Shortcut: Ctrl + 1　(快捷键)
```

### Music Player Install
The user tried to install listen1 but it clicked on the open after downloading the AppImage file and did not react, so used` ./listen1_2.33.0_linux_x86_64.AppImage`Checking if the package is missing, the following hint appears
```bash
dlopen(): error loading libfuse.so.2

AppImages require FUSE to run. 
You might still be able to extract the contents of this AppImage 
if you run it with the --appimage-extract option. 
See 
for more information
```
Installation of missing packages using the following command (in **Ubuntu (>= 24.04)** Up through the following command)
```bash
sudo add-apt-repository universe
sudo apt install libfuse2t64
```
The error in reporting the sandbox was discovered after the installation and the error was as follows:
```bash
[33527:1105/213855.071123:FATAL:setuid_sandbox_host.cc(163)] The SUID sandbox helper binary was found, but is not configured correctly. Rather than run without sandboxing I'm aborting now. You need to make sure that /tmp/.mount_listenUrdcN5/chrome-sandbox is owned by root and has mode 4755.
```
You can check it out.`./listen1_2.33.0_linux_x86_64.AppImage --no-sandbox`Unlock the sandbox, and then run the application by double-clicking. Unfortunately, #1372 mentions that v2.33.0 is currently not available for web-friendly login. So the user tried the YesPlayMusic project, but there was a risk of error and sealing in #2270. The user found the AlgerMusic project, which was perfectly fit for web-friendly login.

### fzf Install
