<template>
  <div class="page">
    <div class="container">
      <div class="section-title">
        <h2>工作项目</h2>
        <p>丰富的海外就业机会，助您实现职业梦想</p>
      </div>
      
      <div v-if="loading" class="loading">
        <el-loading />
      </div>
      
      <div v-else-if="services.length === 0" class="loading">
        <p>暂无工作项目数据</p>
      </div>
      
      <div v-else class="grid-3">
        <div v-for="(service, index) in services" :key="service.id" 
             class="card job-item animate-on-scroll"
             :style="{ animationDelay: `${index * 0.1}s` }">
          <div class="job-image" v-if="service.image">
            <img :src="service.image" :alt="service.title" />
          </div>
          <div class="job-icon" v-else>
            <span>{{ service.icon || '💼' }}</span>
          </div>
          <div class="job-content">
            <h3>{{ service.title }}</h3>
            <p class="job-description">{{ service.description }}</p>
            <div v-if="service.content" class="job-detail">
              <p>{{ service.content }}</p>
            </div>
            <div class="job-action">
              <el-button type="primary" size="small" @click="showJobDetail(service)">
                查看详情
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 工作详情弹窗 -->
  <el-dialog
    v-model="detailVisible"
    :title="selectedJob?.title || '工作详情'"
    width="800px"
    destroy-on-close
  >
    <div v-if="selectedJob" class="job-detail">
      <div class="detail-header">
        <div class="detail-image" v-if="selectedJob.image" @click="showImagePreview(selectedJob.image)">
          <img :src="selectedJob.image" :alt="selectedJob.title" />
          <div class="image-overlay">
            <el-icon><ZoomIn /></el-icon>
            <span>点击查看大图</span>
          </div>
        </div>
        <div class="detail-info">
          <h2>{{ selectedJob.title }}</h2>
          <div class="job-meta">
            <span class="job-icon">{{ selectedJob.icon || '💼' }}</span>
            <span class="job-status">正在招聘</span>
          </div>
        </div>
      </div>
      
      <div class="detail-content">
        <h3>职位描述</h3>
        <p class="description">{{ selectedJob.description }}</p>
        
        <div v-if="selectedJob.content" class="detail-section">
          <h3>工作详情</h3>
          <p class="detail-text">{{ selectedJob.content }}</p>
        </div>
        
        <div class="detail-actions">
          <el-button type="primary" size="large" @click="detailVisible = false">
            返回
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>

  <!-- 图片预览弹窗 -->
  <el-dialog
    v-model="imagePreviewVisible"
    title="图片预览"
    width="80%"
    :show-close="true"
    destroy-on-close
    class="image-preview-dialog"
  >
    <div class="image-preview-container">
      <img :src="previewImageUrl" alt="预览图片" @load="onImageLoad" @error="onImageError" />
      <div v-if="imageLoading" class="loading-overlay">
        <el-loading />
      </div>
    </div>
    <template #footer>
      <el-button @click="imagePreviewVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { ZoomIn } from '@element-plus/icons-vue'
import { getServices } from '../api'

const loading = ref(false)
const services = ref([])
const detailVisible = ref(false)
const selectedJob = ref(null)

// 图片预览相关
const imagePreviewVisible = ref(false)
const previewImageUrl = ref('')
const imageLoading = ref(false)

const loadData = async () => {
  try {
    loading.value = true
    const response = await getServices()
    services.value = response.data
    
    // 数据加载完成后初始化动画
    setTimeout(initScrollAnimations, 100)
  } catch (error) {
    console.error('加载工作项目失败:', error)
    ElMessage.error('加载工作项目失败')
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

const showJobDetail = (job) => {
  selectedJob.value = job
  detailVisible.value = true
}

// 图片预览功能
const showImagePreview = (imageUrl) => {
  previewImageUrl.value = imageUrl
  imageLoading.value = true
  imagePreviewVisible.value = true
}

const onImageLoad = () => {
  imageLoading.value = false
}

const onImageError = () => {
  imageLoading.value = false
  ElMessage.error('图片加载失败')
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

.job-item {
  text-align: center;
  padding: 0;
  min-height: 400px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.job-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.job-image {
  height: 200px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
}

.job-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.job-item:hover .job-image img {
  transform: scale(1.05);
}

.job-icon {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
  font-size: 36px;
  color: #e60012;
  border-radius: 8px 8px 0 0;
}

.job-content {
  padding: 25px;
  flex: 1;
}

.job-content h3 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #2c3e50;
  font-weight: 600;
}

.job-description {
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.job-detail {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.job-detail p {
  font-size: 13px;
  text-align: left;
}

/* 详情弹窗样式 */
.job-detail {
  line-height: 1.6;
}

.detail-header {
  display: flex;
  gap: 20px;
  margin-bottom: 25px;
}

.detail-image {
  width: 200px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.detail-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info {
  flex: 1;
}

.detail-info h2 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0 0 10px 0;
}

.job-meta {
  display: flex;
  align-items: center;
  gap: 15px;
}

.job-icon {
  font-size: 24px;
  background: #f8f9fa;
  padding: 8px;
  border-radius: 50%;
  color: #e60012;
}

.job-status {
  background: #67c23a;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.detail-content h3 {
  font-size: 18px;
  color: #2c3e50;
  margin: 25px 0 15px 0;
  padding-bottom: 10px;
  border-bottom: 2px solid #e60012;
}

.description {
  color: #333;
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 16px;
}

.detail-section {
  margin: 25px 0;
}

.detail-text {
  color: #555;
  line-height: 1.8;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #e60012;
}

.detail-actions {
  text-align: center;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.detail-actions {
  text-align: center;
}

.detail-actions .el-button {
  margin: 0;
}

/* 图片预览相关样式 */
.detail-image {
  position: relative;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.3s;
}

.detail-image:hover {
  transform: scale(1.02);
}

.detail-image:hover .image-overlay {
  opacity: 1;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
  color: white;
}

.image-overlay .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.image-overlay span {
  font-size: 14px;
  font-weight: 500;
}

/* 图片预览弹窗样式 */
.image-preview-dialog .el-dialog__body {
  padding: 20px;
  text-align: center;
}

.image-preview-container {
  position: relative;
  max-height: 70vh;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview-container img {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}
</style>