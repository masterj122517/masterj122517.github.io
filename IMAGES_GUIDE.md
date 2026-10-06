# 图片使用指南

图片不需要上传到外部图床。文章图片优先与文章 Markdown 放在一起，提交到仓库后会随 Astro 构建和 GitHub Pages 一起发布。

## 推荐：文章专属图片

新文章通过 `npm run new-post -- <slug> [title]` 创建后，会有自己的图片目录：

```text
src/content/blog/<slug>/
├── index.md
└── images/
    └── setup.png
```

把图片直接复制到该文章的 `images/` 中，并在 `index.md` 里使用相对路径：

```markdown
![配置界面](./images/setup.png)
```

这种方式让 Markdown 和它依赖的图片一起移动、一起删除，也避免不同文章的文件名冲突。

## 共用图片：`public/images/`

只有在多篇文章或页面都要使用同一张图片时，才放到 `public/images/`：

```text
public/images/
└── shared-diagram.png
```

在文章中用站点绝对路径引用：

```markdown
![共用示意图](/images/shared-diagram.png)
```

如果要把共用图片作为文章页顶部的封面，可在 frontmatter 中添加：

```yaml
image: "/images/shared-diagram.png"
```

文章不需要封面图，`image` 是可选字段。仓库中已有文章使用的旧封面链接会继续保留，无需为了这次重写迁移它们。
封面目前使用 `/images/...` 这样的站点路径或完整 URL；文章目录里的照片直接放在 Markdown 正文中用相对路径引用。文章列表不依赖图片。

## 建议

- 照片通常使用 `.jpg` 或 `.webp`；文字较多的截图适合 `.png`。
- 文件名使用小写英文、数字和连字符，例如 `terminal-search.png`。
- 提交前确认图片只放在需要的位置：文章专属图片放文章目录，共用图片放 `public/images/`。
