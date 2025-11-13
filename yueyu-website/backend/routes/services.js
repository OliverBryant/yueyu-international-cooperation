const express = require('express')
const router = express.Router()
const db = require('../config/database')

// 获取工作项目列表
router.get('/services', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM jobs WHERE status = 1 ORDER BY sort_order ASC, id ASC'
    )

    res.json({
      success: true,
      data: rows
    })

  } catch (error) {
    console.error('获取工作项目错误:', error)
    res.status(500).json({ error: '获取工作项目失败' })
  }
})

// 获取工作项目详情
router.get('/services/:id', async (req, res) => {
  try {
    const { id } = req.params

    const [rows] = await db.execute(
      'SELECT * FROM jobs WHERE id = ? AND status = 1',
      [id]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: '工作项目不存在' })
    }

    res.json({
      success: true,
      data: rows[0]
    })

  } catch (error) {
    console.error('获取工作项目详情错误:', error)
    res.status(500).json({ error: '获取工作项目详情失败' })
  }
})

module.exports = router