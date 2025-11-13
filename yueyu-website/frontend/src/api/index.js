import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

// 联系我们表单提交
export const submitContact = (data) => api.post('/contact', data)

// 获取服务项目列表（前台）
export const getServices = () => api.get('/services')

// 获取服务项目详情（前台）
export const getServiceDetail = (id) => api.get(`/services/${id}`)

// 获取服务项目列表（管理员）
export const getAdminServices = (params = {}) => api.get('/admin/services', { params })

// 添加服务项目
export const addService = (data) => api.post('/admin/services', data)

// 更新服务项目
export const updateService = (id, data) => api.put(`/admin/services/${id}`, data)

// 删除服务项目
export const deleteService = (id) => api.delete(`/admin/services/${id}`)

// 获取成功案例列表
export const getCases = (params = {}) => api.get('/cases', { params })

// 获取案例详情
export const getCaseDetail = (id) => api.get(`/cases/${id}`)

// 获取新闻资讯列表
export const getNews = (params = {}) => api.get('/news', { params })

// 获取新闻详情
export const getNewsDetail = (id) => api.get(`/news/${id}`)

// 获取出国指南列表
export const getGuides = (params = {}) => api.get('/guides', { params })

// 获取指南详情
export const getGuideDetail = (id) => api.get(`/guides/${id}`)

// 获取合作伙伴列表
export const getPartners = () => api.get('/partners')

// 管理员登录
export const adminLogin = (credentials) => api.post('/admin/login', credentials)

// 获取联系表单数据
export const getContacts = (params = {}) => api.get('/admin/contacts', { params })

// 删除联系表单记录
export const deleteContact = (id) => api.delete(`/admin/contacts/${id}`)

// 导出联系表单数据
export const exportContacts = (params = {}) => api.get('/admin/contacts/export', { 
  params,
  responseType: 'blob'
})

// 获取成功案例列表（管理员）
export const getAdminCases = (params = {}) => api.get('/admin/cases', { params })

// 添加成功案例
export const addCase = (data) => api.post('/admin/cases', data)

// 更新成功案例
export const updateCase = (id, data) => api.put(`/admin/cases/${id}`, data)

// 删除成功案例
export const deleteCase = (id) => api.delete(`/admin/cases/${id}`)

// 获取新闻资讯列表（管理员）
export const getAdminNews = (params = {}) => api.get('/admin/news', { params })

// 添加新闻资讯
export const addNews = (data) => api.post('/admin/news', data)

// 更新新闻资讯
export const updateNews = (id, data) => api.put(`/admin/news/${id}`, data)

// 删除新闻资讯
export const deleteNews = (id) => api.delete(`/admin/news/${id}`)

// ========== 图片上传 ==========

// 上传图片
export const uploadImage = (file) => {
  const formData = new FormData()
  formData.append('image', file)
  return api.post('/admin/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 删除图片
export const deleteImage = (filename) => api.delete(`/admin/upload/delete/${filename}`)

// 获取图片列表
export const getImageList = () => api.get('/admin/upload/list')

// 管理员合作伙伴接口
export const getAdminPartners = (params = {}) => api.get('/admin/partners', { params })
export const addPartner = (data) => api.post('/admin/partners', data)
export const updatePartner = (id, data) => api.put(`/admin/partners/${id}`, data)
export const deletePartner = (id) => api.delete(`/admin/partners/${id}`)

// 管理员出国指南接口
export const getAdminGuides = (params = {}) => api.get('/admin/guides', { params })
export const addGuide = (data) => api.post('/admin/guides', data)
export const updateGuide = (id, data) => api.put(`/admin/guides/${id}`, data)
export const deleteGuide = (id) => api.delete(`/admin/guides/${id}`)

export default api