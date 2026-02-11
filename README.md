# PWA 支持检测工具

一个专业的前端应用，用于检测当前浏览器对 PWA（渐进式 Web 应用）的支持情况，并提供详细的分析报告和建议。采用 Vue 3 + Vite + TypeScript 技术栈构建，具备实时数据获取、多维度检测等先进功能。

## 🌟 核心特性

### 🔍 **全面PWA功能检测**
- **核心功能检测**：
  - Service Worker（离线缓存）
  - HTTPS 安全环境
  - Web App Manifest（应用安装）
- **高级功能检测**：
  - 推送通知（Push API + Notification API）
  - 离线存储（IndexedDB + Cache API）
  - 设备API（Web Share + Bluetooth）
  - 媒体控制（Media Session + Screen Wake Lock）
  - 性能优化（Web Workers + WebAssembly）
  - 后台同步（Background Sync）

### 📊 **实时兼容性数据**
- **caniuse.com 数据源**：直接从 caniuse 官方仓库获取最新兼容性数据
- **24小时缓存**：智能缓存策略，平衡实时性和性能
- **全球支持率**：基于真实统计数据的支持率计算
- **版本要求**：各浏览器最低版本支持信息

### 🔧 **详细检测方式说明**
每个功能都提供详细的检测方法：
- 使用的 JavaScript API 列表
- 实际检测代码示例
- 检测原理的详细说明
- 注意事项和边界情况

### 📱 **设备信息展示**
- 浏览器类型和版本
- 设备类型识别（移动/桌面）
- 连接方式检测（HTTP/HTTPS）
- 浏览器引擎信息

### 💾 **多格式分享导出**
- **文本报告**：结构化的检测报告，一键复制
- **截图分享**：高质量检测结果截图，支持预览
- **PDF导出**：专业PDF报告，支持中文显示
- **原生分享**：支持系统级分享功能

### 🎨 **现代化UI设计**
- 响应式布局，完美适配移动端和桌面端
- 流畅的动画效果和过渡
- 深色/浅色主题支持
- 无障碍访问优化

## 🛠️ 技术栈

- **前端框架**：Vue 3.5 + Composition API + `<script setup>`
- **构建工具**：Vite 5.4
- **类型系统**：TypeScript 5.6
- **状态管理**：Pinia 3.0
- **UI框架**：Tailwind CSS 3.4
- **图标库**：Lucide Vue Next
- **PWA支持**：vite-plugin-pwa
- **第三方库**：
  - html2canvas（截图功能）
  - jsPDF（PDF导出）

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm 包管理器

### 安装依赖
```bash
pnpm install
```

### 开发模式
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

### 预览生产构建
```bash
pnpm preview
```

## 🎯 使用场景

- **开发者**：测试PWA功能兼容性
- **用户**：了解浏览器PWA支持情况
- **教育**：学习PWA技术特性
- **测试**：验证新浏览器版本功能支持

## 📁 项目结构

```
/workspace/
├── src/
│   ├── components/          # Vue 组件
│   │   ├── dialogs/         # 对话框组件
│   │   ├── DetectionView.vue
│   │   ├── ResultsView.vue
│   │   └── ProgressRing.vue
│   ├── composables/         # 组合式函数
│   │   ├── usePwaDetection.ts
│   │   ├── useCompatData.ts    # 实时兼容性数据
│   │   ├── useScreenshot.ts
│   │   ├── usePdfExport.ts
│   │   └── useShare.ts
│   ├── stores/              # Pinia 状态管理
│   │   ├── detection.ts
│   │   ├── settings.ts
│   │   └── ui.ts
│   ├── data/                # 静态数据
│   │   └── compatibility.ts # 兼容性数据库
│   ├── types/               # TypeScript 类型
│   │   └── index.ts
│   ├── App.vue
│   └── main.ts
├── public/icons/            # PWA 图标资源
├── vite.config.ts           # Vite + PWA 配置
├── tailwind.config.js       # Tailwind 配置
└── package.json
```

## 🌐 浏览器支持

本工具支持所有现代浏览器：
- ✅ Chrome 40+
- ✅ Firefox 44+
- ✅ Safari 11.1+
- ✅ Edge 17+

## 📄 开源协议

MIT License
