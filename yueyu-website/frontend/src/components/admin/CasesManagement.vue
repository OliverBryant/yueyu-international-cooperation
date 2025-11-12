<template>
  <div>
    <!-- 顶部工具栏 -->
    <div class="admin-toolbar">
      <div class="toolbar-left">
        <h1>成功案例管理</h1>
        <el-button type="primary" @click="showAddDialog">
          <el-icon><Plus /></el-icon>
          添加案例
        </el-button>
      </div>
      <div class="toolbar-right">
        <el-button @click="$router.push('/cases')" plain>
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
            placeholder="搜索标题或描述"
            clearable
            style="width: 250px"
            prefix-icon="Search"
            @change="loadData"
          />
        </el-form-item>
        <el-form-item>
          <el-select v-model="searchForm.country" placeholder="选择国家" clearable style="width: 150px" @change="loadData">
            <el-option label="全部" value="" />
            <el-option label="澳大利亚" value="澳大利亚" />
            <el-option label="日本" value="日本" />
            <el-option label="新加坡" value="新加坡" />
            <el-option label="新西兰" value="新西兰" />
            <el-option label="加拿大" value="加拿大" />
            <el-option label="俄罗斯" value="俄罗斯" />
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
        empty-text="暂无数据"
      >
        <el-table-column prop="title" label="案例标题" min-width="200">
          <template #default="scope">
            <strong>{{ scope.row.title }}</strong>
          </template>
        </el-table-column>
        <el-table-column prop="country" label="国家" width="120">
          <template #default="scope">
            <el-tag size="small" type="primary">{{ scope.row.country }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="employer" label="雇主" width="150">
          <template #default="scope">
            <span v-if="scope.row.employer">{{ scope.row.employer }}</span>
            <span v-else class="empty-value">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="250">
          <template #default="scope">
            <div class="description-preview">{{ scope.row.description }}</div>
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
              @click="editCase(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="handleDeleteCase(scope.row)"
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
      :title="editingCase ? '编辑案例' : '添加案例'"
      width="800px"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="案例标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入案例标题" />
        </el-form-item>
        <el-form-item label="国家" prop="country">
          <el-select v-model="form.country" placeholder="请选择国家" style="width: 100%">
            <el-option label="澳大利亚" value="澳大利亚" />
            <el-option label="日本" value="日本" />
            <el-option label="新加坡" value="新加坡" />
            <el-option label="新西兰" value="新西兰" />
            <el-option label="加拿大" value="加拿大" />
            <el-option label="俄罗斯" value="俄罗斯" />
          </el-select>
        </el-form-item>
        <el-form-item label="雇主" prop="employer">
          <el-input v-model="form.employer" placeholder="请输入雇主名称" />
        </el-form-item>
        <el-form-item label="案例描述" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="请输入案例描述"
          />
        </el-form-item>
        <el-form-item label="详细内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :rows="5"
            placeholder="请输入详细内容"
          />
        </el-form-item>
        <el-form-item label="项目成果" prop="result">
          <el-input
            v-model="form.result"
            type="textarea"
            :rows="3"
            placeholder="请输入项目成果"
          />
        </el-form-item>
        <el-form-item label="排序" prop="sort_order">
          <el-input-number v-model="form.sort_order" :min="0" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveCase" :loading="saving">
          {{ editingCase ? '更新' : '添加' }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getAdminCases, addCase, updateCase, deleteCase } from '../../api'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const editingCase = ref(false)
const tableData = ref([])

const searchForm = reactive({
  search: '',
  country: ''
})

const pagination = reactive({
  current: 1,
  size: 10,
  total: 0
})

const form = reactive({
  id: null,
  title: '',
  country: '',
  employer: '',
  description: '',
  content: '',
  result: '',
  sort_order: 0
})

const rules = {
  title: [
    { required: true, message: '请输入案例标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度为1-100个字符', trigger: 'blur' }
  ],
  country: [
    { required: true, message: '请选择国家', trigger: 'change' }
  ],
  description: [
    { required: true, message: '请输入案例描述', trigger: 'blur' },
    { min: 1, max: 500, message: '描述长度为1-500个字符', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入详细内容', trigger: 'blur' }
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
      search: searchForm.search,
      country: searchForm.country
    }
    
    const response = await getAdminCases(params)
    tableData.value = response.data.list
    pagination.total = response.data.pagination.total
    
  } catch (error) {
    ElMessage.error('加载数据失败')
    console.error('加载案例数据错误:', error)
  } finally {
    loading.value = false
  }
}

const resetSearch = () => {
  searchForm.search = ''
  searchForm.country = ''
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
  editingCase.value = false
  Object.assign(form, {
    id: null,
    title: '',
    country: '',
    employer: '',
    description: '',
    content: '',
    result: '',
    sort_order: 0
  })
  dialogVisible.value = true
}

const editCase = (row) => {
  editingCase.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

const saveCase = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    saving.value = true
    
    if (editingCase.value) {
      await updateCase(form.id, form)
      ElMessage.success('更新成功')
    } else {
      await addCase(form)
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

const handleDeleteCase = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除案例"${row.title}"吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    await deleteCase(row.id)
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

.empty-value {
  color: #c0c4cc;
  font-style: italic;
}

.description-preview {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.table-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>