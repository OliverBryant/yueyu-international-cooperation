<template>
  <div class="page">
    <div class="container">
      <div class="section-title">
        <h2>出国指南</h2>
        <p>详细的出国指导和实用信息</p>
      </div>
      
      <div v-if="loading" class="loading">
        <p>加载中...</p>
      </div>
      
      <div v-else>
        <div class="guide-categories">
          <el-button 
            v-for="category in categories" 
            :key="category"
            :type="currentCategory === category ? 'danger' : 'default'"
            @click="filterGuides(category)"
          >
            {{ category }}
          </el-button>
        </div>
        
        <div class="guide-list">
          <div v-for="guide in filteredGuides" :key="guide.id" class="card guide-item">
            <div class="guide-header">
              <div class="guide-icon">
                <img v-if="guide.image" :src="guide.image" :alt="guide.title" />
                <div v-else class="guide-category-icon">{{ getCategoryEmoji(guide.category) }}</div>
              </div>
              <div class="guide-info">
                <h3>{{ guide.title }}</h3>
                <div class="guide-meta">
                  <el-tag size="small" :type="getCategoryType(guide.category)">{{ guide.category }}</el-tag>
                  <span>{{ formatDate(guide.created_at, 'YYYY-MM-DD') }}</span>
                </div>
              </div>
            </div>
            <p v-if="guide.content">{{ guide.content.substring(0, 150) }}...</p>
            <div class="guide-actions">
              <el-button v-if="guide.file_url" type="text" size="small" @click="downloadFile(guide.file_url)">
                <el-icon><Download /></el-icon>
                下载文件
              </el-button>
              <el-button type="primary" size="small" @click="viewDetail(guide)">查看详情</el-button>
            </div>
          </div>
        </div>
        
        <!-- 指南详情弹窗 -->
        <DetailDialog
          v-model:visible="detailVisible"
          :data="selectedGuide"
          type="guide"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { getGuides } from '../api'
import dayjs from 'dayjs'
import DetailDialog from '../components/DetailDialog.vue'

const loading = ref(false)
const guides = ref([])
const currentCategory = ref('全部')
const selectedGuide = ref(null)
const detailVisible = ref(false)

const categories = ['全部', '签证指南', '政策解读', '就业指导', '培训指南', '生活指南']

const filteredGuides = computed(() => {
  if (currentCategory.value === '全部') {
    return guides.value
  }
  return guides.value.filter(item => item.category === currentCategory.value)
})

const formatDate = (date, format) => {
  return dayjs(date).format(format)
}

const filterGuides = (category) => {
  currentCategory.value = category
}

const viewDetail = (item) => {
  selectedGuide.value = item
  detailVisible.value = true
}

const getCategoryEmoji = (category) => {
  const emojiMap = {
    '签证指南': '📝',
    '政策解读': '📋',
    '就业指导': '💼',
    '培训指南': '📚',
    '生活指南': '🏠'
  }
  return emojiMap[category] || '📄'
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

const downloadFile = (fileUrl) => {
  if (!fileUrl) return
  
  try {
    const link = document.createElement('a')
    link.href = fileUrl
    link.download = '' // 让浏览器自动处理文件名
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    ElMessage.error('下载失败')
    console.error('下载失败:', error)
  }
}

const loadData = async () => {
  try {
    loading.value = true
    const response = await getGuides()
    guides.value = response.data
  } catch (error) {
    console.error('加载指南失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.page {
  padding: 60px 0;
  background-color: #fff;
}

.loading {
  text-align: center;
  padding: 50px;
}

.guide-categories {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  gap: 10px;
  flex-wrap: wrap;
}

.guide-list {
  max-width: 800px;
  margin: 0 auto;
}

.guide-item {
  padding: 25px;
  margin-bottom: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.guide-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.guide-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 15px;
}

.guide-icon {
  width: 80px;
  height: 80px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
}

.guide-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.guide-category-icon {
  font-size: 48px;
  line-height: 1;
}

.guide-info {
  flex: 1;
}

.guide-item h3 {
  font-size: 20px;
  margin: 0 0 10px 0;
  color: #2c3e50;
  cursor: pointer;
  transition: color 0.2s;
}

.guide-item h3:hover {
  color: #e60012;
}

.guide-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.guide-meta span {
  font-size: 14px;
  color: #999;
}

.guide-item p {
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
}

.guide-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
}
</style>