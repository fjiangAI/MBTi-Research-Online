# MBTI-Research Online

MBTI-Research Online is a static, browser-only assessment page for AI researchers and research teams. It adapts the MBTI-style four-dimension framework into research collaboration scenarios, then generates a research personality profile for self-reflection and team communication.

MBTI-Research Online 是一个面向 AI 研究者与科研团队的静态测评页面。它将 MBTI 风格的四维度框架改写为科研协作场景，用于生成科研协作画像，帮助个人和团队讨论研究偏好、协作方式与项目推进风格。

> The result is for self-understanding and research collaboration only. It is not a psychological diagnosis, hiring standard, or high-stakes decision tool.
>
> 测评结果仅供自我理解、科研协作和团队沟通参考，不应用作心理诊断、招聘筛选或高风险决策依据。

## Project Vision / 项目出发点

AI research is rarely a single linear task. A real research workflow often includes topic selection, paper reading, reproduction, experiment design, debugging, writing, review response, team discussion, and delivery. Different researchers naturally prefer different ways of working.

This project provides a lightweight shared language for those differences:

- How do I generate energy in research collaboration?
- Do I start from concrete evidence or abstract possibilities?
- Do I make decisions through logic-first analysis or people-aware judgment?
- Do I prefer planned progress or adaptive exploration?

AI 科研通常不是单人完成的线性任务，而是由选题、阅读、复现、实验、调试、写作、审稿回应和团队讨论共同组成的协作过程。本项目希望提供一种轻量的共同语言，让团队能够讨论：

- 我更适合怎样推进研究？
- 我需要怎样的反馈与协作环境？
- 我在压力下更可能如何工作？
- 我在团队里更适合承担什么类型的科研角色？

## What It Includes / 项目内容

- A static landing and assessment page with the title `MBTI-Research 科研协作测评`
- A simple `MR` visual mark used as the project logo
- 93 A/B questions based on AI research collaboration scenarios
- 16 research collaboration profiles
- Four-dimension scoring and profile generation
- Progress saving through browser `localStorage`
- Partial-result generation at any answering progress
- A modal-style share card generated from URL parameters
- No backend, no database, no login, no build step

中文概览：

- 页面标题为 `MBTI-Research 科研协作测评`
- 使用 `MR` 作为项目视觉标识
- 内置 93 道 AI 科研协作场景 A/B 题
- 内置 16 种科研协作画像
- 支持四维度计分与画像生成
- 使用浏览器 `localStorage` 保存答题进度
- 支持任意答题进度下查看临时结果
- 支持通过 URL 打开弹窗式分享卡片
- 无后端、无数据库、无登录、无构建流程

## Quick Start / 快速开始

Because the page loads JSON files through `fetch()`, preview it through a local static server instead of opening `index.html` directly.

由于页面通过 `fetch()` 读取 JSON 数据文件，建议使用本地静态服务器预览，不建议直接双击打开 `index.html`。

```bash
python -m http.server 8080
```

Then open:

```text
http://127.0.0.1:8080/
```

No dependency installation is required.

无需安装依赖。

## Repository Structure / 目录结构

```text
.
├── index.html
├── assets/
│   ├── app.js
│   └── styles.css
├── data/
│   ├── questions.json
│   └── profiles.json
└── README.md
```

File responsibilities:

- `index.html`: page structure, introduction, assessment container, profile list
- `assets/app.js`: data loading, answer state, scoring, result rendering, share modal generation
- `assets/styles.css`: visual system, responsive layout, cards, buttons, result page and share modal styles
- `data/questions.json`: assessment questions
- `data/profiles.json`: 16 research collaboration profiles

文件职责：

- `index.html`：页面结构、项目介绍、测评区域、画像列表
- `assets/app.js`：数据加载、答题状态、评分、结果渲染、分享弹窗生成
- `assets/styles.css`：视觉样式、响应式布局、卡片、按钮、结果页和分享弹窗样式
- `data/questions.json`：测评题目
- `data/profiles.json`：16 种科研协作画像

## Deployment / 部署

This project can be deployed as a plain static site. The repository root can be used directly as the publish directory.

本项目是纯静态页面，可以直接将仓库根目录作为发布目录。

### GitHub Pages

1. Push this project to a GitHub repository.
2. Open `Settings -> Pages`.
3. Select `Deploy from a branch`.
4. Choose the target branch, for example `main`.
5. Choose `/` as the publish directory.
6. Save and wait for GitHub Pages to publish the site.

### Other Static Hosting

You can also deploy it to Netlify, Vercel, Cloudflare Pages, Nginx, Apache, object storage static hosting, or any HTTP static file server.

Make sure these files remain accessible:

- `index.html`
- `assets/app.js`
- `assets/styles.css`
- `data/questions.json`
- `data/profiles.json`

## Data Model / 数据说明

### Questions / 题目

Questions are stored in `data/questions.json`.

```json
{
  "id": 1,
  "question": "Question text",
  "optionA": "Option A",
  "optionB": "Option B"
}
```

If you add, remove, or reorder questions, update the scoring rules in `assets/app.js` at the same time.

如果新增、删除或调整题目编号，需要同步更新 `assets/app.js` 中的评分规则。

### Profiles / 画像

Profiles are stored in `data/profiles.json`. Each MBTI code maps to one research collaboration profile.

Common fields include:

- `name`
- `description`
- `strengths`
- `growth`
- `personality_traits`
- `work_style`
- `interpersonal_relations`
- `communication_style`
- `stress_management`
- `learning_style`
- `career_suggestions`

画像数据位于 `data/profiles.json`，每个 MBTI 类型代码对应一种科研协作画像。

### Scoring / 评分

Scoring rules are defined in `assets/app.js`.

- `SCORING_RULES`: maps question IDs and answer directions to dimensions
- `DIMENSIONS`: defines the four dimensions and their labels
- `TYPE_ORDER`: controls the display order of the 16 profiles

Current dimensions:

- `E / I`: energy source
- `S / N`: information gathering
- `T / F`: decision style
- `J / P`: work attitude and planning style

当前维度：

- `E / I`：能量来源
- `S / N`：信息获取
- `T / F`：决策方式
- `J / P`：工作态度与计划风格

## Privacy / 隐私说明

The app does not upload answers. It has no backend endpoint. Answers are saved only in the visitor's current browser through `localStorage`.

Sharing a result link opens a modal-style share card. It only shares the final type, completion count, and profile description. It does not share the detailed answer record.

项目不会上传用户答案，也没有后端接口。答题记录只保存在当前浏览器的 `localStorage` 中。

分享链接会打开弹窗式分享卡片，只会分享类型、完成题数和画像描述，不会分享具体答题记录。

## Contribution Guide / 贡献方向

The most valuable contributions are content quality and assessment quality. Recommended areas:

- Improve question wording and reduce ambiguity
- Improve the mapping between questions and dimensions
- Expand or refine the 16 research collaboration profiles
- Add better explanations for partial results and confidence
- Improve accessibility and mobile layout
- Add export, image card, or richer modal sharing support
- Add tests or validation scripts for JSON schema and scoring consistency

最主要的贡献方向是题目质量、画像质量和评分规则质量：

- 优化题目表述，减少歧义
- 改进题目与维度的映射关系
- 扩展或打磨 16 种科研协作画像
- 改进临时结果与可靠性提示
- 提升无障碍访问和移动端体验
- 增加结果导出、图片卡片或更完整的弹窗分享能力
- 增加 JSON 结构和评分一致性的校验脚本

Please keep the project lightweight and static-first. Avoid introducing backend services or build complexity unless there is a clear reason.

请尽量保持项目轻量、静态优先。除非有明确必要，避免引入后端服务或复杂构建流程。

## License / 许可证

This project uses the MIT License.

本项目采用 MIT 许可证。

## Acknowledgements / 致谢

- Thanks to the original author Zhang Chaowu and the original project `zcw576020095/mbti-test` for the Django project foundation and implementation reference.
- Thanks to the open-source ecosystem that makes lightweight static publishing easy.

感谢原作者张超武及原项目 `zcw576020095/mbti-test` 提供的 Django 项目基础与实现参考。也感谢开源生态让轻量静态发布变得简单。
