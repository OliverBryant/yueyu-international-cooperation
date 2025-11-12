const express = require('express')
const router = express.Router()
const db = require('../config/database')

// 获取合作伙伴列表
router.get('/partners', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM partners WHERE status = 1 ORDER BY sort_order ASC, id ASC'
    )

    res.json({
      success: true,
      data: rows
    })

  } catch (error) {
    console.error('获取合作伙伴错误:', error)
    res.status(500).json({ error: '获取合作伙伴失败' })
  }
})

module.exports = router