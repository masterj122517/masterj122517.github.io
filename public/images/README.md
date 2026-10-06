# 共用静态图片

这个目录只放多篇文章或页面共同使用的图片。Markdown 中使用站点路径：

```markdown
![说明](/images/filename.jpg)
```

单篇文章的图片请与文章一起放在 `src/content/blog/<slug>/images/`，并使用：

```markdown
![说明](./images/filename.jpg)
```

文章不要求封面图；如需使用这里的共用图片作为封面，可在 frontmatter 中填写：

```yaml
image: "/images/filename.jpg"
```

详见仓库根目录的 [IMAGES_GUIDE.md](../../IMAGES_GUIDE.md)。
