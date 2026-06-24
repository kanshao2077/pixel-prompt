# 🎮 PixelPrompt

把常用提示词收进像素卡片里。

PixelPrompt 是一个复古像素风的提示词管理工具，用来解决提示词散落在聊天记录、备忘录、文档和临时草稿里的问题。常用 Prompt 可以做成卡片，随时搜索、编辑、复制；临时想法也能先丢到底部灵感区。

在线体验：

https://kanshao2077.github.io/pixel-prompt/

<p align="center">
  <img width="552" height="371" alt="image" src="https://github.com/user-attachments/assets/6438b98f-3faf-4263-a318-068a2a9a81e9" />
</p>

<p align="center">
  <img width="3078" height="1328" alt="image" src="https://github.com/user-attachments/assets/17a70cef-bc6e-48d1-b33b-15602e85d124" />
</p>

## 🤯 为什么做它

提示词用多了，真正麻烦的不是写，而是找不到、改乱了、复制错了。

- ❌ 常用提示词散在不同聊天窗口里，用的时候还要翻记录。
- ❌ 同一个 Prompt 改了好几版，最后不知道哪版最好用。
- ❌ 临时灵感先记在别处，过几天就忘了放在哪里。
- ❌ 想在办公环境里快速用，但不想依赖复杂账号、后端和云端编辑器。

PixelPrompt 的思路很简单：把 Prompt 当成卡片管理。能搜索，能复制，能备份，能随手记。

## 🎯 它适合什么场景

- 管理常用 AI 提示词、角色设定、工作流模板。
- 给写作、设计、代码、运营等不同场景存放固定 Prompt。
- 把灵感碎片先收起来，之后再整理成正式卡片。
- 需要一个打开就能用的本地 Prompt 仓库。
- 想用 Markdown 做备份，方便迁移和恢复。

## 💡 核心功能

- ✅ 提示词卡片：新建、编辑、删除常用 Prompt。
- ✅ 快速搜索：按标题、描述和内容查找已有提示词。
- ✅ 一键复制：点击卡片或按钮即可复制 Prompt 内容。
- ✅ 拖拽排序：按自己的使用习惯重排卡片。
- ✅ Markdown 备份：支持导入和导出 Markdown 文本。
- ✅ 灵感碎片：底部 Memo 区可以暂存临时想法。
- ✅ 本地保存：默认把数据保存在当前浏览器里。

## ⚙️ 使用方式

1. 打开在线地址。
2. 点击右上角 `+` 新建提示词卡片。
3. 单击卡片复制内容，双击卡片展开编辑。
4. 用搜索按钮快速筛选已有卡片。
5. 用导入/导出功能做 Markdown 备份。

## 💾 数据说明

GitHub Pages 版本默认按本地浏览器保存来用。

源码里有云同步相关代码，但没有配置 Supabase 环境变量时，云同步不会生效。页面仍然能用，只是数据主要保存在当前浏览器。

换电脑、换浏览器、清理浏览器数据，都可能导致内容丢失。重要提示词请及时导出 Markdown 备份。

这个设计的重点不是做一个重型知识库，而是做一个轻量、直接、可迁移的 Prompt 卡片盒。

## 🛠️ 本地运行

需要先安装 Node.js，建议 20 或以上版本。

```bash
npm install --no-package-lock
npm run dev
```

打开终端里显示的网址，就能在本地预览。

## 📦 打包

```bash
npm run build
```

打包结果会生成在 `dist` 目录。

## 🚀 部署到 GitHub Pages

这个仓库已经带了 GitHub Pages 自动部署配置。

只要把代码推送到 `main` 分支，GitHub 会自动打包并发布到：

https://kanshao2077.github.io/pixel-prompt/

## 🧩 来源

这个项目来自秒哒导出的源码包。

原应用链接：

https://www.miaoda.cn/projects/app-99d5sr16iakh
