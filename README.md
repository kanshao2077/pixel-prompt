# PixelPrompt

一个复古像素风的提示词管理工具。

你可以把常用提示词收进卡片里，随时搜索、编辑、复制，也可以在底部记一些临时灵感。
<img width="1104" height="742" alt="image" src="https://github.com/user-attachments/assets/6438b98f-3faf-4263-a318-068a2a9a81e9" />


在线访问：
<img width="3078" height="1328" alt="image" src="https://github.com/user-attachments/assets/17a70cef-bc6e-48d1-b33b-15602e85d124" />

https://kanshao2077.github.io/pixel-prompt/

## 它能做什么

- 新建、编辑、删除提示词卡片。
- 搜索已有提示词。
- 一键复制提示词内容。
- 导入和导出 Markdown 备份。
- 记录底部灵感碎片。
- 默认把数据保存在当前浏览器里。

## 注意

GitHub Pages 版本默认按本地浏览器保存来用。

源码里有云同步相关代码，但没有配置 Supabase 环境变量时，云同步不会生效。页面仍然能用，只是数据主要保存在当前浏览器。

换电脑、换浏览器、清理浏览器数据，都可能导致内容丢失。重要提示词要及时导出备份。

## 本地运行

需要先安装 Node.js，建议 20 或以上版本。

```bash
npm install --no-package-lock
npm run dev
```

打开终端里显示的网址，就能在本地预览。

## 打包

```bash
npm run build
```

打包结果会生成在 `dist` 目录。

## 部署到 GitHub Pages

这个仓库已经带了 GitHub Pages 自动部署配置。

以后只要把代码推送到 `main` 分支，GitHub 会自动打包并发布到：

https://kanshao2077.github.io/pixel-prompt/

## 来源

这个项目来自秒哒导出的源码包。

原应用链接：

https://www.miaoda.cn/projects/app-99d5sr16iakh
