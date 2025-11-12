<template>
  <div class="page">
    <div class="container">
      <div class="section-title">
        <h2>新闻资讯</h2>
        <p>了解最新行业动态和公司新闻</p>
      </div>
      
      <div v-if="loading" class="loading">
        <p>加载中...</p>
      </div>
      
      <div v-else>
        <div class="news-list">
          <div v-for="item in news" :key="item.id" class="card news-item">
            <div class="news-date">
              <div class="day">{{ formatDate(item.publish_date, 'DD') }}</div>
              <div class="month">{{ formatDate(item.publish_date, 'YYYY.MM') }}</div>
            </div>
            <div class="news-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.summary }}</p>
              <el-button type="text" @click="viewDetail(item)">阅读更多</el-button>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div v-if="pagination.total > 0" class="pagination">
          <el-pagination
            v-model:current-page="pagination.current"
            v-model:page-size="pagination.size"
            :total="pagination.total"
            layout="prev, pager, next"
            @current-change="loadNews"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getNews } from '../api'
import dayjs from 'dayjs'

const loading = ref(false)
const news = ref([])

const pagination = ref({
  current: 1,
  size: 10,
  total: 0
})

const formatDate = (date, format) => {
  return dayjs(date).format(format)
}

const loadNews = async (page = 1) => {
  try {
    loading.value = true
    pagination.value.current = page
    
    const response = await getNews({
      page: page,
      size: pagination.value.size
    })
    
    news.value = response.data.list
    pagination.value = response.data.pagination
    
  } catch (error) {
    console.error('加载新闻失败:', error)
  } finally {
    loading.value = false
  }
}

const viewDetail = (item) => {
  // 这里可以实现跳转到新闻详情页
  console.log('查看新闻详情:', item)
}

onMounted(() => {
  loadNews()
})
</script>

<style scoped>
.page {
  padding: 60px 0;
  background-color: #f8f9fa;
}

.loading {
  text-align: center;
  padding: 50px;
}

.news-list {
  max-width: 800px;
  margin: 0 auto;
}

.news-item {
  display: flex;
  margin-bottom: 25px;
  padding: 25px;
}

.news-date {
  width: 80px;
  text-align: center;
  margin-right: 25px;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 15px 10px;
  flex-shrink: 0;
}

.news-date .day {
  font-size: 32px;
  font-weight: bold;
  color: #e60012;
  line-height: 1;
}

.news-date .month {
  font-size: 14px;
  color: #7f8c8d;
  margin-top: 5px;
}

.news-content {
  flex: 1;
}

.news-content h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #2c3e50;
  cursor: pointer;
}

.news-content h3:hover {
  color: #e60012;
}

.news-content p {
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.pagination {
  text-align: center;
  margin-top: 40px;
}
</style>