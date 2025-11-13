<template>
  <div class="admin-dashboard">
    <div class="admin-body">
        <!-- 侧边栏 -->
        <div class="admin-sidebar">
          <div class="sidebar-header">
            <div class="logo-text">
              <h3>悦途管理后台</h3>
            </div>
          </div>
          <nav class="sidebar-nav">
            <div class="nav-item" :class="{ active: activeModule === 'contacts' }" @click="activeModule = 'contacts'">
              <el-icon><Document /></el-icon>
              <span>联系表单</span>
            </div>
            <div class="nav-item" :class="{ active: activeModule === 'cases' }" @click="activeModule = 'cases'">
              <el-icon><Trophy /></el-icon>
              <span>成功案例</span>
            </div>
            <div class="nav-item" :class="{ active: activeModule === 'news' }" @click="activeModule = 'news'">
              <el-icon><Newspaper /></el-icon>
              <span>新闻资讯</span>
            </div>
            <div class="nav-item" :class="{ active: activeModule === 'services' }" @click="activeModule = 'services'">
              <el-icon><Service /></el-icon>
              <span>工作项目</span>
            </div>
            <div class="nav-item" :class="{ active: activeModule === 'partners' }" @click="activeModule = 'partners'">
              <el-icon><Link /></el-icon>
              <span>合作伙伴</span>
            </div>
            <div class="nav-item" :class="{ active: activeModule === 'guides' }" @click="activeModule = 'guides'">
              <el-icon><Document /></el-icon>
              <span>出国指南</span>
            </div>
          </nav>
          <div class="sidebar-footer">
            <div class="user-info">
              <el-tag type="success" size="small">{{ user?.username || '管理员' }}</el-tag>
              <el-button type="danger" @click="logout" size="small" text>
                <el-icon><SwitchButton /></el-icon>
                退出
              </el-button>
            </div>
          </div>
        </div>

        <!-- 主内容区 -->
        <div class="admin-main">
          <!-- 联系表单模块 -->
          <div v-if="activeModule === 'contacts'" class="module-content">
            <ContactManagement 
              :table-data="tableData" 
              :pagination="pagination" 
              :loading="loading" 
              :date-range="dateRange"
              :search-form="searchForm"
              :today-count="todayCount"
              :phone-count="phoneCount" 
              :wechat-count="wechatCount"
              @load-data="loadData"
              @view-detail="viewDetail"
              @delete-record="deleteRecord"
              @export-data="exportData"
              @reset-search="resetSearch"
              @handle-date-change="handleDateChange"
              @handle-sort-change="handleSortChange"
              @handle-size-change="handleSizeChange"
              @handle-current-change="handleCurrentChange"
            />
          </div>

          <!-- 成功案例模块 -->
          <div v-else-if="activeModule === 'cases'" class="module-content">
            <CasesManagement />
          </div>

          <!-- 新闻资讯模块 -->
          <div v-else-if="activeModule === 'news'" class="module-content">
            <NewsManagement />
          </div>

          <!-- 服务项目模块 -->
          <div v-else-if="activeModule === 'services'" class="module-content">
            <ServiceManagement />
          </div>

          <!-- 合作伙伴模块 -->
          <div v-else-if="activeModule === 'partners'" class="module-content">
            <PartnersManagement />
          </div>

          <!-- 出国指南模块 -->
          <div v-else-if="activeModule === 'guides'" class="module-content">
            <GuidesManagement />
          </div>
        </div>
    </div>

    <!-- 详情弹窗 -->
      <el-dialog
        v-model="detailDialog.visible"
        title="咨询详情"
        width="700px"
        destroy-on-close
      >
        <div v-if="detailDialog.data" class="detail-content">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="姓名">
              <el-tag type="primary">{{ detailDialog.data.name }}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="电话">
              <span class="phone-number">{{ detailDialog.data.phone }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="微信号">
              <el-tag v-if="detailDialog.data.wechat && detailDialog.data.wechat.trim()" type="success">
                {{ detailDialog.data.wechat }}
              </el-tag>
              <span v-else class="empty-value">未填写</span>
            </el-descriptions-item>
            <el-descriptions-item label="提交时间">
              {{ formatDateTime(detailDialog.data.submit_time) }}
            </el-descriptions-item>
            <el-descriptions-item label="IP地址" span="2">
              {{ detailDialog.data.ip || '--' }}
            </el-descriptions-item>
            <el-descriptions-item label="留言内容" span="2">
              <div class="message-full">{{ detailDialog.data.message }}</div>
            </el-descriptions-item>
            <el-descriptions-item label="设备信息" span="2">
              <div class="user-agent">{{ detailDialog.data.user_agent || '--' }}</div>
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <template #footer>
          <el-button @click="detailDialog.visible = false">关闭</el-button>
        </template>
      </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Document, Service, Link } from '@element-plus/icons-vue'
import { getContacts, deleteContact, exportContacts } from '../../api'
import ContactManagement from '../../components/admin/ContactManagement.vue'
import CasesManagement from '../../components/admin/CasesManagement.vue'
import NewsManagement from '../../components/admin/NewsManagement.vue'
import ServiceManagement from '../../components/admin/ServiceManagement.vue'
import PartnersManagement from '../../components/admin/PartnersManagement.vue'
import GuidesManagement from '../../components/admin/GuidesManagement.vue'

const router = useRouter()
const activeModule = ref('contacts')
const loading = ref(false)
const exporting = ref(false)
const tableData = ref([])
const dateRange = ref([])
const user = ref(null)
const todayCount = ref(0)
const phoneCount = ref(0)
const wechatCount = ref(0)

const searchForm = reactive({
  search: '',
  phone: '',
  startDate: '',
  endDate: ''
})

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const sortConfig = reactive({
  sort: 'submit_time',
  order: 'desc'
})

const detailDialog = reactive({
  visible: false,
  data: null
})

const formatDateTime = (dateTime) => {
  return new Date(dateTime).toLocaleString('zh-CN')
}

const formatDate = (dateTime) => {
  return new Date(dateTime).toLocaleDateString('zh-CN')
}

const formatTime = (dateTime) => {
  return new Date(dateTime).toLocaleTimeString('zh-CN')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  ElMessage.success('已退出登录')
  router.push('/admin/login')
}

const handleDateChange = (dates) => {
  if (dates && dates.length === 2) {
    searchForm.startDate = dates[0]
    searchForm.endDate = dates[1]
  } else {
    searchForm.startDate = ''
    searchForm.endDate = ''
  }
  loadData()
}

const handleSortChange = ({ prop, order }) => {
  sortConfig.sort = prop || 'submit_time'
  sortConfig.order = order === 'ascending' ? 'asc' : 'desc'
  loadData()
}

const handleSizeChange = (size) => {
  pagination.size = size
  pagination.current = 1
  loadData()
}

const handleCurrentChange = (page) => {
  pagination.current = page
  loadData()
}

const calculateStats = () => {
  const today = new Date().toDateString()
  
  todayCount.value = tableData.value.filter(item => 
    new Date(item.submit_time).toDateString() === today
  ).length
  
  phoneCount.value = tableData.value.filter(item => item.phone).length
  
  // 只统计真正包含微信号的记录，排除 "--" 和空值
  wechatCount.value = tableData.value.filter(item => 
    item.wechat && item.wechat !== '--' && item.wechat.trim() !== ''
  ).length
}

const loadData = async () => {
  try {
    loading.value = true
    
    const params = {
      page: pagination.current,
      size: pagination.size,
      sort: sortConfig.sort,
      order: sortConfig.order,
      ...searchForm
    }
    
    const response = await getContacts(params)
    
    tableData.value = response.data.list
    pagination.total = response.data.pagination.total
    
    // 计算统计数据
    calculateStats()
    
  } catch (error) {
    ElMessage.error('加载数据失败')
    console.error('加载数据错误:', error)
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.search = ''
  searchForm.phone = ''
  searchForm.startDate = ''
  searchForm.endDate = ''
  pagination.current = 1
  loadData()
}

const viewDetail = (row) => {
  detailDialog.data = row
  detailDialog.visible = true
}

const deleteRecord = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除 ${row.name} 的记录吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteContact(row.id)
    ElMessage.success('删除成功')
    loadData()
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const exportData = async () => {
  try {
    exporting.value = true
    
    const params = { ...searchForm }
    const response = await exportContacts(params)
    
    // 创建下载链接
    const blob = new Blob([response], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `联系表单数据_${new Date().toISOString().slice(0, 10)}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('导出成功')
    
  } catch (error) {
    ElMessage.error('导出失败')
    console.error('导出错误:', error)
  } finally {
    exporting.value = false
  }
}

onMounted(() => {
  // 获取用户信息
  const userData = localStorage.getItem('user')
  if (userData) {
    user.value = JSON.parse(userData)
  }
  loadData()
})
</script>

<style scoped>
/* 管理后台纯界面 */
.admin-dashboard {
  min-height: 100vh;
  background: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.admin-body {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

/* 侧边栏 */
.admin-sidebar {
  width: 200px;
  background: linear-gradient(180deg, #1b53f2 0%, #076ce0 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-text h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
}

.sidebar-footer {
  padding: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-footer .user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  margin: 5px 0;
  border-radius: 0;
  font-size: 14px;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: #5EC5FD;
  border-radius: 2px 0 0 2px;
}

.nav-item .el-icon {
  margin-right: 12px;
  font-size: 18px;
}

/* 主内容区 */
.admin-main {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.module-content {
  height: 100%;
}

/* 详情弹窗样式 */
.detail-content {
  line-height: 1.6;
}

.message-full {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 6px;
  border-left: 4px solid #076ce0;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-word;
}

.user-agent {
  background: #f8f9fa;
  padding: 10px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #666;
  word-break: break-all;
}

/* 响应式 */
@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    height: auto;
  }
  
  .admin-body {
    flex-direction: column;
  }
  
  .logo-text h3 {
    font-size: 14px;
  }
  
  .nav-item {
    padding: 12px 15px;
    font-size: 13px;
  }
}
</style>