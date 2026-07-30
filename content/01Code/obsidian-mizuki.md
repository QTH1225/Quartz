---
title: Obsidian×Mizuki博客发布流程
draft: false
author: Qin Tianhao
authorLink: https://github.com/QTH1225
description: Obsidian×Mizuki博客发布流程
published: 2025-11-09
tags:
  - Mizuki
  - Workflow
  - Obsidian
category: Tools
---

## Mizuki博客的搭建
### 环境配置
本博客使用基于Mizuki主题模板，进行了少量更改并在[EdgeOne Pages](https://edgeone.ai/zh/products/pages)上进行了部署。原作者的GitHub仓库如下。
[matsuzaka-yuki/Mizuki](https://github.com/matsuzaka-yuki/Mizuki)
可以从[ Mizuki主题官方文档](https://docs.mizuki.mysqil.com/guide/intro/)中获得该博客需要的环境配置为`Node.js >= 20`，`pnpm >= 9`以及`Git`（`Git`用于版本管理）。所以我们首先需要配置这些环境。

`Node.js`配置可以去[Node.js官网](https://nodejs.org/zh-cn)下载并安装最新版本的 Node.js。建议使用 LTS 版本。安装完成后在终端中运行如下命令以查看安装的版本。
```bash
node -v
npm -v
```
如果能够显示版本号，那么即为安装成功。然后，我们通过`npm`安装`pnpm`，直接在终端中运行如下命令即可。
```bash
npm install -g pnpm
```
我们仍然可以通过`-v`来验证是否安装成功，在终端中运行以下命令。
```bash
pnpm -v
```
用于版本管理的Git也可以从[Git官网](https://git-scm.com/install/)安装，安装完成后使用以下命令验证是否安装成功。
```bash
git --version
```
### 本地运行
首先，我们可以使用Git将项目克隆到本地，并将路径转为博客目录。
```bash
git clone https://github.com/matsuzaka-yuki/mizuki.git
cd Mizuki
```
然后，我们在这里安装项目依赖`pnpm`，在终端中运行如下命令。
```bash
pnpm install
```
然后我们可以使用如下命令启动开发服务器。
```bash
pnpm dev
```
这样我们就可以在本地端口`http://localhost:4321`中查看到自己克隆下来的博客了。
### 博客主题的更新
当上游的博客主题更新了新功能后，我们应该如何将这些新功能迁移到我们的博客主题中呢？首先我们可以检查本地仓库与上游仓库的关系，以便我们可以从上游仓库中获取更新信息。
```bash
git remote -v
```
博主这里显示的是这样的，可以看到`upstream`显示的是上游模板仓库，这样我们可以将模板的更改合并到我们的博客中了。
```bash
origin  https://github.com/QTH1225/MizukiBlog.git (fetch)
origin  https://github.com/QTH1225/MizukiBlog.git (push)
upstream        https://github.com/matsuzaka-yuki/Mizuki.git (fetch)
upstream        https://github.com/matsuzaka-yuki/Mizuki.git (push)
```
然后获取上游仓库的信息以供查看
```bash
git fetch upstream
git branch -r | grep upstream/  # 查看所有上游远程分支
```
获取到上游仓库更改后进行合并
```bash
git fetch upstream        # 确保获取最新更改
git merge upstream/main   # 如果上游分支是 main
# 或者
git merge upstream/master # 如果上游分支是 master
# 或者使用你确认正确的分支名
```
当然，有时候上游的更改并不能令我们满意，这时候可以在合并冲突的时候保留自己的更改（例如各类API、个人信息等），这样可以让我们避免在更新后需要重新设置重复的信息。
## Obsidian的博客管理方法
[Obsidian](https://obsidian.md/)是一个非常全面的笔记管理软件，可以用于知识库的建立、日记的管理和一些其他的功能。相比于[Typora](https://typoraio.cn/)这种，Obsidian不仅免费、具有丰富的插件生态，而且具有更多对笔记的管理方法，可以参考[Pkmer](https://pkmer.net/zh/)中对于知识管理的介绍。因此，博主认为obisdian更适合系统的笔记管理。但是这里只讲使用Obsidian进行博客管理的一些配置与注意事项，所以主要介绍Obsidian用于Mizuki博客管理的相关配置与联动，而不是专门介绍Obsidian的使用。配置完成后的效果如下图。
<figure style="text-align: center; margin: 2rem auto; display: flex; flex-direction: column; align-items: center;">
    <img src="https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251109091203104.png" alt="博客编辑区" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
    <figcaption style="color: #666; font-style: italic; margin-top: 1rem; text-align: center; width: 100%;">博客编辑区</figcaption>
</figure>

<figure style="text-align: center; margin: 2rem auto; display: flex; flex-direction: column; align-items: center;">
    <img src="https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251109091509419.png" alt="博客管理base文件" style="max-width: 100%; height: auto; display: block; margin: 0 auto;">
    <figcaption style="color: #666; font-style: italic; margin-top: 1rem; text-align: center; width: 100%;">博客管理base文件</figcaption>
</figure>

### content目录下的设置
首先我们需要知道，Obsidian的管理单位是“**库**”，你可以为不同用途的笔记创建多个库。而Mizuki的所有博客文档都放在`src/content`下，所以我们直接选择`content`文件夹作为我们的库。
<figure style="text-align: center; margin: 2rem auto; display: flex; flex-direction: column; align-items: center;">
    <img src="https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251109091730892.webp" alt="仓库的选择" style="max-width: 80%; height: auto; display: block; margin: 0 auto;">
    <figcaption style="color: #666; font-style: italic; margin-top: 1rem; text-align: center; width: 100%;">仓库的选择</figcaption>
</figure>
选择完成后你就能看到左侧文件列表了。这时候我们会发现，Obsidian将所有文件都列在了左侧，我们可以随时打开任意一个文件夹进行修改。

### 插件，让Obsidian更加智能
但是Obsidian的默认功能往往显得不够智能，甚至只能称作“**Markdown编辑器**”而不是“**笔记管理软件**”，我们需要一些插件才能发挥它的功能。Obsidian中的插件分为核心插件与第三方插件，核心插件主要提供一些基本的功能（例如白板、知识图谱），而第三方插件则提供一些更高级的功能（例如git、LaTeX snippets）。这些第三方插件被统一存放在与仓库同级的`.obsidian`文件夹中，当你需要迁移你的插件时可以直接将该文件夹复制到新仓库中即可。

这里介绍博主常用的一些插件，由于插件较多所以此处仅介绍影响操作和效率的插件，美化插件与部分功能插件不在此列。需要注意的是，当你下载了你所需要的插件后，请在`.gitignore`文件中添加以下行以忽略`.obsidian`文件夹的上传，否则可能由于含有密钥而上传失败。
```txt
.obsidian
```
1. **`i18n`插件**

该插件可以将其他插件的英文配置界面进行翻译。所以博主首先推荐安装这个插件以对其他英文插件进行汉化。但是该插件没有上线Obsidian的插件市场和PKMER的插件市场，只能通过链接进行下载。这里给出项目地址以供下载。
[Obsidian-Forge/obsidian-i18n](https://github.com/Obsidian-Forge/obsidian-i18n)

2. **`Templater`插件**

该插件主要解决创建新博客时`formatter`经常遗漏的问题，因为Mizuki可选的`formatter`很多。有些是构建页面必要的条目而有些是可选的条目。这时候可以使用该插件在文件夹下创建一个模板文件，以后每次新建文件都会以该文件为模板进行生成，而不需要从头开始编写`formatter`。

博主的模板文件是`Z-Template.md`，这是由于在Obsidian中自定义文档的显示顺序比较麻烦，所以可以在你想要置顶的文档开头加上`00`前缀，想置底的文件开头加上`99`前缀。这样在按照字母顺序排列时就可以顺利地置顶或者置底了，文件内容如下。
```markdown
---
title: Template
author: Qin Tianhao
description: Your description Here
published: 2025-01-01
tags:
  - Template
  - Mizuki
category: Technology
draft: true
---
```

3. **`LaTeX Suite`插件**

关于如何在笔记中快速输入公式，那就不得不提[Gilles Castel](https://castel.dev/)大佬，他配置的Vim+Snippets具有恐怖的输入效率。但是配置比较麻烦而且不太适合国人笔记习惯，而该插件主要解决Markdown中LaTeX公式快速输入的问题，通过设置触发快捷键来进行LaTeX公式的快速输入。特别适合用Obsidian做理工科笔记的同学，该插件的配置可以参考<a href="/01code/latex-snippets">LaTeX中的Snippets设置</a>（即[LaTeX中的Snippets设置](/01code/latex-snippets)）以及[如何用LaTeX Suite真正实践数学笔记 - 经验分享 - Obsidian 中文论坛](https://forum-zh.obsidian.md/t/topic/22521)。该插件熟练之后可以很快地输入公式。例如下面的公式，我的实际键入与对应的LaTeX公式如下，可以看到，大部分括号`{}`、语法提示符`\`都被映射到了字母区，而不必不停地切换符号。
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
4. **`Git`插件**

该插件主要解决笔记更改的可视化。当我们某个文件写到一半发现需要改其他文件，或者同时更改了若干文件的若干地方。该插件可以很好地记录更改的文件以及更改的情况，这对于我们提交博客前的审查笔记是否完整是非常有帮助的。

有朋友可能会问为什么不是解决笔记上传GitHub的难题呢？其实我们在其它软件中打开同样的文件目录后也可以进行上传，并且可以更方便地编写提交信息以供自己参考（例如使用[git-commit-plugin](https://github.com/RedJue/git-commit-plugin)插件）。
### Base，统览所有笔记的神
在Obsidian正式版1.9.10版本以上，新增了`Base`功能。该文件类型可以在Obsidian中显示库中所有的文件，起到管理所有笔记的效果。在目前最新的1.9.14版本中你可以在`.base`文件中自由地设置你想查看的笔记类型，例如可以按仓库或者标签显示。但是想要base真正成为obsidian管理博客的工具还需要进行以下调整。

首先，由于`.base`是一类特殊的格式，所以我们需要在`.gitignore`中加入下面一行，这样可以在部署时不上传该文件，否则会出现报错。
```txt
*.base
```

其次，由于`.base`是直接读取文件夹下的文档名称并形成跳转链接的。因此，我们尽量采取Mizuki文档中的文件格式写法，而不是文件夹写法，也就是直接在`posts`目录下创建`md`文档，而不是创建文件夹。如果采用文件夹写法，虽然可以通过文章的title字段区分文章，但是由于需要保留跳转的功能，第一列需要保留一列index，这样不够美观。因此本博客也是采用文件写法，即直接在`posts`目录下创建`md`文件。同时配合图床来实现跳转，图床的配置可以参考<a href="/01code/piclist-github">Piclist×Github图床的搭建</a>（即[Piclist×Github图床的搭建](/01code/piclist-github)）一文。
### Windows与ios系统多端同步
现在你可以在你的电脑上随时更新你的博客了，但是问题也随之而来了。你不可能随时带着你的电脑，有时候我们携带的只是手机或者平板，那么能否保持笔记的多端同步呢。这样我们随时都可以写笔记并把想法记录下来。虽然Obsidian提供了官方的同步服务，但是其高昂的价格让很多小伙伴望而却步。这时候我们可以使用`Remotely Save`插件，配合一些网盘进行同步操作，这样我们就可以随时随地写笔记了。当然，你也可以使用git插件每次进行拉取与提交，与vscode中的方式相同，这里不再赘述。

博主这里使用的是OneDrive个人版进行同步，在插件中鉴权后进行连接，然后设置自动同步即可。
<figure style="text-align: center; margin: 2rem auto; display: flex; flex-direction: column; align-items: center;">
    <img src="https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251109095223967.webp" alt="Remotely Save 插件设置" style="max-width: 80%; height: auto; display: block; margin: 0 auto;">
    <figcaption style="color: #666; font-style: italic; margin-top: 1rem; text-align: center; width: 100%;">Remotely Save 插件设置</figcaption>
</figure>
现在我们已经把笔记上传到服务端了，现在我们需要在其他设备上写笔记了。这时候我们需要创建一个与**同步仓库同名的仓库** 。在新设备上下载Remotely Save插件后再次按照上述步骤重新设置一遍，然后选择`如果修改超过百分比则终止同步`为100%（即去除此保护），因为我们要将远端的所有文件同步到本地。同步完成后可以设置一个最大更改限制。
<figure style="text-align: center; margin: 2rem auto; display: flex; flex-direction: column; align-items: center;">
    <img src="https://cdn.jsdelivr.net/gh/QTH1225/Blog_Figures/img/20251109095900044.webp" alt="最大修改限制设置" style="max-width: 80%; height: auto; display: block; margin: 0 auto;">
    <figcaption style="color: #666; font-style: italic; margin-top: 1rem; text-align: center; width: 100%;">最大修改限制设置</figcaption>
</figure>
接下来点击左侧的同步按钮进行同步即可，静待一会就可以同步完了。当然，你也可以通过Git插件的拉取上传来进行同步。不过博主这里更加习惯同步与部署功能分离。这样可以在部署前有一定检查与完善的空间。

## 博客寄语
最后，正所谓“打江山容易，守江山难”。有经验的人可以在一天之内部署七八个博客，但是七八百人中也不一定能找到一个尝试持续写博客的博主。相比于如何搭建更加漂亮的博客，如何尝试持续性地产出自己的想法、自己的感悟才是每一个博主应该思考与尝试的。当然，我也不例外。
