---
title: "Neovim Config Journey"
description: "My journey of neovim configuration"
date: 2025-05-29
image: "/images/my_neovim_dashboard.png"
category: "Tech"
tags: ["neovim"]
featured: true
---
Hello there, it's *masterj* i been using **nvim** as my main text editor for almost *5* year(since 2020), it's a pretty amazing journey not going to lie.

After went through endless config cycles (using distros like SpaceVim, LazyVim, and copys of other people's config), I decided to make my own and document my config journey on my blog

You can check [My neovim configuration](https://github.com/masterj122517/nvim) and feel free to use it.

--------
## Step One
I used [kickstart.nvim](https://github.com/nvim-lua/kickstart.nvim) as template, due to it's detailed introduction to the configuration of neovim and minimum configuration so that i can easily extend it

Follow the [Document](https://github.com/nvim-lua/kickstart.nvim?tab=readme-ov-file#Install-Kickstart)

```
git clone https://github.com/nvim-lua/kickstart.nvim.git "${XDG_CONFIG_HOME:-$HOME/.config}"/nvim
```

run ```nvim``` in your shell and then all you need to do is wait for the installation

then you can check the `init.lua` and follow to instruction  

Feel free to delete whatever you don't like

But please go through the whole `init.lua`

## Step Two

Make the configuration file modular

*kickstart* tags all configuration files including options, plugins, lsp, etc.  
all you need is just follow the tag and split them into diffrent files

You might want to keep all your files under `~/.config/nvim/lua` and you can load the config file easily using **lazy.nvim**

Here is my example:
```
require 'custom.options'
require 'custom.keymaps'
require 'custom.autocmd'

-- [[ Install `lazy.nvim` plugin manager ]]
--    See `:help lazy.nvim.txt` or https://github.com/folke/lazy.nvim for more info
local lazypath = vim.fn.stdpath 'data' .. '/lazy/lazy.nvim'
if not (vim.uv or vim.loop).fs_stat(lazypath) then
  local lazyrepo = 'https://github.com/folke/lazy.nvim.git'
  local out = vim.fn.system { 'git', 'clone', '--filter=blob:none', '--branch=stable', lazyrepo, lazypath }
  if vim.v.shell_error ~= 0 then
    error('Error cloning lazy.nvim:\n' .. out)
  end
end

---@type vim.Option
local rtp = vim.opt.rtp
rtp:prepend(lazypath)

require('lazy').setup({
  { import = 'custom.plugins' },
}, {
  ui = {
    -- If you are using a Nerd Font: set icons to an empty table which will use the
    -- default lazy.nvim defined Nerd Font icons, otherwise define a unicode icons table
    icons = vim.g.have_nerd_font and {} or {
      cmd = '⌘',
      config = '🛠',
      event = '📅',
      ft = '📂',
      init = '⚙',
      keys = '🗝',
      plugin = '🔌',
      runtime = '💻',
      require = '🌙',
      source = '📄',
      start = '🚀',
      task = '📌',
      lazy = '💤 ',
    },
  },
})
```
i keep my option settings and keymap settings and autocmd separately, So if one of my plugins is broken, my options and keymaps will not be affected.

BTW, you can set those Icons whatever you want(I'm lazy so i just use kickstart's default one)

## Step Three
***TRICKS***

I am influenced by my brother and an internet celebrity named TheCW and used linux and neovim
I learn a quick way to run my code through *TheCW*
```lua
local split = function()
  vim.cmd("set splitbelow")
  vim.cmd("sp")
  vim.cmd("res -5")
end

local compileRun = function()
  local function find_project_root(path)
    if vim.fn.filereadable(path .. "/Makefile") == 1 then
      return path
    end
    local parent = vim.fn.fnamemodify(path, ":h")
    if parent == path then
      return nil
    else
      return find_project_root(parent)
    end
  end

  local function find_first_executable(path)
    local handle = io.popen("find " .. path .. " -type d -name '.*' -prune -o -type f -executable -print -quit")
    local executable = handle:read("*line")
    handle:close()
    return executable
  end

  vim.cmd("w")
  local ft = vim.bo.filetype
  local current_file_dir = vim.fn.expand("%:p:h")
  local project_root = find_project_root(current_file_dir)
  if ft == "cpp" or ft == "c" then
    if project_root then
      split()
      vim.cmd("term cd " .. project_root .. " && make && exit")
      vim.cmd("sleep 500m")
      vim.cmd("bd!")
      local executable = find_first_executable(project_root)
      if executable then
        split()
        vim.cmd("term " .. executable .. " && make -s clean  && exit")
      end
    else
      split()
      if ft == "cpp" then
        vim.cmd("term g++ % -o %< && ./%< && rm %<")
      else
        vim.cmd("term gcc % -o %< && ./%< && rm %<")
      end
    end
  elseif ft == "markdown" then
    vim.cmd(":MarkdownPreviewToggle")
  elseif ft == "javascript" then
    split()
    vim.cmd("term node %")
  elseif ft == "lua" then
    split()
    vim.cmd("term luajit %")
  elseif ft == "tex" then
    vim.cmd(":VimtexCompile")
  elseif ft == "go" then
    split()
    vim.cmd("term go run %")
  elseif ft == "python" then
    split()
    vim.cmd("term python3 %")
  elseif ft == "rust" then
    split()
    vim.cmd("term cargo run %")
  elseif ft == "cs" then
    split()
    vim.cmd("term dotnet run %")
  elseif ft == "java" then 
    split()
    vim.cmd("term javac % && java %:r && rm %:r.class")
  elseif ft == "haskell" then 
    split()
    vim.cmd("term stack run %")
  end
end

vim.keymap.set("n", "com", compileRun, { silent = true })
```

also learned a markdown snippets from *TheCW* 
```lua
vim.cmd([[
        "autocmd Filetype markdown map <leader>w yiWi[<esc>Ea](<esc>pa)
        autocmd Filetype markdown inoremap <buffer> ,f <Esc>/<++><CR>:nohlsearch<CR>"_c4l
        autocmd Filetype markdown inoremap <buffer> <c-e> <Esc>/<++><CR>:nohlsearch<CR>"_c4l
        autocmd Filetype markdown inoremap <buffer> ,w <Esc>/ <++><CR>:nohlsearch<CR>"_c5l<CR>
        autocmd Filetype markdown inoremap <buffer> ,n ---<Enter><Enter>
        autocmd Filetype markdown inoremap <buffer> ,b **** <++><Esc>F*hi
        autocmd Filetype markdown inoremap <buffer> ,s ~~~~ <++><Esc>F~hi
        autocmd Filetype markdown inoremap <buffer> ,i ** <++><Esc>F*i
        autocmd Filetype markdown inoremap <buffer> ,d `` <++><Esc>F`i
        autocmd Filetype markdown inoremap <buffer> ,c ```<Enter><++><Enter>```<Enter><Enter><++><Esc>4kA
        autocmd Filetype markdown inoremap <buffer> ,m - [ ] 
        autocmd Filetype markdown inoremap <buffer> ,p ![](<++>) <++><Esc>F[a
        autocmd Filetype markdown inoremap <buffer> ,a [](<++>) <++><Esc>F[a
        autocmd Filetype markdown inoremap <buffer> ,1 #<Space><Enter><++><Esc>kA
        autocmd Filetype markdown inoremap <buffer> ,2 ##<Space><Enter><++><Esc>kA
        autocmd Filetype markdown inoremap <buffer> ,3 ###<Space><Enter><++><Esc>kA
        autocmd Filetype markdown inoremap <buffer> ,4 ####<Space><Enter><++><Esc>kA
        autocmd Filetype markdown inoremap <buffer> ,l --------<Enter>
        autocmd Filetype markdown inoremap <buffer> ,h <font color=><++></font><Space><++><Esc>F=a
        autocmd Filetype markdown inoremap <buffer> ,u `` <++><Esc>F`i
]])
```
BTW, I'm using this snippets writing this blog :)


I also found a really nice comment plugin by [yaocccc](https://github.com/yaocccc)
You can check it if you like [vim-comment](https://github.com/yaocccc/vim-comment) 

[snacks](https://github.com/folke/snacks.nvim) by [folke](https://github.com/folke) is also a really good plugin and it's really simple to config

The plugins made by [folke](https://github.com/folke) are all really great!!! :)

I still got a lot to recommand but i think that's enough for a blog post, you can check my [neovim config](https://github.com/masterj122517/nvim) to find out more interesting plugins




## The End 
Enjoy the joy of making your own neovim configuration. Explore this endless world

:)
