const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { body, validationResult } = require('express-validator')

require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3001

// 安全中间件
app.use(helmet())

// CORS配置
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}))

// 请求限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP在窗口期内最多100个请求
  message: {
    error: '请求过于频繁，请稍后重试'
  }
})
app.use('/api/', limiter)

// 联系表单专用限制
const contactLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 3, // 限制每个IP在1分钟内最多提交3次表单
  message: {
    error: '提交过于频繁，请稍后重试'
  }
})

// 解析JSON
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// 获取客户端IP
app.use((req, res, next) => {
  req.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress
  next()
})

// 数据库连接
const db = require('./config/database')

// 测试数据库连接
db.getConnection((err, connection) => {
  if (err) {
    console.error('数据库连接失败:', err)
    process.exit(1)
  }
  console.log('数据库连接成功')
  connection.release()
})

// 路由
app.use('/api', require('./routes/contact'))
app.use('/api', require('./routes/services'))
app.use('/api', require('./routes/cases'))
app.use('/api', require('./routes/news'))
app.use('/api', require('./routes/guides'))
app.use('/api', require('./routes/partners'))
app.use('/api/admin', require('./routes/admin'))
app.use('/api/admin', require('./routes/admin-content'))

// 静态文件服务（图片上传）
app.use('/uploads', express.static('uploads'))

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({ error: '接口不存在' })
})

// 全局错误处理
app.use((err, req, res, next) => {
  console.error('服务器错误:', err)
  res.status(500).json({ 
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? err.message : '请稍后重试'
  })
})

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`)
})