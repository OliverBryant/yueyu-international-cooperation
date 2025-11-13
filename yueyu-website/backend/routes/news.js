const express = require('express')
const router = express.Router()
const db = require('../config/database')

// 获取新闻资讯列表
router.get('/news', async (req, res) => {
  try {
    const { page = 1, size = 10 } = req.query
    const offset = (page - 1) * size
    const limit = parseInt(size)

    // 获取总数
    const [countResult] = await db.execute(
      'SELECT COUNT(*) as total FROM news WHERE status = 1'
    )
    const total = countResult[0].total

    // 获取数据
    const [rows] = await db.execute(
      `SELECT * FROM news WHERE status = 1 ORDER BY publish_date DESC, id DESC LIMIT ${limit} OFFSET ${offset}`
    )

    res.json({
      success: true,
      data: {
        list: rows,
        pagination: {
          current: parseInt(page),
          size: limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('获取新闻资讯错误:', error)
    res.status(500).json({ error: '获取新闻资讯失败' })
  }
})

// 获取新闻详情
router.get('/news/:id', async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.execute(
      'SELECT * FROM news WHERE id = ? AND status = 1',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: '新闻不存在' })
    }

    res.json({
      success: true,
      data: rows[0]
    })

  } catch (error) {
    console.error('获取新闻详情错误:', error)
    res.status(500).json({ error: '获取新闻详情失败' })
  }
})

module.exports = router