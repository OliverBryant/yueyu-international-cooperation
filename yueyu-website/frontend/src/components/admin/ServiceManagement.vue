<template>
  <div>
    <!-- 顶部工具栏 -->
    <div class="admin-toolbar">
      <div class="toolbar-left">
        <h1>服务项目管理</h1>
        <el-tag type="info">共 {{ pagination.total }} 个服务项目</el-tag>
      </div>
      <div class="toolbar-right">
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          添加服务项目
        </el-button>
        <el-button type="success" @click="exportData" :loading="exporting" plain>
          <el-icon><Download /></el-icon>
          导出Excel
        </el-button>
        <el-button @click="$router.push('/')" plain>
          <el-icon><View /></el-icon>
          预览网站
        </el-button>
      </div>
    </div>

    <!-- 搜索筛选区 -->
    <div class="filter-section">
      <el-form :model="searchForm" inline>
        <el-form-item>
          <el-input
            v-model="searchForm.search"
            placeholder="搜索标题或描述"
            clearable
            style="width: 250px"
            prefix-icon="Search"
            @change="loadData"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="loadData">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="resetSearch">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        size="large"
        @sort-change="handleSortChange"
        empty-text="暂无数据"
      >
        <el-table-column prop="title" label="服务标题" width="200" sortable>
          <template #default="scope">
            <el-tag size="small" type="primary">{{ scope.row.title }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="description" label="服务描述" min-width="250">
          <template #default="scope">
            <el-popover placement="top" :width="300" trigger="hover">
              <template #reference>
                <div class="description-preview">{{ scope.row.description }}</div>
              </template>
              <div>{{ scope.row.description }}</div>
            </el-popover>
          </template>
        </el-table-column>
        
        <el-table-column prop="icon" label="图标" width="80">
          <template #default="scope">
            <span v-if="scope.row.icon" style="font-size: 20px;">{{ scope.row.icon }}</span>
            <span v-else class="empty-value">--</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="sort_order" label="排序" width="80" sortable="custom">
          <template #default="scope">
            <el-tag size="small" type="info">{{ scope.row.sort_order }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" size="small">
              {{ scope.row.status === 1 ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column 
          prop="created_at" 
          label="创建时间" 
          width="160" 
          sortable="custom"
        >
          <template #default="scope">
            <div class="time-info">
              <div>{{ formatDate(scope.row.created_at) }}</div>
              <small>{{ formatTime(scope.row.created_at) }}</small>
            </div>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              @click="openEditDialog(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="deleteRecord(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 25, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑服务项目' : '添加服务项目'"
      width="800px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="服务标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入服务标题"
            maxlength="100"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="服务描述" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入服务描述"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="图标" prop="icon">
          <el-input
            v-model="formData.icon"
            placeholder="请输入emoji图标，如 🔧"
            maxlength="10"
            style="width: 200px"
          />
          <span style="margin-left: 10px; color: #909399; font-size: 14px;">
            常用图标：🔧 🏥 🍽️ 💻 📚 ⚡
          </span>
        </el-form-item>
        
        <el-form-item label="图片地址" prop="image">
          <el-input
            v-model="formData.image"
            placeholder="请输入图片地址（选填）"
            maxlength="255"
          />
        </el-form-item>
        
        <el-form-item label="详细内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="5"
            placeholder="请输入详细内容介绍（选填）"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="排序值" prop="sort_order">
          <el-input-number
            v-model="formData.sort_order"
            :min="0"
            :max="9999"
            placeholder="数字越小越靠前"
          />
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          {{ isEdit ? '更新' : '添加' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminServices, addService, updateService, deleteService } from '../../api'
import api from '../../api'

const loading = ref(false)
const exporting = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()

const tableData = ref([])
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  pages: 0
})

const searchForm = reactive({
  search: ''
})

const formData = reactive({
  title: '',
  description: '',
  icon: '',
  image: '',
  content: '',
  sort_order: 0,
  status: 1
})

const formRules = {
  title: [
    { required: true, message: '请输入服务标题', trigger: 'blur' },
    { min: 2, max: 100, message: '标题长度为2-100个字符', trigger: 'blur' }
  ],
  description: [
    { required: true, message: '请输入服务描述', trigger: 'blur' },
    { min: 10, max: 200, message: '描述长度为10-200个字符', trigger: 'blur' }
  ],
  sort_order: [
    { required: true, message: '请输入排序值', trigger: 'blur' }
  ]
}

const formatDate = (dateTime) => {
  return new Date(dateTime).toLocaleDateString('zh-CN')
}

const formatTime = (dateTime) => {
  return new Date(dateTime).toLocaleTimeString('zh-CN')
}

const loadData = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.current,
      size: pagination.size,
      sort: 'sort_order',
      order: 'asc',
      ...searchForm
    }
    
    const response = await getAdminServices(params)
    tableData.value = response.data.list
    Object.assign(pagination, response.data.pagination)
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const openAddDialog = () => {
  isEdit.value = false
  dialogVisible.value = true
  resetForm()
}

const openEditDialog = (row) => {
  isEdit.value = true
  dialogVisible.value = true
  Object.assign(formData, row)
}

const resetForm = () => {
  Object.assign(formData, {
    title: '',
    description: '',
    icon: '',
    image: '',
    content: '',
    sort_order: 0,
    status: 1
  })
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    if (isEdit.value) {
      await updateService(formData.id, formData)
      ElMessage.success('更新成功')
    } else {
      await addService(formData)
      ElMessage.success('添加成功')
    }
    
    dialogVisible.value = false
    loadData()
  } catch (error) {
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error(isEdit.value ? '更新失败' : '添加失败')
    }
  } finally {
    submitting.value = false
  }
}

const deleteRecord = (row) => {
  ElMessageBox.confirm(
    `确定要删除服务项目"${row.title}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteService(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const exportData = async () => {
  try {
    exporting.value = true
    
    const params = { ...searchForm }
    const response = await api.get('/admin/services/export', {
      params,
      responseType: 'blob'
    })
    
    // 创建下载链接
    const blob = new Blob([response], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `服务项目数据_${new Date().toISOString().slice(0, 10)}.xlsx`
    link.click()
    window.URL.revokeObjectURL(url)
    
    ElMessage.success('导出成功')
  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    exporting.value = false
  }
}

const resetSearch = () => {
  Object.assign(searchForm, { search: '' })
  pagination.current = 1
  loadData()
}

const handleSortChange = ({ prop, order }) => {
  if (prop && order) {
    searchForm.sort = prop
    searchForm.order = order === 'ascending' ? 'asc' : 'desc'
  } else {
    delete searchForm.sort
    delete searchForm.order
  }
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

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-toolbar {
  background: white;
  border-radius: 12px;
  padding: 20px 25px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.toolbar-left h1 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
}

.toolbar-right {
  display: flex;
  gap: 10px;
}

.filter-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.table-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.description-preview {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  color: #606266;
}

.description-preview:hover {
  color: #076ce0;
}

.empty-value {
  color: #c0c4cc;
  font-style: italic;
}

.time-info {
  line-height: 1.4;
}

.time-info small {
  color: #999;
  font-size: 12px;
}

.table-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>