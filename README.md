# MasterJ's LostLand

一个以复古终端为入口、以 Markdown 文章为内容的 Astro GitHub Pages 博客。这里记录 AI、工具、哲学与生活相关的思考；站点作者是对 AI 感兴趣的中国大学生。

> 重写说明：站点已从原有展示页重构为终端式导航与可阅读的文章页；保留既有文章和链接，不需要迁移旧的扁平 Markdown 文件。

## 本地开发

先安装依赖，再启动本地开发服务器：

```sh
npm install
npm run dev
```

常用命令：

| 命令 | 用途 |
| --- | --- |
| `npm run dev` | 启动本地开发服务器 |
| `npm run new-post -- <slug> [title]` | 新建一篇文章和它的图片目录 |
| `npm run build` | 在本地生成静态产物到 `dist/`，不会发布网站 |
| `npm run preview` | 预览本地构建产物 |

例如：

```sh
npm run new-post -- notes/my-first-post "一段带引号的标题：\"Hello\""
```

命令会创建：

```text
src/content/blog/notes/my-first-post/
├── index.md
└── images/
```

生成的文章已经包含 `title`、当天日期与明确的 `slug`；后者确保目录中的 `index.md` 仍使用 `/blog/notes/my-first-post`。可选元数据包括 `description`、`category`、`tags`、`image` 和 `featured`。其中 `description` 默认为空字符串，`category` 默认为 `Notes`，`tags` 默认为空数组，`image` 不必填写。

图片请直接复制到文章自己的 `images/` 目录，然后在 Markdown 中使用相对路径：

```markdown
![截图说明](./images/example.jpg)
```

完整的图片约定见 [IMAGES_GUIDE.md](./IMAGES_GUIDE.md)。

## 终端导航

首页是一个可输入命令的终端界面。可用命令为：

- `help`、`ls`、`writings [分类或标签]`
- `projects`、`resume`、`contact`、`about`、`tags`
- `search <关键词>`、`open <文章编号 / slug / 页面>`
- `clear`、`history`

使用键盘 `↑` / `↓` 浏览历史命令，`Tab` 补全，`Ctrl+L` 清屏。文章、标签、搜索和资料页也保留可直接访问的普通网页地址，便于阅读和分享。

## 内容与文件位置

```text
src/pages/index.astro          终端首页
src/scripts/terminal.ts        终端命令与键盘交互
src/content/blog/              Markdown 文章
src/content/pages/             projects、resume、contact 的资料内容
src/content/config.ts          文章和资料页的内容 schema
src/pages/                     /about、/posts、/tags、/search、/blog 等路由
public/images/                 多篇文章共用的静态图片
scripts/new-post.mjs           新建文章命令
```

### 写文章

- 旧文章仍可继续放在 `src/content/blog/<slug>.md`。
- 新文章推荐使用 `npm run new-post -- <slug> [title]` 生成目录结构。
- 文章地址保持为 `/blog/<slug>`；嵌套 slug 也可以使用，例如 `notes/my-first-post`。
- 修改文章、标签或可选元数据后，保存 Markdown 即可在本地开发服务器中查看。

### 修改个人资料

`src/content/pages/projects.md`、`resume.md`、`contact.md` 分别对应项目、简历和联系页面的内容。`/about` 页面由 `src/pages/about.astro` 提供。只填写仓库中已有或自己确认过的资料；本仓库没有可公开的邮箱或真实 CV 文件。

已确认的公开链接：

- GitHub：<https://github.com/masterj122517/>
- X：<https://x.com/MasterJ122517>
- Neovim 配置项目：<https://github.com/masterj122517/nvim>

## 字体

全站（终端、正文、代码块）使用同一套中英文字体组合，字体文件随网站部署，不要求访客安装字体，也不连接外部字体 CDN：

- 英文：[Iosevka Custom](https://github.com/masterj122517/dotfile/blob/macos/iosevka.toml)，版本 34.8.1，Regular / SemiBold / Bold 与对应斜体。你的原始构建配置保存在 `scripts/iosevka.toml`，网页字体在 `public/fonts/iosevka/`。
- 中文：[霞鹜文楷 LXGW WenKai](https://github.com/lxgw/LxgwWenKai/releases/tag/v1.522)，版本 1.522，使用完整的 Regular / Medium 字库，网页字体在 `public/fonts/wenkai/`。
- 字体均使用 WOFF2 格式；SIL Open Font License 随字体保存在各自目录，分发时请保留。

中文字体不按现有文章裁剪，未来写新字也不需要重新生成字体。代价是 Regular / Medium 两个文件合计约 16.2 MiB；浏览器按实际需要的字形和字重加载，下载期间通过 `font-display: swap` 保持文字可读。

如果以后修改英文造型，把 `scripts/iosevka.toml` 作为 Iosevka 源码仓库的 `private-build-plans.toml`，按[官方构建说明](https://github.com/be5invis/Iosevka/blob/v34.8.1/doc/custom-build.md)运行 `npm run build -- woff2::IosevkaCustom --jCmd=2`，再替换网页字体。普通写文章不需要构建字体。

## GitHub Pages 发布

网站地址：**https://masterj122517.github.io/**

本地 `npm run build` 只生成静态文件，不会部署。提交并推送到 `main` 后，`.github/workflows/deploy.yml` 会使用 Node 22、通过 `npm ci` 安装锁定依赖、配置 Pages、构建 Astro、检查 TypeScript，并发布到 GitHub Pages。构建或检查失败时不会发布。

GitHub 仓库的 **Settings → Pages → Build and deployment → Source** 使用 **GitHub Actions**；工作流通过 `GITHUB_TOKEN` 和 OIDC 部署，不需要手动添加部署密钥。也可以在 Actions 页面手动触发 **Deploy to GitHub Pages**。查看对应运行的 `deploy` 作业确认发布结果。
