#!/bin/bash

# 青岛悦途网站部署脚本

echo "🚀 开始部署青岛悦途国际网站..."

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js 16+"
    exit 1
fi

# 检查 MySQL
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL 未安装，请先安装 MySQL 8.0+"
    exit 1
fi

echo "📦 安装后端依赖..."
cd backend
npm install

echo "🔧 配置环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "⚠️  请编辑 backend/.env 文件，配置数据库连接信息"
fi

echo "🗄️ 初始化数据库..."
read -p "请输入MySQL root密码: " -s mysql_password
mysql -u root -p"$mysql_password" < ../database/init.sql

echo "🔧 安装前端依赖..."
cd ../frontend
npm install

echo "🏗️ 构建前端..."
npm run build

echo "✅ 部署完成！"
echo ""
echo "📋 启动说明："
echo "1. 启动后端服务: cd backend && npm run dev"
echo "2. 前端文件已构建到 dist/ 目录"
echo "3. 管理后台登录: admin/admin123"
echo ""
echo "🔗 访问地址："
echo "- 前台: http://localhost:3000"
echo "- 后台: http://localhost:3000/admin/login"
echo "- API: http://localhost:5000"