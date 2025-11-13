const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
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
        key: '30fd6c74d4d53149e32ec858e245c2b9',
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

    // 为每条记录添加地理位置信息
    const formattedRowsWithLocation = await Promise.all(rows.map(async row => {
      const location = await getIpLocation(row.ip)
      return {
        ...row,
        wechat: row.wechat || '--',
        ip: row.ip || '--',
        location: location,
        user_agent: row.user_agent || '--'
      }
    }))

    const formattedRows = formattedRowsWithLocation

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

    // 为每条记录添加地理位置信息
    const rowsWithLocation = await Promise.all(rows.map(async row => {
      const location = await getIpLocation(row.ip)
      return { ...row, location }
    }))

    // 格式化数据用于导出
    const exportData = rowsWithLocation.map(row => ({
      姓名: row.name,
      电话: row.phone,
      微信号: row.wechat || '--',
      留言内容: row.message,
      提交时间: new Date(row.submit_time).toLocaleString('zh-CN'),
      地区: row.location,
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
      { wch: 15 }, // 地区
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

// ========== 服务项目管理 ==========

// 获取服务项目列表（管理员）
router.get('/services', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      size = 10,
      sort = 'sort_order',
      order = 'asc',
      search = ''
    } = req.query

    const offset = (page - 1) * size
    const limit = parseInt(size)

    // 验证和清理排序参数
    const allowedSortFields = ['id', 'title', 'sort_order', 'status', 'created_at']
    const allowedOrderDirections = ['asc', 'desc']
    
    const sanitizedSort = allowedSortFields.includes(sort) ? sort : 'sort_order'
    const sanitizedOrder = allowedOrderDirections.includes(order.toLowerCase()) ? order.toUpperCase() : 'ASC'

    // 构建查询条件
    let whereConditions = []
    let params = []

    if (search) {
      whereConditions.push('(title LIKE ? OR description LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // 获取总数
    const [countResult] = await db.execute(
      `SELECT COUNT(*) as total FROM services ${whereClause}`,
      params
    )
    const total = countResult[0].total

    // 获取数据
    const [rows] = await db.execute(
      `SELECT * FROM services ${whereClause}
       ORDER BY ${sanitizedSort} ${sanitizedOrder}
       LIMIT ${limit} OFFSET ${offset}`,
      params
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
    console.error('获取服务项目数据错误:', error)
    res.status(500).json({ 
      error: '获取数据失败',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// 添加服务项目
router.post('/services', authenticateToken, async (req, res) => {
  try {
    const { title, description, icon, image, content, sort_order, status } = req.body

    // 验证必填字段
    if (!title || !description) {
      return res.status(400).json({ error: '标题和描述不能为空' })
    }

    // 获取当前最大排序值
    const [maxSortResult] = await db.execute(
      'SELECT MAX(sort_order) as max_sort FROM services'
    )
    const maxSort = maxSortResult[0].max_sort || 0

    // 插入新服务项目
    const [result] = await db.execute(
      `INSERT INTO services (title, description, icon, image, content, sort_order, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, description, icon || '', image || '', content || '', sort_order || maxSort + 1, status || 1]
    )

    res.json({
      success: true,
      message: '服务项目添加成功',
      data: {
        id: result.insertId,
        title,
        description,
        icon: icon || '',
        image: image || '',
        content: content || '',
        sort_order: sort_order || maxSort + 1,
        status: status || 1
      }
    })

  } catch (error) {
    console.error('添加服务项目错误:', error)
    res.status(500).json({ error: '添加服务项目失败' })
  }
})

// 更新服务项目
router.put('/services/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, icon, image, content, sort_order, status } = req.body

    // 验证必填字段
    if (!title || !description) {
      return res.status(400).json({ error: '标题和描述不能为空' })
    }

    // 检查服务项目是否存在
    const [existingRows] = await db.execute(
      'SELECT id FROM services WHERE id = ?',
      [id]
    )

    if (existingRows.length === 0) {
      return res.status(404).json({ error: '服务项目不存在' })
    }

    // 更新服务项目
    await db.execute(
      `UPDATE services 
       SET title = ?, description = ?, icon = ?, image = ?, content = ?, sort_order = ?, status = ?
       WHERE id = ?`,
      [title, description, icon || '', image || '', content || '', sort_order || 0, status || 1, id]
    )

    res.json({
      success: true,
      message: '服务项目更新成功'
    })

  } catch (error) {
    console.error('更新服务项目错误:', error)
    res.status(500).json({ error: '更新服务项目失败' })
  }
})

// 删除服务项目
router.delete('/services/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await db.execute(
      'DELETE FROM services WHERE id = ?',
      [id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: '服务项目不存在' })
    }

    res.json({
      success: true,
      message: '服务项目删除成功'
    })

  } catch (error) {
    console.error('删除服务项目错误:', error)
    res.status(500).json({ error: '删除服务项目失败' })
  }
})

// 导出服务项目数据
router.get('/services/export', authenticateToken, async (req, res) => {
  try {
    const XLSX = require('xlsx')
    
    const { search = '' } = req.query

    // 构建查询条件
    let whereConditions = []
    let params = []

    if (search) {
      whereConditions.push('(title LIKE ? OR description LIKE ?)')
      params.push(`%${search}%`, `%${search}%`)
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : ''

    // 获取所有数据
    const [rows] = await db.execute(
      `SELECT title, description, icon, image, content, 
              CASE WHEN status = 1 THEN '启用' ELSE '禁用' END as status_text,
              sort_order, created_at, updated_at
       FROM services ${whereClause}
       ORDER BY sort_order ASC, id DESC`,
      params
    )

    // 格式化数据用于导出
    const exportData = rows.map(row => ({
      标题: row.title,
      描述: row.description,
      图标: row.icon || '--',
      图片: row.image || '--',
      详细内容: row.content || '--',
      状态: row.status_text,
      排序: row.sort_order,
      创建时间: new Date(row.created_at).toLocaleString('zh-CN'),
      更新时间: new Date(row.updated_at).toLocaleString('zh-CN')
    }))

    // 创建工作簿
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.json_to_sheet(exportData)
    
    // 设置列宽
    ws['!cols'] = [
      { wch: 20 }, // 标题
      { wch: 30 }, // 描述
      { wch: 10 }, // 图标
      { wch: 30 }, // 图片
      { wch: 50 }, // 详细内容
      { wch: 10 }, // 状态
      { wch: 10 }, // 排序
      { wch: 25 }, // 创建时间
      { wch: 25 }  // 更新时间
    ]
    
    XLSX.utils.book_append_sheet(wb, ws, '服务项目数据')

    // 生成文件名
    const fileName = `服务项目数据_${new Date().toISOString().slice(0, 10)}.xlsx`

    // 发送文件
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`)

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    res.send(buffer)

  } catch (error) {
    console.error('导出服务项目数据错误:', error)
    res.status(500).json({ error: '导出失败' })
  }
})

module.exports = router