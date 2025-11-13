<template>
  <div class="page">
    <div class="container">
      <div class="section-title">
        <h2>合作伙伴</h2>
        <p>与全球20多个国家和地区的企业建立长期合作关系</p>
      </div>
      
      <div v-if="loading" class="loading">
        <p>加载中...</p>
      </div>
      
      <div v-else class="partners-grid">
        <div v-for="partner in partners" :key="partner.id" class="partner-item">
          <div class="partner-logo">
            <img v-if="partner.logo" :src="partner.logo" :alt="partner.name">
            <div v-else class="placeholder-logo">{{ getCountryEmoji(partner.name) }}</div>
          </div>
          <div class="partner-info">
            <h4>{{ partner.name }}</h4>
            <p v-if="partner.description">{{ partner.description }}</p>
            <a v-if="partner.website" :href="partner.website" target="_blank" class="website">访问官网</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getPartners } from '../api'

const loading = ref(false)
const partners = ref([])

const getCountryEmoji = (partnerName) => {
  const emojiMap = {
    '澳大利亚劳工部': '🇦🇺',
    '日本国际合作机构': '🇯🇵',
    '新加坡人力部': '🇸🇬',
    '加拿大就业与社会发展部': '🇨🇦'
  }
  return emojiMap[partnerName] || '🌐'
}

const loadData = async () => {
  try {
    loading.value = true
    const response = await getPartners()
    partners.value = response.data
  } catch (error) {
    console.error('加载合作伙伴失败:', error)
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
  background-color: #f8f9fa;
}

.loading {
  text-align: center;
  padding: 50px;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.partner-item {
  background: white;
  border-radius: 8px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.partner-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.partner-logo {
  margin-bottom: 20px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.partner-logo img {
  max-width: 100%;
  height: 80px;
  object-fit: contain;
}

.placeholder-logo {
  font-size: 64px;
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 12px;
  border: 2px solid #e9ecef;
  transition: transform 0.3s;
}

.partner-item:hover .placeholder-logo {
  transform: scale(1.1);
}

.partner-info h4 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.partner-info p {
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 15px;
}

.website {
  color: #e60012;
  text-decoration: none;
  font-size: 14px;
}

.website:hover {
  text-decoration: underline;
}
</style>