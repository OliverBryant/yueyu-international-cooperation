<template>
  <div class="page">
    <div class="container">
      <div class="section-title">
        <h2>成功案例</h2>
        <p>我们在全球多个国家和地区的成功派遣经验</p>
      </div>
      
      <div class="case-filter">
        <el-button 
          v-for="country in filterCountries" 
          :key="country"
          :type="currentFilter === country ? 'danger' : 'default'"
          @click="filterCases(country)"
        >
          {{ country }}
        </el-button>
      </div>
      
      <div v-if="loading" class="loading">
        <p>加载中...</p>
      </div>
      
      <div v-else class="grid-3">
        <div v-for="caseItem in filteredCases" :key="caseItem.id" class="card case-item">
          <div class="case-img">
            <img :src="caseItem.image || '/placeholder.jpg'" :alt="caseItem.title" v-if="false">
            <div class="placeholder-img">{{ caseItem.title }}</div>
          </div>
          <div class="case-content">
            <h3>{{ caseItem.title }}</h3>
            <p>{{ caseItem.description }}</p>
            <div class="case-meta">
              <el-tag type="info">{{ caseItem.country }}</el-tag>
              <span v-if="caseItem.employer" class="employer">{{ caseItem.employer }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { getCases } from '../api'

const loading = ref(false)
const cases = ref([])
const currentFilter = ref('全部')

const filterCountries = ['全部', '澳大利亚', '日本', '新加坡', '新西兰', '加拿大', '俄罗斯']

const filteredCases = computed(() => {
  if (currentFilter.value === '全部') {
    return cases.value
  }
  return cases.value.filter(item => item.country === currentFilter.value)
})

const filterCases = (country) => {
  currentFilter.value = country
}

const loadData = async () => {
  try {
    loading.value = true
    const response = await getCases()
    cases.value = response.data
  } catch (error) {
    console.error('加载案例失败:', error)
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

.case-filter {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
  gap: 10px;
  flex-wrap: wrap;
}

.loading {
  text-align: center;
  padding: 50px;
}

.case-img {
  height: 200px;
  overflow: hidden;
}

.case-img img,
.placeholder-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.case-item:hover .case-img img {
  transform: scale(1.05);
}

.case-content {
  padding: 20px;
}

.case-content h3 {
  font-size: 18px;
  margin-bottom: 10px;
  color: #2c3e50;
}

.case-content p {
  color: #7f8c8d;
  font-size: 14px;
  margin-bottom: 15px;
  line-height: 1.5;
}

.case-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.employer {
  font-size: 12px;
  color: #999;
}
</style>