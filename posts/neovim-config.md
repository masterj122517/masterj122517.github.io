---
title: 我的 Neovim 配置分享
date: 2024-03-19
tags: [Neovim, 配置, 编辑器]
---

# 我的 Neovim 配置分享

作为一个 Neovim 爱好者，我想分享一下我的 Neovim 配置。这个配置主要针对 C/C++ 开发，同时也支持其他常用功能。

## 主要插件

以下是我使用的一些核心插件：

- `nvim-treesitter`: 语法高亮
- `nvim-lspconfig`: LSP 支持
- `nvim-cmp`: 代码补全
- `telescope.nvim`: 文件搜索
- `lualine.nvim`: 状态栏

## 配置示例

```lua
-- 基本设置
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.expandtab = true
vim.opt.shiftwidth = 4
vim.opt.tabstop = 4

-- 主题设置
vim.cmd('colorscheme tokyonight')
```

## 使用技巧

1. 使用 `gd` 跳转到定义
2. 使用 `gr` 查看引用
3. 使用 `K` 查看文档
4. 使用 `<leader>ff` 搜索文件

## 为什么选择 Neovim？

Neovim 的优势在于：

- 高度可定制
- 性能优秀
- 丰富的插件生态
- 强大的社区支持

## 未来计划

计划添加的功能：

- 更好的调试支持
- 更多的代码片段
- 自定义快捷键
- 主题切换

*持续更新中...* 