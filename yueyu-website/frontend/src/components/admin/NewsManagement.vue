<template>
  <div>
    <!-- 顶部工具栏 -->
    <div class="admin-toolbar">
      <div class="toolbar-left">
        <h1>新闻资讯管理</h1>
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          添加新闻
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-button @click="$router.push('/news')" plain>
          <el-icon><View /></el-icon>
          预览页面
        </el-button>
      </div>
    </div>

    <!-- 搜索筛选区 -->
    <div class="filter-section">
      <el-form :model="searchForm" inline>
        <el-form-item>
          <el-input
            v-model="searchForm.search"
            placeholder="搜索标题或摘要"
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
        empty-text="暂无数据"
      >
        <el-table-column prop="title" label="新闻标题" min-width="200">
          <template #default="scope">
            <strong>{{ scope.row.title }}</strong>
          </template>
        </el-table-column>
        <el-table-column prop="summary" label="摘要" min-width="250">
          <template #default="scope">
            <div class="summary-preview">{{ scope.row.summary }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="publish_date" label="发布日期" width="120">
          <template #default="scope">
            <el-tag size="small" type="success">{{ scope.row.publish_date }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="image" label="图片" width="100">
          <template #default="scope">
            <el-popover v-if="scope.row.image" placement="top" :width="200" trigger="hover">
              <template #reference>
                <img :src="scope.row.image" class="table-image" alt="图片" />
              </template>
              <img :src="scope.row.image" class="preview-image" alt="预览" />
            </el-popover>
            <span v-else class="empty-value">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort_order" label="排序" width="80" align="center">
          <template #default="scope">
            {{ scope.row.sort_order }}
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="160">
          <template #default="scope">
            {{ formatDate(scope.row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              @click="editNews(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="handleDeleteNews(scope.row)"
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
          :page-sizes="[10, 25, 50]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>

    <!-- 添加/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingNews ? '编辑新闻' : '添加新闻'"
      width="900px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="新闻标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入新闻标题" />
        </el-form-item>
        <el-form-item label="发布日期" prop="publish_date">
          <el-date-picker
            v-model="form.publish_date"
            type="date"
            placeholder="选择发布日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="新闻摘要" prop="summary">
          <el-input
            v-model="form.summary"
            type="textarea"
            :rows="3"
            placeholder="请输入新闻摘要"
          />
        </el-form-item>
        <el-form-item label="新闻图片" prop="image">
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
        <el-form-item label="新闻内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="8"
            placeholder="请输入新闻详细内容"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort_order">
          <el-input-number v-model="form.sort_order" :min="0" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveNews" :loading="saving">
          {{ editingNews ? '更新' : '添加' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminNews, addNews, updateNews, deleteNews } from '../../api'
import ImageUploader from '../ImageUploader.vue'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const editingNews = ref(false)
const tableData = ref([])
const imageList = ref([])

const searchForm = reactive({
  search: ''
})

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const form = reactive({
  id: null,
  title: '',
  publish_date: '',
  summary: '',
  content: '',
  image: '',
  sort_order: 0
})

const rules = {
  title: [
    { required: true, message: '请输入新闻标题', trigger: 'blur' },
    { min: 1, max: 200, message: '标题长度为1-200个字符', trigger: 'blur' }
  ],
  publish_date: [
    { required: true, message: '请选择发布日期', trigger: 'change' }
  ],
  summary: [
    { required: true, message: '请输入新闻摘要', trigger: 'blur' },
    { min: 1, max: 500, message: '摘要长度为1-500个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入新闻内容', trigger: 'blur' }
  ]
}

const formRef = ref()

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN')
}

const loadData = async () => {
  try {
    loading.value = true
    const params = {
      page: pagination.current,
      size: pagination.size,
      search: searchForm.search
    }
    
    const response = await getAdminNews(params)
    tableData.value = response.data.list
    pagination.total = response.data.pagination.total
    
  } catch (error) {
    ElMessage.error('加载数据失败')
    console.error('加载新闻数据错误:', error)
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.search = ''
  pagination.current = 1
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

const showAddDialog = () => {
  editingNews.value = false
  Object.assign(form, {
    id: null,
    title: '',
    publish_date: new Date().toISOString().slice(0, 10),
    summary: '',
    content: '',
    image: '',
    sort_order: 0
  })
  imageList.value = []
  dialogVisible.value = true
}

const editNews = (row) => {
  editingNews.value = true
  Object.assign(form, row)
  
  // 设置图片列表
  if (row.image) {
    imageList.value = [row.image]
  } else {
    imageList.value = []
  }
  
  dialogVisible.value = true
}

// 图片上传成功处理
const handleImageUpload = (uploadData) => {
  form.image = uploadData.path
}

// 图片删除处理
const handleImageRemove = () => {
  form.image = ''
}

const saveNews = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    saving.value = true
    
    // 设置图片数据
    if (imageList.value.length > 0) {
      form.image = imageList.value[0]
    } else {
      form.image = ''
    }
    
    if (editingNews.value) {
      await updateNews(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await addNews(form)
      ElMessage.success('添加成功')
    }
    
    dialogVisible.value = false
    loadData()
    
  } catch (error) {
    if (error.response?.data?.error) {
      ElMessage.error(error.response.data.error)
    } else {
      ElMessage.error('保存失败')
    }
  } finally {
    saving.value = false
  }
}

const handleDeleteNews = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除新闻"${row.title}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteNews(row.id)
    ElMessage.success('删除成功')
    loadData()
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
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

.summary-preview {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-pagination {
  margin-top: 20px;
  text-align: right;
}

/* 图片相关样式 */
.table-image {
  width: 60px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
}

.preview-image {
  max-width: 180px;
  max-height: 180px;
  object-fit: contain;
  border-radius: 4px;
}
</style>