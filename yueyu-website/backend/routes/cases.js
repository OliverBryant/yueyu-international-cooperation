const express = require('express')
const router = express.Router()
const db = require('../config/database')

// 获取成功案例列表
router.get('/cases', async (req, res) => {
  try {
    const { country } = req.query
    let query = 'SELECT * FROM cases WHERE status = 1'
    let params = []

    if (country && country !== '全部') {
      query += ' AND country = ?'
      params.push(country)
    }

    query += ' ORDER BY sort_order ASC, id DESC'

    const [rows] = await db.execute(query, params)

    res.json({
      success: true,
      data: rows
    })

  } catch (error) {
    console.error('获取成功案例错误:', error)
    res.status(500).json({ error: '获取成功案例失败' })
  }
})

// 获取案例详情
router.get('/cases/:id', async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.execute(
      'SELECT * FROM cases WHERE id = ? AND status = 1',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: '案例不存在' })
    }

    res.json({
      success: true,
      data: rows[0]
    })

  } catch (error) {
    console.error('获取案例详情错误:', error)
    res.status(500).json({ error: '获取案例详情失败' })
  }
})

module.exports = router