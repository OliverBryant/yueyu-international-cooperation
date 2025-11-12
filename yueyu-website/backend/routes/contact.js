const express = require('express')
const { body, validationResult } = require('express-validator')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const db = require('../config/database')

// 联系表单提交限制（1分钟内最多3次）
const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 3,
  message: { error: '提交过于频繁，请稍后重试' },
  standardHeaders: true,
  legacyHeaders: false
})

// 表单验证规则
const contactValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('姓名长度为2-50个字符'),
  body('phone')
    .trim()
    .matches(/^1[3-9]\d{9}$/)
    .withMessage('请输入正确的手机号格式'),
  body('wechat')
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('微信号长度为3-50个字符'),
  body('message')
    .trim()
    .isLength({ min: 100, max: 500 })
    .withMessage('留言内容长度为100-500个字符')
]

// 提交联系表单
router.post('/contact', contactLimiter, contactValidation, async (req, res) => {
  try {
    // 检查验证结果
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '表单验证失败',
        details: errors.array()
      })
    }

    const { name, phone, wechat, message } = req.body
    const ip = req.ip || req.connection.remoteAddress
    const userAgent = req.get('User-Agent') || ''

    // 插入数据库
    const [result] = await db.execute(
      `INSERT INTO contacts (name, phone, wechat, message, ip, user_agent, submit_time) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [name, phone, wechat || null, message, ip, userAgent]
    )

    res.json({
      success: true,
      message: '提交成功！我们会尽快与您联系',
      data: {
        id: result.insertId,
        submit_time: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('联系表单提交错误:', error)
    res.status(500).json({
      error: '提交失败，请稍后重试'
    })
  }
})

module.exports = router