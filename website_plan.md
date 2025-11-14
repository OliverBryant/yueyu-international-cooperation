# 网站开发计划

## 1. 总体结构
- 首页（参考当前目录下的“原首页”内容以及外部示例风格，外部链接为：https://muban.xiangzhiqifu.cn/exqFrame.jsp?url=%2F%2Ffkxx21.demo.webportal.top%2F%3F_as_r%3Dhttps%3A%2F%2Ffkwz24.yswebportal.cc%2Fsys-col-126%2F%26_as_m%3Dhttp%3A%2F%2Ffkwz01.yswebportal.cc%2Fcol.jsp%3Fid%3D124）。
- 服务项目
- 成功案例
- 新闻资讯
- 出国指南
- 关于我们
- 合作伙伴
- 联系我们（含前端表单）
- 后台管理系统（表单数据管理）

## 2. 各页面主要内容与功能
### 首页
- 主要项目展示（外劳务合作、技能人才派遣、出国培训服务、签证及手续办理、人力资源咨询、境外就业安置）。
- 轮播/英雄区、服务卡片、成功案例预览、新闻预览、出国指南速览、合作伙伴轮播、页脚联系信息。
- 样式与交互参考：使用当前目录下“原首页” HTML 模板作为视觉/布局基础并结合参考站点的交互（菜单高亮、轮播、案例筛选、响应式布局）。

### 服务项目
- 列表页（可按分类、关键词搜索）。
- 每项服务详情页（图文、常见问题、流程说明、CTA：立即咨询）。

### 成功案例
- 案例卡片网格展示，支持按国家/类型筛选（如模板中所示的过滤按钮）。
- 每个案例详情页（图片、项目描述、雇主/成果标签）。

### 新闻资讯
- 新闻列表（支持分页、摘要、发布日期）。
- 新闻详情页（富文本、相关文章推荐、发布日期须以 `YYYY-MM-DD` 格式显示）。

### 出国指南
- 指南集成：分类文章、常见问题、下载资料（如签证清单、培训资料）。

### 关于我们 / 合作伙伴
- 公司简介、资质证书、发展历程、合作伙伴 Logo 列表（灰度 -> 悬停高亮效果）。

### 联系我们
- 联系表单（前端字段与校验）：
    - 姓名（必填，字符串，长度限制：2–50）
    - 电话（必填，数字或中国手机号格式校验）
    - 微信号（选填，字符串，长度限制：3–50）
    - 留言内容（必填，100–500 字）
- 前端行为：
    - 必填项实时校验（失焦/提交时），不满足显示明确提示（中文）。
    - 提交按钮在校验通过并正在请求时禁用并显示 loading。
    - 成功提示与错误提示（使用友好弹窗 / 内联消息）。

### 后台管理系统（Admin）
- 登录鉴权（简单账号/密码，可拓展 JWT/权限分级）。
- 表单数据管理页（主功能）：
    - 表格列：姓名、电话、微信号、留言内容、提交时间（服务器时间）、IP地址。
    - 默认按提交时间倒序显示（最新在上）。
    - 支持对列排序、按字段搜索/筛选（例如按电话模糊、时间区间、是否包含微信号）。
    - 支持分页、每页条数选择（10/25/50/100）。
    - 空值或格式不符显示为 `--`。
    - 支持导出 CSV/Excel、单条/批量删除。
    - 支持查看详情弹窗（显示完整留言、提交头信息、User-Agent、IP 归属简要）。
- 安全：管理页面需登录并使用 HTTPS（部署时配置）。

## 3. 技术建议与架构设计
- 前端：自行选择，页样式默认遵循 Tailwind/Ant Design/Material 规范
- 后端：自行选择
- 数据库：MySQL（表结构示例见 4.1）。
- 接口认证：Admin 使用 session 或 JWT；表单提交接口无需认证，但要做频率/验证码/防刷措施（可选）。
- 表单防护：后端做字段二次校验、长度限制、手机号正则、XSS 过滤、IP 频率限制（如 1 分钟内同 IP 限制提交次数）。
- 日志与审计：记录每次表单提交的 IP、请求时间、User-Agent。
- 部署：推荐 Nginx 反向代理 + pm2（Node）或 Docker Compose（Node + MySQL + Nginx）。

## 4. 数据库与 API 设计（概要）
### 4.1 MySQL 表：`contacts`
- `id` INT AUTO_INCREMENT PRIMARY KEY
- `name` VARCHAR(50) NOT NULL
- `phone` VARCHAR(30) NOT NULL
- `wechat` VARCHAR(50) NULL
- `message` TEXT NOT NULL
- `submit_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
- `ip` VARCHAR(45) NULL
- `user_agent` VARCHAR(255) NULL
- `is_valid` TINYINT(1) DEFAULT 1  -- 可用于标注格式是否校验通过
- 索引：`INDEX (phone)`, `INDEX (submit_time)`

### 4.2 关键后端 API（REST 示例）
- `POST /api/contact` — 提交表单
    - 请求体 JSON：{ name, phone, wechat?, message }
    - 响应：{ success: true/false, message }
    - 后端动作：校验 -> 存库 -> 记录 IP/UA -> 返回状态
- `POST /api/admin/login` — 管理员登录（返回 token/session）
- `GET /api/admin/contacts` — 获取表格数据（支持 query 参数：page, size, sort, order, filters）
- `GET /api/admin/contacts/:id` — 查看单条详情
- `DELETE /api/admin/contacts/:id` — 删除单条
- `POST /api/admin/contacts/export` — 导出（CSV/Excel）

## 5. 前端组件与页面结构（Vue3）
- `App.vue` / 全局样式（使用当前目录下“原首页”的 CSS 作为基础样式模块）。
- 路由：
    - `/` 首页
    - `/services` 服务项目列表
    - `/services/:id` 服务详情
    - `/cases` 成功案例
    - `/news` 新闻列表
    - `/guides` 出国指南
    - `/about` 关于我们
    - `/partners` 合作伙伴
    - `/contact` 联系我们（表单）
    - `/admin` 后台入口（或 `/admin/login`、`/admin/contacts`）
- 关键组件：
    - `Header`（响应式菜单）
    - `BannerCarousel`
    - `ServiceCard`
    - `CaseGrid`（含筛选）
    - `NewsList`
    - `ContactForm`（含前端校验）
    - `AdminTable`（表格、排序、筛选、导出）

## 6. 后端实现细节（Node.js）
- 框架：Express + knex 或 Sequelize（建议使用 knex + SQL 语句更可控）。
- 中间件：body-parser、helmet、安全 headers、cors、rate-limit、express-validator（字段校验）。
- IP 获取：`req.ip` 或通过 `x-forwarded-for`（若有代理）。
- 防护：参数化 SQL、XSS 过滤、CSRF（Admin 端）、验证码或简单防刷。

## 7. 测试与验收
- 单元测试（关键后端校验逻辑）
- 集成测试：表单提交 -> 数据库写入 -> Admin 展示（分页/排序/筛选）
- 手工验收点：
    - 表单前端校验覆盖所有必填约束（姓名/电话/留言长度）
    - 后端二次校验与 IP 记录
    - Admin 表格默认按提交时间倒序显示
    - 导出功能有效且空字段显示为 `--`
    - 响应式页面在常见分辨率下显示良好（PC/tablet/mobile）

## 8. 部署与交付
- 提供 `README.md` 包含：
    - 环境变量说明（DB 连接、JWT 密钥、端口等）
    - 本地启动步骤（前端、后端、数据库迁移）
    - 生产部署建议（Nginx 配置示例、SSL、pm2/Docker Compose）
- 提交物：
    - 前端源码（Vue3）
    - 后端源码（Node.js）
    - DB 初始化脚本 / migration
    - 部署与运维说明文档
    - 简短用户手册（如何使用后台导出/筛选）

---
