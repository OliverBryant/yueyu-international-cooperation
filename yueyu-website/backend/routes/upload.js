const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const router = express.Router()

// 确保上传目录存在
const uploadDir = path.join(__dirname, '../uploads')
const imageDir = path.join(uploadDir, 'images')

// 创建目录（如果不存在）
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir, { recursive: true })
}

// 配置multer存储
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, imageDir)
  },
  filename: function (req, file, cb) {
    // 生成唯一文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname).toLowerCase()
    cb(null, uniqueSuffix + ext)
  }
})

// 文件过滤器，只允许图片
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('只支持 JPEG、PNG、GIF、WebP 格式的图片'), false)
  }
}

// 配置multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 限制文件大小为5MB
  }
})

// JWT中间件（用于验证管理员权限）
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' })
  }

  const jwt = require('jsonwebtoken')
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '访问令牌无效' })
    }
    req.user = user
    next()
  })
}

// 上传图片接口
router.post('/upload', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' })
    }

    // 构建访问路径
    const imagePath = `/uploads/images/${req.file.filename}`
    
    res.json({
      success: true,
      message: '图片上传成功',
      data: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        path: imagePath,
        fullUrl: `${req.protocol}://${req.get('host')}${imagePath}`
      }
    })

  } catch (error) {
    console.error('图片上传错误:', error)
    res.status(500).json({ error: '图片上传失败' })
  }
})

// 删除图片接口
router.delete('/delete/:filename', authenticateToken, async (req, res) => {
  try {
    const { filename } = req.params
    const filePath = path.join(imageDir, filename)

    // 检查文件是否存在
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      res.json({
        success: true,
        message: '图片删除成功'
      })
    } else {
      res.status(404).json({ error: '图片不存在' })
    }

  } catch (error) {
    console.error('图片删除错误:', error)
    res.status(500).json({ error: '图片删除失败' })
  }
})

// 获取图片列表接口
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const files = fs.readdirSync(imageDir)
    const fileList = files.map(filename => {
      const filePath = path.join(imageDir, filename)
      const stats = fs.statSync(filePath)
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        path: `/uploads/images/${filename}`
      }
    })

    res.json({
      success: true,
      data: fileList
    })

  } catch (error) {
    console.error('获取图片列表错误:', error)
    res.status(500).json({ error: '获取图片列表失败' })
  }
})

module.exports = router