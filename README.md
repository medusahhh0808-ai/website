# 建筑设计灵感库 · Architectural Inspiration Vault

基于 **React 18 + Vite 6** 构建的现代化建筑空间设计灵感库。采用 Apple 极简科技美学设计，支持 1700px 宽幅大屏沉浸式体验、全屏首屏 HERO、响应式瀑布流展示、高精度原图详情弹窗以及 AI 多模态五维空间特征智能筛选。

---

## ✨ 核心特性

1. **全屏首页 HERO**
   - 包含主标题 **“让建筑灵感 时刻被看见”**
   - 沉浸式空间微网格与柔和环境光晕
   - 关键指标大盘统计与向下滚动引导锚点
   - 常驻吸顶磨砂玻璃（Frosted Glass）导航栏，集成平台分段器与全局搜索

2. **AI 五维智能下拉筛选区**
   - **空间类型** (`space_type`): 文化建筑、商业建筑、景观空间、建筑模型、室内空间等
   - **设计风格** (`design_style`): 现代主义、极简主义、自然主义、参数化设计等
   - **材质元素** (`materials`): 玻璃、混凝土、金属、绿植、木饰面、石材等
   - **色调氛围** (`color_tone`): 柔和自然、低饱和、冷色调、明亮通透、暖色系等
   - **场景用途** (`scene_usage`): 方案参考、城市设计、文旅场景、概念方案等
   - 下拉选项实时显示收录素材数量（如 `文化建筑 (43)`），支持组合筛选、激活条件气泡展示与一键清空

3. **响应式瀑布流画廊**
   - 针对 **PC 端 1700px 版心** 深度优化，大屏展示 4~5 列均衡瀑布流
   - 宽高比自适应排版，杜绝加载跳动
   - 悬停浮层、快捷星标收藏、来源平台徽标（Pinterest / 小红书）

4. **Apple 极简风格图片详情大卡片**
   - **左侧高精度原图视口**：支持点击缩放查看局部构造细节，显示分辨率与文件名称
   - **右侧档案体系**：AI 空间形态与立面解析、五维结构化标签、创作者信息、点赞与收藏指标
   - **设计笔记复制**：一键复制原爬取笔记与提示词
   - **快捷操作**：支持键盘 `Esc`（关闭）、`←`/`→`（前后翻页）、原网页安全直达跳转

5. **本地离线收藏系统**
   - 基于 `localStorage` 持久化，刷新或离线后收藏数据不丢失

---

## 🛠️ 本地运行与开发

本目录（`website`）为标准独立前端工程，请确保已安装 Node.js（推荐 v18+ 或 v20+）：

```bash
# 进入 website 目录
cd website

# 启动本地开发服务器 (默认端口 http://localhost:5173)
npm run dev

# 打包生产构建文件 (输出至 dist 目录)
npm run build

# 本地预览打包产物
npm run preview
```

---

## 🚀 同步至 GitHub 并通过 Cloudflare Pages 发布上线

你可以非常轻松地将此目录同步到 GitHub 仓库，并通过 Cloudflare Pages 免费且高速地全球分发上线。

### 第一步：初始化并推送到 GitHub 仓库

1. 在 [GitHub](https://github.com/new) 上创建一个新的公共或私有仓库，例如 `architectural-inspiration-vault`。
2. 在本地终端进入 `website` 目录执行以下命令：

```bash
cd "website"

# 1. 初始化 Git
git init

# 2. 暂存所有文件并提交
git add .
git commit -m "feat: initial commit for architectural inspiration vault"

# 3. 关联你的远程仓库 (将 YOUR_USERNAME 替换为你的 GitHub 用户名)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/architectural-inspiration-vault.git

# 4. 推送到远程
git push -u origin main
```

### 第二步：在 Cloudflare Pages 上一键发布

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)。
2. 在左侧菜单点击 **Workers 和 Pages (Workers & Pages)** -> **创建应用程序 (Create Application)** -> 选择 **Pages** 选项卡。
3. 点击 **连接到 Git (Connect to Git)** 并授权绑定你的 GitHub 账号。
4. 选择刚刚创建的仓库 `architectural-inspiration-vault`，点击 **开始设置 (Begin setup)**。
5. 在构建设置中填入如下配置：
   - **项目名称 (Project name)**: 自定义（例如 `architectural-vault`）
   - **生产分支 (Production branch)**: `main`
   - **框架预设 (Framework preset)**: 选择 `Vite`
   - **构建命令 (Build command)**: `npm run build`
   - **构建输出目录 (Build output directory)**: `dist`
   - **根目录 (Root directory)**: 留空（默认根目录）
6. 点击 **保存并部署 (Save and Deploy)**。
7. 等待约 1 分钟，Cloudflare 即会自动完成构建并为你分配一个全局 CDN 加速的 `*.pages.dev` 访问域名！
