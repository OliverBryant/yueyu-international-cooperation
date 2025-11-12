const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const db = require('../config/database')
const authenticateToken = require('../middleware/auth')

// 获取成功案例列表
router.get('/cases', authenticateToken, async (req, res) => {
  try {
    const { page = 1, size = 10, search = '', country = '' } = req.query
    const offset = (page - 1) * size
    const limit = parseInt(size)

    let whereConditions = ['status = 1']
    let params = []

    if (search) {
      whereConditions.push('(title LIKE ? OR description LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    if (country) {
      whereConditions.push('country = ?')
      params.push(country)
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`

    // 获取总数
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM cases ${whereClause}`,
      params
    )
    const total = countResult[0].total

    // 获取数据
    const [rows] = await db.execute(
      `SELECT * FROM cases ${whereClause}
       ORDER BY sort_order ASC, id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
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
    console.error('获取成功案例错误:', error)
    res.status(500).json({ error: '获取数据失败' })
  }
})

// 添加成功案例
router.post('/cases', authenticateToken, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('标题长度为1-100个字符'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('描述长度为1-500个字符'),
  body('country').trim().isLength({ min: 1, max: 50 }).withMessage('国家长度为1-50个字符'),
  body('content').optional().trim(),
  body('employer').optional().trim(),
  body('result').optional().trim(),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('排序必须为非负整数')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '表单验证失败',
        details: errors.array()
      })
    }

    const { title, description, country, content, employer, result, sort_order = 0 } = req.body

    const [result_data] = await db.execute(
      `INSERT INTO cases (title, description, country, content, employer, result, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, country, content, employer, result, sort_order]
    )

    res.json({
      success: true,
      message: '添加成功',
      data: {
        id: result_data.insertId
      }
    })

  } catch (error) {
    console.error('添加成功案例错误:', error)
    res.status(500).json({ error: '添加失败' })
  }
})

// 更新成功案例
router.put('/cases/:id', authenticateToken, [
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('标题长度为1-100个字符'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('描述长度为1-500个字符'),
  body('country').trim().isLength({ min: 1, max: 50 }).withMessage('国家长度为1-50个字符'),
  body('content').optional().trim(),
  body('employer').optional().trim(),
  body('result').optional().trim(),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('排序必须为非负整数')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '表单验证失败',
        details: errors.array()
      })
    }

    const { id } = req.params
    const { title, description, country, content, employer, result, sort_order = 0 } = req.body

    const [result_data] = await db.execute(
      `UPDATE cases SET title = ?, description = ?, country = ?, content = ?, 
       employer = ?, result = ?, sort_order = ? WHERE id = ?`,
      [title, description, country, content, employer, result, sort_order, id]
    )

    if (result_data.affectedRows === 0) {
      return res.status(404).json({ error: '案例不存在' })
    }

    res.json({
      success: true,
      message: '更新成功'
    })

  } catch (error) {
    console.error('更新成功案例错误:', error)
    res.status(500).json({ error: '更新失败' })
  }
})

// 删除成功案例
router.delete('/cases/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await db.execute(
      'DELETE FROM cases WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '案例不存在' })
    }

    res.json({
      success: true,
      message: '删除成功'
    })

  } catch (error) {
    console.error('删除成功案例错误:', error)
    res.status(500).json({ error: '删除失败' })
  }
})

// 获取新闻资讯列表
router.get('/news', authenticateToken, async (req, res) => {
  try {
    const { page = 1, size = 10, search = '' } = req.query
    const offset = (page - 1) * size
    const limit = parseInt(size)

    let whereConditions = ['status = 1']
    let params = []

    if (search) {
      whereConditions.push('(title LIKE ? OR summary LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    const whereClause = `WHERE ${whereConditions.join(' AND ')}`

    // 获取总数
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM news ${whereClause}`,
      params
    )
    const total = countResult[0].total

    // 获取数据
    const [rows] = await db.execute(
      `SELECT * FROM news ${whereClause}
       ORDER BY sort_order ASC, id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
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
    res.status(500).json({ error: '获取数据失败' })
  }
})

// 添加新闻资讯
router.post('/news', authenticateToken, [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('标题长度为1-200个字符'),
  body('summary').trim().isLength({ min: 1, max: 500 }).withMessage('摘要长度为1-500个字符'),
  body('content').trim().isLength({ min: 1 }).withMessage('内容不能为空'),
  body('publish_date').isDate().withMessage('发布日期格式不正确'),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('排序必须为非负整数')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '表单验证失败',
        details: errors.array()
      })
    }

    const { title, summary, content, publish_date, sort_order = 0 } = req.body

    const [result_data] = await db.execute(
      `INSERT INTO news (title, summary, content, publish_date, sort_order)
       VALUES (?, ?, ?, ?, ?)`,
      [title, summary, content, publish_date, sort_order]
    )

    res.json({
      success: true,
      message: '添加成功',
      data: {
        id: result_data.insertId
      }
    })

  } catch (error) {
    console.error('添加新闻资讯错误:', error)
    res.status(500).json({ error: '添加失败' })
  }
})

// 更新新闻资讯
router.put('/news/:id', authenticateToken, [
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('标题长度为1-200个字符'),
  body('summary').trim().isLength({ min: 1, max: 500 }).withMessage('摘要长度为1-500个字符'),
  body('content').trim().isLength({ min: 1 }).withMessage('内容不能为空'),
  body('publish_date').isDate().withMessage('发布日期格式不正确'),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('排序必须为非负整数')
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: '表单验证失败',
        details: errors.array()
      })
    }

    const { id } = req.params
    const { title, summary, content, publish_date, sort_order = 0 } = req.body

    const [result_data] = await db.execute(
      `UPDATE news SET title = ?, summary = ?, content = ?, publish_date = ?, sort_order = ? 
       WHERE id = ?`,
      [title, summary, content, publish_date, sort_order, id]
    )

    if (result_data.affectedRows === 0) {
      return res.status(404).json({ error: '新闻不存在' })
    }

    res.json({
      success: true,
      message: '更新成功'
    })

  } catch (error) {
    console.error('更新新闻资讯错误:', error)
    res.status(500).json({ error: '更新失败' })
  }
})

// 删除新闻资讯
router.delete('/news/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await db.execute(
      'DELETE FROM news WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '新闻不存在' })
    }

    res.json({
      success: true,
      message: '删除成功'
    })

  } catch (error) {
    console.error('删除新闻资讯错误:', error)
    res.status(500).json({ error: '删除失败' })
  }
})

module.exports = router