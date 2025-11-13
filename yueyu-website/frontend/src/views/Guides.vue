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
            <h3>{{ guide.title }}</h3>
            <div class="guide-meta">
              <el-tag size="small">{{ guide.category }}</el-tag>
              <span>{{ formatDate(guide.created_at, 'YYYY-MM-DD') }}</span>
            </div>
            <p v-if="guide.content">{{ guide.content.substring(0, 150) }}...</p>
            <el-button type="text" @click="viewDetail(guide)">查看详情</el-button>
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
}

.guide-item h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #2c3e50;
  cursor: pointer;
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
</style>