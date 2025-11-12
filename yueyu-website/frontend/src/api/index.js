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

// 获取服务项目列表
export const getServices = () => api.get('/services')

// 获取服务项目详情
export const getServiceDetail = (id) => api.get(`/services/${id}`)

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

export default api