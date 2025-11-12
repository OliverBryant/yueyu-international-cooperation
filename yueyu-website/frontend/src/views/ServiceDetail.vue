<template>
  <div class="page">
    <div class="container">
      <h1>服务详情</h1>
      <div v-if="loading" class="loading">
        <p>加载中...</p>
      </div>
      <div v-else-if="service" class="service-detail">
        <div class="service-header">
          <span class="service-icon">{{ service.icon || '🌍' }}</span>
          <h2>{{ service.title }}</h2>
        </div>
        <div class="service-description">
          <p>{{ service.description }}</p>
        </div>
        <div v-if="service.content" class="service-content">
          <div v-html="service.content"></div>
        </div>
        <div class="service-actions">
          <el-button type="danger" @click="$router.push('/contact')">立即咨询</el-button>
          <el-button @click="$router.push('/services')">返回服务列表</el-button>
        </div>
      </div>
      <div v-else class="not-found">
        <h3>服务项目不存在</h3>
        <el-button @click="$router.push('/services')">返回服务列表</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getServiceDetail } from '../api'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const service = ref(null)

const loadServiceDetail = async () => {
  try {
    loading.value = true
    const response = await getServiceDetail(route.params.id)
    service.value = response.data
  } catch (error) {
    console.error('加载服务详情失败:', error)
    service.value = null
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadServiceDetail()
})
</script>

<style scoped>
.page {
  padding: 60px 0;
  background-color: #fff;
  min-height: 60vh;
}

.loading {
  text-align: center;
  padding: 50px;
}

.service-detail {
  max-width: 800px;
  margin: 0 auto;
}

.service-header {
  text-align: center;
  margin-bottom: 40px;
}

.service-icon {
  font-size: 64px;
  display: block;
  margin-bottom: 20px;
}

.service-header h2 {
  font-size: 32px;
  color: #2c3e50;
  margin: 0;
}

.service-description {
  background: #f8f9fa;
  padding: 30px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.service-description p {
  font-size: 18px;
  line-height: 1.8;
  color: #555;
  text-align: center;
  margin: 0;
}

.service-content {
  margin-bottom: 40px;
  line-height: 1.8;
  color: #555;
}

.service-actions {
  text-align: center;
  gap: 20px;
}

.not-found {
  text-align: center;
  padding: 50px;
}

.not-found h3 {
  color: #999;
  margin-bottom: 20px;
}
</style>