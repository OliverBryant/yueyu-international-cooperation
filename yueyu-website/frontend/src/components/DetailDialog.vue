<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="800px"
    destroy-on-close
    class="detail-dialog"
  >
    <div v-if="data" class="detail-content">
      <div class="detail-header">
        <h2>{{ data.title }}</h2>
        <div class="detail-meta">
          <el-tag v-if="data.country" type="primary">{{ data.country }}</el-tag>
          <el-tag v-if="data.category" type="info">{{ data.category }}</el-tag>
          <span v-if="data.publish_date" class="date">
            {{ formatDate(data.publish_date, 'YYYY年MM月DD日') }}
          </span>
          <span v-if="data.employer" class="employer">雇主：{{ data.employer }}</span>
        </div>
      </div>
      
      <div v-if="data.summary && type === 'news'" class="summary-section">
        <h3>摘要</h3>
        <p>{{ data.summary }}</p>
      </div>
      
      <div v-if="data.description && type === 'case'" class="description-section">
        <h3>项目描述</h3>
        <p>{{ data.description }}</p>
      </div>
      
      <div v-if="data.content" class="content-section">
        <h3>详细内容</h3>
        <div class="content-text" v-html="formatContent(data.content)"></div>
      </div>
      
      <div v-if="data.result && type === 'case'" class="result-section">
        <h3>项目成果</h3>
        <p>{{ data.result }}</p>
      </div>
    </div>
    
    <template #footer>
      <el-button @click="dialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    default: null
  },
  type: {
    type: String,
    default: 'news' // 'news', 'case', 'guide'
  }
})

const emit = defineEmits(['update:visible'])

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const title = computed(() => {
  switch (props.type) {
    case 'news':
      return '新闻详情'
    case 'case':
      return '案例详情'
    case 'guide':
      return '指南详情'
    default:
      return '详细信息'
  }
})

const formatDate = (date, format) => {
  return dayjs(date).format(format)
}

const formatContent = (content) => {
  // 将换行符转换为HTML换行标签
  return content.replace(/\n/g, '<br>')
}
</script>

<style scoped>
.detail-dialog :deep(.el-dialog__body) {
  padding: 20px;
}

.detail-content {
  line-height: 1.6;
}

.detail-header {
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.detail-header h2 {
  margin: 0 0 15px 0;
  color: #2c3e50;
  font-size: 24px;
}

.detail-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
}

.detail-meta .date,
.detail-meta .employer {
  color: #666;
  font-size: 14px;
}

.summary-section,
.description-section,
.content-section,
.result-section {
  margin-bottom: 25px;
}

.summary-section h3,
.description-section h3,
.content-section h3,
.result-section h3 {
  margin: 0 0 10px 0;
  color: #1b53f2;
  font-size: 18px;
  border-left: 4px solid #1b53f2;
  padding-left: 10px;
}

.summary-section p,
.description-section p,
.result-section p {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.content-text {
  color: #333;
  line-height: 1.8;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border-left: 4px solid #1b53f2;
}
</style>