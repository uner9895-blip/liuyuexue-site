# 六月雪个人网页

这是一个适合部署到 GitHub Pages 的静态个人网页项目。项目保留中式水墨、宣纸质感、印章和留白风格，同时使用黛青、朱砂、茶褐、浅金作为克制点缀。

当前个人简介、主要技能、作品、文章、邮箱和社交链接均为“暂定”或“待补充”，方便后续自行替换。

## 项目结构

```text
gereng/
├── index.html
├── about.html
├── projects.html
├── articles.html
├── contact.html
├── 404.html
├── README.md
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    └── images/
        └── README.md
```

## 本地预览

最简单方式：

1. 在文件夹中双击 `index.html`。
2. 使用浏览器打开后，通过顶部导航检查所有页面。

可选方式：

1. 使用 VS Code 打开项目文件夹。
2. 安装并启用 Live Server 插件。
3. 右键 `index.html`，选择 Open with Live Server。

本项目不需要 npm、构建工具、后端或数据库。

## 修改内容

- 首页：修改 `index.html` 中的个人简介、身份摘要与按钮链接。
- 关于页：修改 `about.html` 中的简介、关键词、技能和经历占位。
- 作品页：修改 `projects.html` 中的占位作品卡片。
- 文章页：修改 `articles.html` 中的占位文章卡片。
- 联系页：修改 `contact.html` 中的邮箱、社交链接和联系说明。
- 样式：修改 `assets/css/style.css`。
- 交互：修改 `assets/js/main.js`。

图片可放入 `assets/images/`，在 HTML 中使用类似路径：

```html
<img src="assets/images/example.jpg" alt="图片说明">
```

不要使用 `/assets/...` 这类以 `/` 开头的路径，否则部署到子目录形式的 GitHub Pages 时可能丢失样式或图片。

## GitHub Pages 部署

1. 在 GitHub 创建一个仓库。
2. 将本项目所有文件上传到仓库根目录，确保 `index.html` 位于根目录。
3. 进入仓库的 Settings。
4. 打开 Pages。
5. Source 选择 Deploy from a branch。
6. Branch 选择 `main`，目录选择 `/ (root)`。
7. 保存后等待 GitHub Pages 生成访问地址。

如果仓库名是 `username.github.io`，访问地址通常是：

```text
https://username.github.io/
```

如果仓库名是普通项目名，例如 `gereng`，访问地址通常是：

```text
https://username.github.io/gereng/
```

## 部署前检查清单

- `index.html` 位于仓库根目录。
- `about.html`、`projects.html`、`articles.html`、`contact.html`、`404.html` 都已上传。
- `assets/css/style.css` 和 `assets/js/main.js` 都已上传。
- HTML 中的 CSS、JS、图片路径都不是以 `/` 开头。
- 所有导航链接都能打开。
- 手机端导航可以打开和关闭。
- 未确认的经历、技能、作品、文章、邮箱和社交链接仍保持“暂定”或“待补充”。
- 部署后刷新首页、关于页、作品页、文章页、联系页和 404 页，确认样式没有丢失。
