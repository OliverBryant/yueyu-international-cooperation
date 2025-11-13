const express = require('express')
const { body, validationResult } = require('express-validator')
const rateLimit = require('express-rate-limit')
const router = express.Router()
const db = require('../config/database')
const axios = require('axios')

// IP地理位置转换函数
const getIpLocation = async (ip) => {
  try {
    // 过滤内网IP和本地IP，返回公司所在地
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || 
        ip.startsWith('10.') || ip.startsWith('172.')) {
      return '山东省 青岛市'
    }

    // 使用高德地图IP定位API（免费）
    const response = await axios.get('https://restapi.amap.com/v3/ip', {
      params: {
        key: '30fd6c74d4d53149e32ec858e245c2b9', // 使用相同的API密钥
        ip: ip
      },
      timeout: 3000
    })

    if (response.data.status === '1' && response.data.province) {
      const { province, city } = response.data
      // 如果省市相同，只显示省级
      return province === city ? province : `${province} ${city}`
    } else {
      return '山东省 青岛市'
    }
  } catch (error) {
    console.log('IP定位失败:', error.message)
    return '山东省 青岛市'
  }
}

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
    .matches(/^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/)
    .withMessage('请输入正确的中国大陆手机号'),
  body('wechat')
    .optional({ checkFalsy: true })
    .trim()
    .custom((value) => {
      if (value && (value.length < 3 || value.length > 50)) {
        throw new Error('微信号长度为3-50个字符')
      }
      return true
    }),
  body('message')
    .trim()
    .isLength({ min: 0, max: 500 })
    .withMessage('留言内容不能超过500个字符')
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