<template>
  <div class="contact-page">
    <div class="container">
      <div class="section-title">
        <h2>联系我们</h2>
        <p>专业的国际劳务合作服务，为您的海外就业保驾护航</p>
      </div>
      
      <div class="contact-content">
        <div class="contact-info">
          <div class="card">
            <h3>联系方式</h3>
            <div class="info-item">
              <span class="icon">📍</span>
              <div class="text">
                <h4>公司地址</h4>
                <p>山东省青岛市市北区敦化路379号中铁青岛广场A座1522室</p>
              </div>
            </div>
            <div class="info-item">
              <span class="icon">📞</span>
              <div class="text">
                <h4>联系电话</h4>
                <p>0532-81978007</p>
              </div>
            </div>
            <div class="info-item">
              <span class="icon">✉️</span>
              <div class="text">
                <h4>电子邮箱</h4>
                <p>syndicate_2008@yahoo.com</p>
              </div>
            </div>
            <div class="info-item">
              <span class="icon">🕐</span>
              <div class="text">
                <h4>工作时间</h4>
                <p>周一至周五 9:00-18:00</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="contact-form">
          <div class="card">
            <h3>在线咨询</h3>
            <el-form
              ref="formRef"
              :model="form"
              :rules="rules"
              label-width="80px"
              @submit.prevent="handleSubmit"
            >
              <el-form-item label="姓名" prop="name">
                <el-input
                  v-model="form.name"
                  placeholder="请输入您的姓名"
                  maxlength="50"
                  show-word-limit
                />
              </el-form-item>
              
              <el-form-item label="电话" prop="phone">
                <el-input
                  v-model="form.phone"
                  placeholder="请输入11位中国大陆手机号"
                  maxlength="11"
                  clearable
                  @input="handlePhoneInput"
                  @blur="handlePhoneBlur"
                />
              </el-form-item>
              
              <el-form-item label="微信号" prop="wechat">
                <el-input
                  v-model="form.wechat"
                  placeholder="请输入您的微信号（选填）"
                  maxlength="50"
                />
              </el-form-item>
              
              <el-form-item label="留言" prop="message">
                <el-input
                  v-model="form.message"
                  type="textarea"
                  :rows="4"
                  placeholder="请详细描述您的需求，我们会尽快与您联系"
                  maxlength="500"
                  show-word-limit
                />
              </el-form-item>
              
              <el-form-item>
                <el-button 
                  type="danger" 
                  :loading="loading"
                  @click="handleSubmit"
                  style="width: 100%;"
                >
                  {{ loading ? '提交中...' : '提交咨询' }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { submitContact } from '../api'

const formRef = ref()
const loading = ref(false)

const form = reactive({
  name: '',
  phone: '',
  wechat: '',
  message: ''
})

const phoneValidator = (rule, value, callback) => {
  // 中国大陆手机号正则表达式，支持所有合法号段
  const phoneRegex = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
  
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!/^\d+$/.test(value)) {
    callback(new Error('手机号只能包含数字'))
  } else if (value.length !== 11) {
    callback(new Error('手机号必须是11位数字'))
  } else if (!phoneRegex.test(value)) {
    callback(new Error('请输入正确的中国大陆手机号'))
  } else {
    callback()
  }
}

const handlePhoneInput = (value) => {
  // 只允许输入数字，自动过滤非数字字符
  form.phone = value.replace(/\D/g, '')
}

const handlePhoneBlur = () => {
  // 失去焦点时触发验证
  if (formRef.value && form.phone) {
    formRef.value.validateField('phone')
  }
}

const rules = reactive({
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '姓名长度为2-50个字符', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { validator: phoneValidator, trigger: 'blur' }
  ],
  wechat: [
    { min: 3, max: 50, message: '微信号长度为3-50个字符', trigger: 'blur' }
  ],
  message: [
    { required: true, message: '请输入留言内容', trigger: 'blur' },
    { max: 500, message: '留言内容不能超过500个字符', trigger: 'blur' }
  ]
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    await submitContact(form)
    
    ElMessage.success('提交成功！我们会尽快与您联系')
    
    // 重置表单
    Object.assign(form, {
      name: '',
      phone: '',
      wechat: '',
      message: ''
    })
    
    formRef.value.resetFields()
    
  } catch (error) {
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else if (error.errors) {
      ElMessage.error('请检查表单填写是否正确')
    } else {
      ElMessage.error('提交失败，请稍后重试')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.contact-page {
  padding: 60px 0;
  background-color: #f8f9fa;
  min-height: 60vh;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 50px;
  margin-top: 50px;
}

.contact-info .card,
.contact-form .card {
  padding: 40px;
}

.contact-info h3,
.contact-form h3 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.info-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 25px;
}

.info-item .icon {
  font-size: 24px;
  margin-right: 15px;
  margin-top: 2px;
}

.info-item .text h4 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 5px;
}

.info-item .text p {
  color: #7f8c8d;
  line-height: 1.6;
  margin: 0;
}

@media (max-width: 768px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .contact-info .card,
  .contact-form .card {
    padding: 25px;
  }
}
</style>