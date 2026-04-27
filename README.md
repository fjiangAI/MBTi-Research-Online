# MBTI-Research Online

一个面向 AI 研究者与科研团队的 MBTI 风格科研协作测评静态页面。项目不依赖后端服务、数据库或构建工具，可直接部署到 GitHub Pages、静态网站托管平台或任意 HTTP 静态文件服务器。

> 测评结果仅用于科研协作、自我理解和团队沟通参考，不应作为心理诊断、招聘筛选或高风险决策依据。

## 项目简介

MBTI-Research Online 将传统 MBTI 四维度框架改写为更贴近 AI 科研场景的问卷体验。用户完成 93 道 A/B 选择题后，页面会根据内置评分规则生成 16 种科研协作画像之一，并展示对应的科研偏好、协作优势、成长建议、沟通方式和角色建议。

项目完全在浏览器端运行：

- 无需注册、登录或服务端接口
- 无需 Django、Node.js、数据库或构建步骤
- 问卷题目和画像内容以 JSON 文件维护
- 答题进度保存在访问者本机浏览器的 `localStorage`
- 可直接作为静态站点发布

## 功能特性

- 93 道 AI 科研协作场景 A/B 测评题
- 16 种科研协作画像展示
- 四个维度的分数统计与倾向分析
- 分页答题、进度条、上一页/下一页导航
- 当前页清空与全部进度清空
- 结果页包含画像概述、协作优势、成长建议、科研角色建议等内容
- 画像列表支持点击查看类型详情
- 响应式布局，适配桌面端与移动端
- 纯前端实现，便于托管、复制和二次修改

## 技术栈

- HTML5
- CSS3
- Vanilla JavaScript
- JSON 数据文件
- Browser `localStorage`

## 目录结构

```text
.
├── index.html              # 页面入口
├── assets/
│   ├── app.js              # 交互逻辑、数据加载、评分和结果渲染
│   └── styles.css          # 页面样式
├── data/
│   ├── questions.json      # 93 道测评题
│   └── profiles.json       # 16 种科研协作画像
└── README.md
```

## 本地预览

由于页面通过 `fetch()` 加载 `data/questions.json` 和 `data/profiles.json`，建议使用本地静态服务器预览，而不是直接双击打开 `index.html`。

在项目根目录运行：

```bash
python -m http.server 8080
```

然后访问：

```text
http://127.0.0.1:8080/
```

如果你的环境没有 Python，也可以使用任意静态服务器，例如 VS Code Live Server、Nginx、Caddy 或其他静态托管工具。

## 部署

### GitHub Pages

将仓库根目录作为 GitHub Pages 发布目录即可。

常见配置：

1. 将本项目推送到 GitHub 仓库。
2. 打开仓库的 `Settings -> Pages`。
3. 在 `Build and deployment` 中选择 `Deploy from a branch`。
4. 选择目标分支，例如 `main`。
5. 发布目录选择仓库根目录 `/`。
6. 保存后等待 GitHub Pages 完成部署。

### 其他静态托管平台

本项目没有构建产物目录。部署时直接上传整个项目目录，确保以下路径可被访问：

- `index.html`
- `assets/app.js`
- `assets/styles.css`
- `data/questions.json`
- `data/profiles.json`

可部署到 Netlify、Vercel、Cloudflare Pages、OSS 静态网站、Nginx、Apache 等平台。

## 数据与配置

### 修改题目

题目数据位于 `data/questions.json`。每道题包含：

```json
{
  "id": 1,
  "question": "题目内容",
  "optionA": "A 选项",
  "optionB": "B 选项"
}
```

注意事项：

- `id` 需要保持连续且唯一。
- 当前评分规则写在 `assets/app.js` 的 `SCORING_RULES` 中。
- 如果新增、删除或调整题目编号，需要同步更新评分规则和维度总分。

### 修改画像

画像数据位于 `data/profiles.json`。每个 MBTI 类型对应一组科研协作描述，例如：

- `name`：类型名称
- `description`：画像概述
- `strengths`：协作优势
- `growth`：成长建议
- `personality_traits`：科研偏好特点
- `work_style`：研究工作风格
- `interpersonal_relations`：团队协作方式
- `communication_style`：沟通风格
- `career_suggestions`：科研角色建议

页面会根据测评结果中的类型代码读取对应画像。

### 调整评分规则

评分规则位于 `assets/app.js`：

- `SCORING_RULES` 定义哪些题目选 A 或选 B 会计入对应维度。
- `DIMENSIONS` 定义四个维度的名称、左右倾向和总题数。
- `TYPE_ORDER` 定义 16 种画像在页面中的展示顺序。

当前结果由四个维度组合而成：

- `E / I`：能量来源
- `S / N`：信息获取
- `T / F`：决策方式
- `J / P`：生活态度

## 隐私说明

项目不会主动上传用户答案，也没有内置后端接口。答题记录仅保存在用户当前浏览器的 `localStorage` 中。

用户可以通过页面中的“清空进度”功能删除当前浏览器保存的答案。不同设备、不同浏览器或无痕窗口之间不会共享答题进度。

## 浏览器兼容性

建议使用现代浏览器访问：

- Chrome
- Edge
- Firefox
- Safari

浏览器需要支持：

- ES6 JavaScript
- `fetch`
- `localStorage`
- CSS Grid / Flexbox

## 开发说明

本项目没有依赖安装和构建流程。修改后刷新浏览器即可看到效果。

建议开发流程：

1. 启动本地静态服务器。
2. 修改 `data/questions.json`、`data/profiles.json` 或 `assets/app.js`。
3. 在浏览器中完成一次完整答题流程。
4. 检查移动端和桌面端布局。
5. 清空 `localStorage` 后验证首次访问体验。

## 贡献

欢迎围绕以下方向改进：

- 优化题目表述
- 扩展科研画像内容
- 改进评分规则与维度解释
- 增加结果导出或分享能力
- 提升移动端体验与无障碍访问
- 修复文案、样式或交互问题

提交贡献前，请尽量保持项目的纯静态特性，避免引入不必要的服务端依赖或构建复杂度。

## 📄 许可证
本项目采用 MIT 许可证。

## 🙏 致谢
- 感谢原作者张超武及原项目 `zcw576020095/mbti-test` 提供的 Django 项目基础与实现参考
- Django 社区
- Bootstrap 团队
- ReportLab 项目
---
⭐ 如果这个项目对你有帮助，请给它一个星标！