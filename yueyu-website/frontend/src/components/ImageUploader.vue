<template>
  <div class="image-uploader">
    <el-upload
      ref="uploadRef"
      :action="`${apiBaseURL}/api/admin/upload`"
      :headers="headers"
      :before-upload="beforeUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-remove="onRemove"
      :file-list="fileList"
      :limit="limit"
      :accept="acceptTypes"
      list-type="picture-card"
      :show-file-list="showFileList"
      :disabled="disabled"
      :class="{ 'upload-disabled': disabled }"
      name="image"
    >
      <template #default>
        <div class="upload-trigger">
          <el-icon class="upload-icon"><Plus /></el-icon>
          <div class="upload-text">上传图片</div>
        </div>
      </template>
      
      <template #file="{ file }">
        <div class="image-item">
          <img :src="file.url" :alt="file.name" class="upload-image" />
          <div class="image-actions" v-if="!disabled">
            <span class="preview" @click="handlePreview(file)">
              <el-icon><ZoomIn /></el-icon>
            </span>
            <span class="delete" @click="handleRemove(file)">
              <el-icon><Delete /></el-icon>
            </span>
          </div>
        </div>
      </template>
    </el-upload>

    <!-- 图片预览对话框 -->
    <el-dialog v-model="previewVisible" title="图片预览" width="80%" :append-to-body="true">
      <div class="preview-container">
        <img :src="previewImageUrl" alt="预览图片" class="preview-image" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { uploadImage, deleteImage } from '../api/index.js'

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  limit: {
    type: Number,
    default: 1
  },
  disabled: {
    type: Boolean,
    default: false
  },
  showFileList: {
    type: Boolean,
    default: true
  },
  maxSize: {
    type: Number,
    default: 5 * 1024 * 1024 // 5MB
  }
})

const emit = defineEmits(['update:modelValue', 'upload-success', 'upload-error', 'remove'])

const uploadRef = ref()
const fileList = ref([])
const previewVisible = ref(false)
const previewImageUrl = ref('')

// 接受的图片类型
const acceptTypes = '.jpg,.jpeg,.png,.gif,.webp'

// API基础URL
const apiBaseURL = computed(() => {
  return process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
})

// 请求头（包含JWT token）
const headers = computed(() => {
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
})

// 监听外部value变化
watch(() => props.modelValue, (newVal) => {
  if (newVal && newVal.length > 0) {
    fileList.value = newVal.map((url, index) => ({
      uid: index,
      name: url.split('/').pop() || `image-${index}`,
      status: 'success',
      url: url,
      response: { data: { path: url } }
    }))
  } else {
    fileList.value = []
  }
}, { immediate: true })

// 上传前检查
const beforeUpload = (file) => {
  // 检查文件类型
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error('只支持 JPEG、PNG、GIF、WebP 格式的图片')
    return false
  }

  // 检查文件大小
  if (file.size > props.maxSize) {
    ElMessage.error(`图片大小不能超过 ${Math.round(props.maxSize / 1024 / 1024)}MB`)
    return false
  }

  return true
}

// 上传成功
const onSuccess = (response, uploadFile) => {
  console.log('上传成功响应:', response)
  
  // 由于响应拦截器，response已经是response.data
  if (response.success) {
    const imageUrl = response.data.fullUrl || `${apiBaseURL.value}${response.data.path}`
    
    // 更新文件列表中的URL
    uploadFile.url = imageUrl
    uploadFile.response = response
    
    // 更新外部值
    updateModelValue()
    
    ElMessage.success('图片上传成功')
    emit('upload-success', response.data, uploadFile)
  } else {
    ElMessage.error(response.message || '上传失败')
    // 移除失败的文件
    const index = fileList.value.findIndex(file => file.uid === uploadFile.uid)
    if (index > -1) {
      fileList.value.splice(index, 1)
    }
    emit('upload-error', response.error || '上传失败', uploadFile)
  }
}

// 上传失败
const onError = (error, uploadFile) => {
  ElMessage.error('上传失败，请重试')
  
  // 移除失败的文件
  const index = fileList.value.findIndex(file => file.uid === uploadFile.uid)
  if (index > -1) {
    fileList.value.splice(index, 1)
  }
  
  emit('upload-error', error.message || '上传失败', uploadFile)
}

// 移除文件
const onRemove = (file, fileList) => {
  updateModelValue()
  emit('remove', file, fileList)
}

// 手动删除图片
const handleRemove = (file) => {
  const index = fileList.value.findIndex(f => f.uid === file.uid)
  if (index > -1) {
    const fileToDelete = fileList.value[index]
    
    // 从服务器删除图片
    if (fileToDelete.response?.data?.filename) {
      deleteImage(fileToDelete.response.data.filename).catch(error => {
        console.log('删除服务器图片失败:', error)
        // 即使服务器删除失败，也移除本地显示
      })
    }
    
    fileList.value.splice(index, 1)
    updateModelValue()
    emit('remove', file)
  }
}

// 预览图片
const handlePreview = (file) => {
  previewImageUrl.value = file.url
  previewVisible.value = true
}

// 更新外部值
const updateModelValue = () => {
  const urls = fileList.value
    .filter(file => file.status === 'success' && file.url)
    .map(file => file.url)
  
  emit('update:modelValue', urls)
}

// 公开方法：清空文件列表
const clearFiles = () => {
  fileList.value = []
  updateModelValue()
}

// 公开方法：手动上传
const submit = () => {
  uploadRef.value?.submit()
}

defineExpose({
  clearFiles,
  submit
})
</script>

<style scoped>
.image-uploader {
  width: 100%;
}

.upload-trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.upload-icon {
  font-size: 24px;
  color: #8c939d;
  margin-bottom: 8px;
}

.upload-text {
  color: #606266;
  font-size: 14px;
}

.image-item {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 6px;
}

.upload-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-actions {
  opacity: 1;
}

.image-actions span {
  color: white;
  font-size: 20px;
  margin: 0 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.image-actions span:hover {
  transform: scale(1.2);
}

.upload-disabled :deep(.el-upload--picture-card) {
  cursor: not-allowed;
  background-color: #f5f7fa;
}

.upload-disabled :deep(.el-upload--picture-card:hover) {
  border-color: #dcdfe6;
}

.preview-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
}

:deep(.el-upload--picture-card) {
  width: 148px;
  height: 148px;
  line-height: 148px;
  border: 1px dashed #c0ccda;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s;
}

:deep(.el-upload--picture-card:hover) {
  border-color: #076ce0;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 148px;
  height: 148px;
  border-radius: 6px;
  overflow: hidden;
}
</style>