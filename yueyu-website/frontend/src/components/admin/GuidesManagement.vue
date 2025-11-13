<template>
  <div>
    <!-- 顶部工具栏 -->
    <div class="admin-toolbar">
      <div class="toolbar-left">
        <h1>出国指南管理</h1>
        <el-tag type="info">共 {{ pagination.total }} 个指南</el-tag>
      </div>
      <div class="toolbar-right">
        <el-button type="primary" @click="openAddDialog">
          <el-icon><Plus /></el-icon>
          添加指南
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
            placeholder="搜索标题或内容"
            clearable
            style="width: 250px"
            prefix-icon="Search"
            @change="loadData"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.category" placeholder="选择分类" clearable style="width: 150px" @change="loadData">
            <el-option label="签证指南" value="签证指南" />
            <el-option label="政策解读" value="政策解读" />
            <el-option label="就业指导" value="就业指导" />
            <el-option label="培训指南" value="培训指南" />
            <el-option label="生活指南" value="生活指南" />
          </el-select>
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
        <el-table-column prop="title" label="指南标题" width="200" sortable>
          <template #default="scope">
            <el-tag size="small" type="primary">{{ scope.row.title }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column prop="category" label="分类" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.category" size="small" :type="getCategoryType(scope.row.category)">
              {{ scope.row.category }}
            </el-tag>
            <span v-else class="empty-value">--</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="image" label="配图" width="100">
          <template #default="scope">
            <div v-if="scope.row.image" class="image-cell">
              <el-popover placement="top" :width="200" trigger="hover">
                <template #reference>
                  <img :src="scope.row.image" class="image-thumbnail" alt="配图" />
                </template>
                <img :src="scope.row.image" class="image-preview" alt="预览" />
              </el-popover>
            </div>
            <span v-else class="empty-value">--</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="file_url" label="下载文件" width="120">
          <template #default="scope">
            <a v-if="scope.row.file_url" :href="scope.row.file_url" target="_blank" class="file-link">
              <el-icon><Document /></el-icon>
              下载
            </a>
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
      :title="isEdit ? '编辑出国指南' : '添加出国指南'"
      width="900px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="指南标题" prop="title">
          <el-input
            v-model="formData.title"
            placeholder="请输入指南标题"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="分类" prop="category">
          <el-select v-model="formData.category" placeholder="请选择分类" style="width: 100%">
            <el-option label="签证指南" value="签证指南" />
            <el-option label="政策解读" value="政策解读" />
            <el-option label="就业指导" value="就业指导" />
            <el-option label="培训指南" value="培训指南" />
            <el-option label="生活指南" value="生活指南" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="指南内容" prop="content">
          <el-input
            v-model="formData.content"
            type="textarea"
            :rows="8"
            placeholder="请输入指南详细内容"
            maxlength="5000"
            show-word-limit
          />
        </el-form-item>
        
        <el-form-item label="配图" prop="image">
          <ImageUploader
            v-model="imageList"
            :limit="1"
            :max-size="5 * 1024 * 1024"
            @upload-success="handleImageUpload"
            @remove="handleImageRemove"
          />
          <div class="image-tip" style="margin-top: 8px; font-size: 12px; color: #909399;">
            支持 JPEG、PNG、GIF、WebP 格式，大小不超过5MB
          </div>
        </el-form-item>
        
        <el-form-item label="下载文件" prop="file_url">
          <el-input
            v-model="formData.file_url"
            placeholder="请输入下载文件链接（选填）"
            maxlength="255"
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
import { Document } from '@element-plus/icons-vue'
import { getAdminGuides, addGuide, updateGuide, deleteGuide } from '../../api'
import ImageUploader from '../ImageUploader.vue'

const loading = ref(false)
const submitting = ref(false)
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const imageList = ref([])

const tableData = ref([])
const pagination = reactive({
  current: 1,
  size: 10,
  total: 0,
  pages: 0
})

const searchForm = reactive({
  search: '',
  category: ''
})

const formData = reactive({
  title: '',
  content: '',
  category: '',
  file_url: '',
  image: '',
  sort_order: 0,
  status: 1
})

const formRules = {
  title: [
    { required: true, message: '请输入指南标题', trigger: 'blur' },
    { min: 2, max: 200, message: '标题长度为2-200个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入指南内容', trigger: 'blur' },
    { min: 10, max: 5000, message: '内容长度为10-5000个字符', trigger: 'blur' }
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

const getCategoryType = (category) => {
  const typeMap = {
    '签证指南': 'primary',
    '政策解读': 'warning',
    '就业指导': 'success',
    '培训指南': 'info',
    '生活指南': 'danger'
  }
  return typeMap[category] || 'info'
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
    
    const response = await getAdminGuides(params)
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
  
  if (row.image) {
    imageList.value = [row.image]
  } else {
    imageList.value = []
  }
}

const resetForm = () => {
  Object.assign(formData, {
    title: '',
    content: '',
    category: '',
    file_url: '',
    image: '',
    sort_order: 0,
    status: 1
  })
  imageList.value = []
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

const handleImageUpload = (uploadData) => {
  formData.image = uploadData.path
}

const handleImageRemove = () => {
  formData.image = ''
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    submitting.value = true
    
    if (imageList.value.length > 0) {
      formData.image = imageList.value[0]
    } else {
      formData.image = ''
    }
    
    if (isEdit.value) {
      await updateGuide(formData.id, formData)
      ElMessage.success('更新成功')
    } else {
      await addGuide(formData)
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
    `确定要删除指南"${row.title}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      await deleteGuide(row.id)
      ElMessage.success('删除成功')
      loadData()
    } catch (error) {
      ElMessage.error('删除失败')
    }
  })
}

const resetSearch = () => {
  Object.assign(searchForm, { search: '', category: '' })
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

/* 图片相关样式 */
.image-cell {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-thumbnail {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  transition: transform 0.2s;
}

.image-thumbnail:hover {
  transform: scale(1.1);
}

.image-preview {
  max-width: 180px;
  max-height: 180px;
  object-fit: contain;
  border-radius: 4px;
}

/* 文件链接样式 */
.file-link {
  color: #409eff;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  transition: color 0.2s;
}

.file-link:hover {
  color: #66b1ff;
  text-decoration: underline;
}
</style>