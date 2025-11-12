const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const router = express.Router()
const db = require('../config/database')

// JWT中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: '访问令牌无效' })
    }
    req.user = user
    next()
  })
}

// 管理员登录
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: '用户名和密码不能为空' })
    }

    // 查询管理员
    const [users] = await db.execute(
      'SELECT * FROM admins WHERE username = ? AND status = 1',
      [username]
    )

    if (users.length === 0) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const user = users[0]

    // 验证密码（这里假设密码是bcrypt加密的）
    // 在实际部署时，需要将初始密码加密
    let passwordValid = false
    if (username === 'admin' && password === 'admin123') {
      // 临时处理初始密码
      passwordValid = true
    } else {
      passwordValid = await bcrypt.compare(password, user.password)
    }

    if (!passwordValid) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    // 更新最后登录时间
    await db.execute(
      'UPDATE admins SET last_login = NOW() WHERE id = ?',
      [user.id]
    )

    // 生成JWT令牌
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          email: user.email
        }
      }
    })

  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ error: '登录失败，请稍后重试' })
  }
})

// 获取联系表单数据列表
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      size = 10,
      sort = 'submit_time',
      order = 'desc',
      search = '',
      phone = '',
      startDate = '',
      endDate = ''
    } = req.query

    const offset = (page - 1) * size
    const limit = parseInt(size)

    // 验证和清理排序参数
    const allowedSortFields = ['id', 'name', 'phone', 'submit_time']
    const allowedOrderDirections = ['asc', 'desc']
    
    const sanitizedSort = allowedSortFields.includes(sort) ? sort : 'submit_time'
    const sanitizedOrder = allowedOrderDirections.includes(order.toLowerCase()) ? order.toUpperCase() : 'DESC'

    // 构建查询条件
    let whereConditions = []
    let params = []

    if (search) {
      whereConditions.push('(name LIKE ? OR message LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    if (phone) {
      whereConditions.push('phone LIKE ?')
      params.push(`%${phone}%`)
    }

    if (startDate) {
      whereConditions.push('submit_time >= ?')
      params.push(startDate)
    }

    if (endDate) {
      whereConditions.push('submit_time <= ?')
      params.push(endDate + ' 23:59:59')
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // 获取总数
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM contacts ${whereClause}`,
      params
    )
    const total = countResult[0].total

    // 获取数据 - 使用安全的排序方式
    const [rows] = await db.execute(
      `SELECT id, name, phone, wechat, message, submit_time, ip, user_agent
       FROM contacts ${whereClause}
       ORDER BY ${sanitizedSort} ${sanitizedOrder}
       LIMIT ${limit} OFFSET ${offset}`,
      params
    )

    // 格式化数据
    const formattedRows = rows.map(row => ({
      ...row,
      wechat: row.wechat || '--',
      ip: row.ip || '--',
      user_agent: row.user_agent || '--'
    }))

    res.json({
      success: true,
      data: {
        list: formattedRows,
        pagination: {
          current: parseInt(page),
          size: limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })

  } catch (error) {
    console.error('获取联系表单数据错误:', error)
    console.error('错误详情:', {
      message: error.message,
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage
    })
    res.status(500).json({ 
      error: '获取数据失败',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// 删除联系表单记录
router.delete('/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await db.execute(
      'DELETE FROM contacts WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '记录不存在' })
    }

    res.json({
      success: true,
      message: '删除成功'
    })

  } catch (error) {
    console.error('删除记录错误:', error)
    res.status(500).json({ error: '删除失败' })
  }
})

// 导出联系表单数据
router.get('/contacts/export', authenticateToken, async (req, res) => {
  try {
    const XLSX = require('xlsx')
    
    const { search = '', phone = '', startDate = '', endDate = '' } = req.query

    // 构建查询条件
    let whereConditions = []
    let params = []

    if (search) {
      whereConditions.push('(name LIKE ? OR message LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    if (phone) {
      whereConditions.push('phone LIKE ?')
      params.push(`%${phone}%`)
    }

    if (startDate) {
      whereConditions.push('submit_time >= ?')
      params.push(startDate)
    }

    if (endDate) {
      whereConditions.push('submit_time <= ?')
      params.push(endDate + ' 23:59:59')
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // 获取所有数据
    const [rows] = await db.execute(
      `SELECT name, phone, wechat, message, submit_time, ip, user_agent
       FROM contacts ${whereClause}
       ORDER BY submit_time DESC`,
      params
    )

    // 格式化数据用于导出
    const exportData = rows.map(row => ({
      姓名: row.name,
      电话: row.phone,
      微信号: row.wechat || '--',
      留言内容: row.message,
      提交时间: new Date(row.submit_time).toLocaleString('zh-CN'),
      IP地址: row.ip || '--',
      用户代理: row.user_agent || '--'
    }))

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)
    
    // 设置列宽
    ws['!cols'] = [
      { wch: 15 }, // 姓名
      { wch: 15 }, // 电话
      { wch: 20 }, // 微信号
      { wch: 50 }, // 留言内容
      { wch: 25 }, // 提交时间
      { wch: 18 }, // IP地址
      { wch: 30 }  // 用户代理
    ]
    
    XLSX.utils.book_append_sheet(wb, ws, '联系表单数据')

    // 生成文件名
    const fileName = `联系表单数据_${new Date().toISOString().slice(0, 10)}.xlsx`

    // 发送文件
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`)

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    res.send(buffer)

  } catch (error) {
    console.error('导出数据错误:', error)
    res.status(500).json({ error: '导出失败' })
  }
})

module.exports = router