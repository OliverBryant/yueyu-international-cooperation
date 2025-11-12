<template>
  <div class="page">
    <div class="container">
      <div class="section-title">
        <h2>服务项目</h2>
        <p>专业、全面的国际人力资源服务</p>
      </div>
      
      <div v-if="loading" class="loading">
        <el-loading />
      </div>
      
      <div v-else class="grid-3">
        <div v-for="(service, index) in services" :key="service.id" 
             class="card service-item animate-on-scroll"
             :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="service-icon">
            <span>{{ service.icon || '🌍' }}</span>
          </div>
          <div class="service-content">
            <h3>{{ service.title }}</h3>
            <p>{{ service.description }}</p>
            <div v-if="service.content" class="service-detail">
              <p>{{ service.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getServices } from '../api'

const loading = ref(false)
const services = ref([])

const loadData = async () => {
  try {
    loading.value = true
    const response = await getServices()
    services.value = response.data
    
    // 数据加载完成后初始化动画
    setTimeout(initScrollAnimations, 100)
  } catch (error) {
    console.error('加载服务项目失败:', error)
  } finally {
    loading.value = false
  }
}

const initScrollAnimations = () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('animated')
        }, index * 50)
      }
    })
  }, observerOptions)
  
  const animatedElements = document.querySelectorAll('.animate-on-scroll')
  animatedElements.forEach(el => {
    observer.observe(el)
  })
}

onMounted(() => {
  loadData()
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

.service-item {
  text-align: center;
  padding: 30px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
}

.service-icon {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  font-size: 36px;
  color: #e60012;
  margin-bottom: 25px;
  border-radius: 50%;
  width: 80px;
  margin: 0 auto 25px;
}

.service-content h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #2c3e50;
}

.service-content p {
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.6;
  flex: 1;
}

.service-detail {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.service-detail p {
  font-size: 13px;
  text-align: left;
}
</style>