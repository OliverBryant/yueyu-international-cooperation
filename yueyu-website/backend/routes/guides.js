const express = require('express')
const router = express.Router()
const db = require('../config/database')

// 获取出国指南列表
router.get('/guides', async (req, res) => {
  try {
    const { category } = req.query
    let query = 'SELECT * FROM guides WHERE status = 1'
    let params = []

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    query += ' ORDER BY sort_order ASC, id DESC'

    const [rows] = await db.execute(query, params)

    res.json({
      success: true,
      data: rows
    })

  } catch (error) {
    console.error('获取出国指南错误:', error)
    res.status(500).json({ error: '获取出国指南失败' })
  }
})

// 获取指南详情
router.get('/guides/:id', async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.execute(
      'SELECT * FROM guides WHERE id = ? AND status = 1',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: '指南不存在' })
    }

    res.json({
      success: true,
      data: rows[0]
    })

  } catch (error) {
    console.error('获取指南详情错误:', error)
    res.status(500).json({ error: '获取指南详情失败' })
  }
})

module.exports = router