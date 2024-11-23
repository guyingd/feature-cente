# 功能中心

一个集合多种实用功能的在线工具平台。

## 主要功能

- **Pixiv涩图**: 精选优质二次元插画，支持多种筛选，标签搜索
- **硬件排行**: 全网最新的CPU、GPU和手机处理器性能排行榜
- **AI 助手**: 智能AI助手，为您解答各种问题
- **视频播放**: 精选短视频，随机播放
- **买家秀**: 随机淘宝买家秀图片
- **应用搜索**: 海量应用资源，一键搜索下载

## 安装部署

### 环境要求
- Node.js 18.0.0 或更高版本
- npm 或 yarn 包管理器
- Git

### 本地开发
1. 克隆项目
bash
git clone https://github.com/guyingd/feature-cente.git
cd feature-cente


2. 安装依赖
bash
npm install
或
yarn install
Apply
Copy


3. 启动开发服务器
bash
npm run dev
或
yarn dev

4. 在浏览器中访问 http://localhost:3000

### 生产部署

1. 构建项目
bash
npm run build
或
yarn build


2. 启动生产服务器
bash
npm run start
或
yarn start

### Vercel 部署

1. Fork 本项目到你的 GitHub
2. 在 [Vercel](https://vercel.com) 上注册账号
3. 在 Vercel 中导入你的 GitHub 项目
4. 选择 Next.js 框架预设
5. 部署完成后即可访问

## 项目结构
feature-center/
├── src/
│ ├── app/ # 页面组件
│ │ ├── page.tsx # 首页
│ │ ├── about/ # 关于页面
│ │ └── features/ # 功能页面
│ ├── components/ # 通用组件
│ │ ├── features/ # 功能组件
│ │ ├── ui/ # UI组件
│ │ └── theme/ # 主题相关
│ └── styles/ # 样式文件
├── public/ # 静态资源
├── package.json # 项目配置
└── next.config.js # Next.js 配置


## 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **图标**: Heroicons
- **开发工具**: Cursor AI

## 功能说明

### Pixiv涩图
- 支持标签搜索
- 多种筛选选项
- R18 内容密码访问（需联系作者获取）
- 图片预览和下载

### 硬件排行
- CPU 天梯榜
- GPU 天梯榜
- 手机处理器排行
- 实时更新数据

### AI 助手
- 智能问答
- 上下文理解
- 多轮对话
- 实时响应

### 其他功能
- 视频随机播放
- 买家秀图片
- 应用搜索下载

## API 支持

- Pixiv涩图 API: [Lolicon API](https://api.lolicon.app)
- 其他功能 API: [api.pearktrue.cn](https://api.pearktrue.cn)

## 注意事项

- R18 内容需要密码访问，请联系作者获取密码
- 部分功能依赖外部 API，请确保网络连接正常
- 建议使用最新版本的现代浏览器访问
- 本地开发时如遇到跨域问题，请检查 API 配置

## 更新日志

### v1.0.0 (2024-01)
- 初始版本发布
- 实现基础功能
- 添加文档说明

## 作者

- 孤影
- 邮箱: 2739218253@qq.com

## 贡献

欢迎提交 Issue 和 Pull Request

## 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件