# 网站统计（GoatCounter）

账号只需在 `quartz.config.yaml` 的 `configuration.analytics` 设置一次。当前使用
`tianhao.goatcounter.com`，无需在前端配置 API 密钥。采集由 Quartz 全局资源处理，
侧栏只读取公开 JSON；删除或隐藏侧栏不影响手机端和其他页面的采集。

## 上线前设置

1. 登录 GoatCounter，在 Settings 中勾选 **Allow adding visitor counts on your website** 并保存。
2. 如果后台启用了域名限制，允许 `tianhao.blog` 与 `www.tianhao.blog`。
3. 运行 `npm run build:i18n` 并按原流程部署。代码修改本身不会更新线上网站。
4. 正常访问线上文章，在后台查看是否收到访问；公开计数并非实时更新。

`TOTAL` 显示同一账号的全站计数；本页计数使用规范化 pathname，不含查询参数、
片段及非根路径的末尾斜杠。www/裸域名及 HTTP/HTTPS 共用计数，中英文文章各自
有本页计数，共享全站计数。本地和预览域名不加载采集脚本，只读取线上计数。

官方公开计数最多缓存四小时，默认会话去重规则也不同于不蒜子，因此名称使用
“访问计数”，不再将 `count_unique` 当成额外的 UV。旧不蒜子历史数据不会自动迁移。
尚无路径数据的 404、权限关闭的 403、网络故障都会显示提示及 `—`，不伪造为 0；
重试按钮仅重新读取数字，不记录访问。后台会话/隐私设置保持默认，本次没有更改。

已发布笔记与字数仍在构建时计算：笔记篇数排除关于我文件夹及根目录首页；
正文量仍按汉字、英文单词分别计数，排除代码块、公式及 URL。

文档：[公开计数](https://www.goatcounter.com/help/visitor-counter)、
[JavaScript](https://www.goatcounter.com/help/js)、
[SPA](https://www.goatcounter.com/help/spa)。
