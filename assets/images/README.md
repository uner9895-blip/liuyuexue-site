# 图片资源放置指南

此目录用于存放后续要加入网站的图片资源，例如头像、作品截图、文章封面或社交预览图。

建议：

- 文件名使用英文、数字和短横线，例如 `avatar.jpg`、`project-01.webp`。
- 作品截图可使用 16:9 比例。
- 优先使用体积较小的 `.webp`、`.jpg` 或压缩后的 `.png`。
- HTML 中使用相对路径，例如 `assets/images/project-01.webp`。
- 不要写成 `/assets/images/project-01.webp`，否则 GitHub Pages 子目录部署时可能找不到图片。

示例：

```html
<img src="assets/images/project-01.webp" alt="作品图片说明">
```
