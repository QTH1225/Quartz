---
title: Publishing a Blog with Obsidian and Mizuki
draft: false
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: A workflow for publishing a blog with Obsidian and Mizuki.
published: 2025-11-09
tags:
- Mizuki
- Workflow
- Obsidian
translations:
  zh: /01dev/obsidian-mizuki
lang: en-US
---

## The creation of the Mizuki blog
### Environment Configuration
The blog has made a few changes using a mizuki theme template and is working on a new version of the theme.[EdgeOne Pages](https://edgeone.ai/zh/products/pages)The original author's GitHub warehouse is as follows.
[matsuzaka-yuki/Mizuki](https://github.com/matsuzaka-yuki/Mizuki)
I can do that.[ Official file on Mizuki theme](https://docs.mizuki.mysqil.com/guide/intro/)The environment that is needed to get the blog is configured as`Node.js >= 20`，`pnpm >= 9`and`Git`（`Git`For version management. So we need to configure these environments first.

`Node.js`Configure is available[Node.js Network of Officials](https://nodejs.org/zh-cn)Downloads and installs the latest version of Node.js. It is recommended that the LTS version be used. Once installed, the following commands are run in the terminal to see the installed version.
```bash
node -v
npm -v
```
If you can display the version number, then the installation is successful. Then we pass.`npm`Install`pnpm`, run directly in the terminal as follows.
```bash
npm install -g pnpm
```
We can still get through it.`-v`to verify whether the installation is successful, run the following commands in the terminal.
```bash
pnpm -v
```
Git for Version Management can also be used from[GitNet](https://git-scm.com/install/)Install, and use the following command to verify the installation success when it is complete.
```bash
git --version
```
### Local Run
First, we can use Git to clone the project locally and turn the path into a blog directory.
```bash
git clone https://github.com/matsuzaka-yuki/mizuki.git
cd Mizuki
```
And then we're going to install the project here.`pnpm`, run the following commands in the terminal.
```bash
pnpm install
```
Then we can start the development server using the following command.
```bash
pnpm dev
```
So we can get to the local port.`http://localhost:4321`The blog was also published on the blog of the blog, which was re-published by the blog.
### Update of Blog Theme
How should we move the new features to our blog theme when the upstream blog themes are updated? First, we can check the local warehouse’s relationship to the upstream warehouse so that we can get updates from the upstream warehouse.
```bash
git remote -v
```
This is what the audience is showing.`upstream`The display is from the upstream template warehouse so that we can merge the changes in the template into our blog.
```bash
origin  https://github.com/QTH1225/MizukiBlog.git (fetch)
origin  https://github.com/QTH1225/MizukiBlog.git (push)
upstream        https://github.com/matsuzaka-yuki/Mizuki.git (fetch)
upstream        https://github.com/matsuzaka-yuki/Mizuki.git (push)
```
Then get information from the upstream warehouse for viewing.
```bash
git fetch upstream
git branch -r | grep upstream/  # 查看所有上游远程分支
```
Merge after acquiring changes from upstream warehouse
```bash
git fetch upstream        # 确保获取最新更改
git merge upstream/main   # 如果上游分支是 main
# 或者
git merge upstream/master # 如果上游分支是 master
# 或者使用你确认正确的分支名
```
Of course, sometimes upstream changes are not satisfactory to us, when it is possible to retain its own changes (such as various APIs, personal information, etc.) in the context of a merger conflict, which would allow us to avoid the need to reset duplicated information after updating.
## Obsidian's blog management methods
[Obsidian](https://obsidian.md/)It is a very comprehensive notebook management software that can be used for the creation of a knowledge base, journal management and some other functions.[Typora](https://typoraio.cn/)This, not only is Obsidian free of charge, rich in plugin ecology, but also more of the way that notes are managed, which is available for reference.[Pkmer](https://pkmer.net/zh/)The user therefore believes that the ubisdian is more suitable for systematic note management. But here only some configurations and attentions are used in blog management using Obsidian, so the main description is about the configuration and connection of Obsidian for Mizuki blog management, rather than about the use of Obsidian. The effect of the configuration is as follows.
![Blog Editors](https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251109091203104.png)

![Blog Management Base File](https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251109091509419.png)

### Settings under content directory
First of all, we need to know that the management unit of Obsidian is, "**Library**You can create multiple libraries for different kinds of notes. All the blog files in Mizuki are in place.`src/content`Down, so we'll just choose.`content`The folders are our library.
![Repository Selection](https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251109091730892.webp)
When the selection is completed, you can see the list of files on the left side. We will find that Obsidian has all the files on the left side, and we can open any folder for modification at any time.

### Plugin to make Obsidian more intelligent
But the default function of Obsidian often appears to be less intelligent than it can even be called "**Markdown Editor**"and not "**Note management software**We need some plugins to function. The plugins in Obsidian are divided into core plugins and third party plugins, which provide some basic functions (e.g., whiteboards, knowledge profiles), while the third party plugins provide some more advanced functions (e.g. git, LaTeX snippets). These third party plugins are centrally stored at the same level as the warehouse.`.obsidian`folder, you can simply copy the folder to the new repository when you need to move your plugin.

Here are some of the plugins that the user uses, which, because of the number of plugins, only describe the plugins that affect operations and efficiency, except for the glorification plugins and some of the functional plugins.`.gitignore`Add the following rows to the file to ignore`.obsidian`folder, otherwise uploading may fail because you have a key.
```txt
.obsidian
```
1. **`i18n`Plugins**

This plugin can be translated from the English configuration interface for other plugins. So the user first recommends that this plugin be installed to make the other English plugins more tangent. But the plugin is not available on line from Obsidian and PKMER, but only downloads via links. This is the project address for downloading.
[Obsidian-Forge/obsidian-i18n](https://github.com/Obsidian-Forge/obsidian-i18n)

2. **`Templater`Plugins**

This plugin mainly addresses the creation of new blogs`formatter`The problem that was often missing, because Mizuki was optional.`formatter`Many. Some are necessary for building pages, some are optional. This time, the plugin can be used to create a template file under the folder, which will be used as a template for each new file that is created later, without starting from scratch.`formatter`。

The template file of the owner is`Z-Template.md`, because the display order of the custom document in Obsidian is more cumbersome, you can add the top of the document`00`Prefix, file to be decoded at the beginning of the file`99`The prefix. This allows you to keep the top or bottom of the letter in alphabetical order. The document below is a good one.
```markdown
---
title: Template
draft: true
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: Your description Here
published: 2025-01-01
tags:
  - Template
  - Mizuki
lang: zh-CN
---
```

3. **`LaTeX Suite`Plugins**

How to fast-track formulae in notes, I'll have to mention.[Gilles Castel](https://castel.dev/)Big brother, he's configured Vim+Snippets with a terrible input efficiency. But the configuration is more cumbersome and inappropriate for the country's notes, and the plugin addresses the problem of fast input of the LaTeX formula in Markdown, and uses the trigger shortcut to make quick input of the LaTeX formula.<a href="/01dev/latex-snippets">Snippets Settings in LaTeX</a>(i.e.,[Snippets Settings in LaTeX](latex-snippets.md)and[How to use LaTeX Suite for real practice math notes - Experience Sharing - Obsidian Chinese Forum](https://forum-zh.obsidian.md/t/topic/22521). The plugin is able to enter formulas quickly after it is skilled. For example, in the formula below, my actual typed LaTeX formula is as follows, as can be seen from most brackets.`{}`Syntax:`\`They're all mapped to the alphabet area without having to change symbols.
```
	Input:dm sum ooo n=1 1/nsr = pisr/6
	Output:
	$$
	\sum^{\infty}_{n=1} \frac{1}{n^{2}} = \frac{\pi^{2}}{6}
	$$
```
$$
\sum^{\infty}_{n=1} \frac{1}{n^{2}} = \frac{\pi^{2}}{6}
$$
4. **`Git`Plugins**

The plugin addresses the visualization of changes in notes. When one of our documents is half-written, it is found that changes in other documents are needed, or that several of them are changed at the same time. The plugin can well record the changes and the changes, which are very helpful in examining the completeness of the notes before we submit to the blog.

Friends may ask why not to solve the problem of uploading GitHub in notes. We can actually upload the same file directory after opening it in other software and can more easily prepare the submission for our own information (e.g., use it).[git-commit-plugin](https://github.com/RedJue/git-commit-plugin)plugins.
### Base, look at all the notes.
Added more than 1.9.10 of the official Obsidian version`Base`function. The file type can display all the files in the library in Obsidian and it is used to manage all notes. In the latest version of 1.9.14 you can use it in the current version.`.base`The document sets the type of notes you want to see freely, for example, by using a warehouse or a label. But the following adjustments are needed to make Base really the tool to manage the blog.

First of all, because`.base`It's a special format, so we need to be in`.gitignore`The following line should be added so that the document could not be circulated at the time of deployment, otherwise there would be a misreporting.
```txt
*.base
```

And second, because`.base`is a direct reading of the document name under the folder and a jump link. Therefore, we try to use the file formatting in Mizuki documents instead of the folder writing, which is directly in`posts`Create under Directory`md`document, not folder creation. Although the article can be distinguished by the text 's title field, the first column is not enough because it needs to be able to be a jump function. The blog is therefore also using the file, i.e. directly in the field.`posts`Create under Directory`md`Document. Simultaneously, the image hosting is also in the process of being organized; the configuration note "PiclistxGithubimage hosting" is still being processed.
### Windows sync with ios multiend
Now you can update your blog on your computer, but the problem is there. You can't always take your computer, sometimes we're carrying just a cell phone or a tablet, so we can always take notes and record ideas. While Obsidian provides official synchronization, it costs a lot of small partners. We can use it at this point.`Remotely Save`Plugins, synchronized with some web disks, so that we can take notes whenever you want. Of course, you can use the git plugins for each pull and submit, as in vscode, and not to repeat them here.

The user uses OneDrive personal versions to synchronize, connect to the plugin after recognition, and then set the autosync.
![Remotely Save Plugin Settings](https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251109095223967.webp)
Now that we've uploaded our notes to the server, we need to write notes on other devices. And we need to create a relationship.**Synchronize warehouse with same name** . Reset the above step again after downloading the Remotely Save plugin on the new device and select`如果修改超过百分比则终止同步`100% (i.e. remove this protection) because we want to sync all remote files locally. When synchronised, you can set a maximum change limit.
![Maximum Change Limit Settings](https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251109095900044.webp)
The next button on the left is synchronized, so that we can do it later. Of course, you can do it by pulling the Git plug-in. But the user is more used to synchronizing and deploying. This allows for some space for pre-deployment inspection and improvement.

## Blog Message
Finally, it is called "The easy way to play the game, the difficult to keep." Experienced people can deploy seven or eight blogs in a day, but not necessarily find the user of the blog, who tries to continue to write. Rather than build a better blog, it is the idea that each person should think and try.
