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
        <div v-for="caseItem in filteredCases" :key="caseItem.id" class="card case-item" @click="viewDetail(caseItem)">
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
      
      <!-- 案例详情弹窗 -->
      <DetailDialog
        v-model:visible="detailVisible"
        :data="selectedCase"
        type="case"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getCases } from '../api'
import DetailDialog from '../components/DetailDialog.vue'

const route = useRoute()
const router = useRouter()

const loading = ref(false)
const cases = ref([])
const currentFilter = ref('全部')
const selectedCase = ref(null)
const detailVisible = ref(false)

const filterCountries = ['全部', '澳大利亚', '日本', '新加坡', '新西兰', '加拿大']

const filteredCases = computed(() => {
  if (currentFilter.value === '全部') {
    return cases.value
  }
  return cases.value.filter(item => item.country === currentFilter.value)
})

const filterCases = (country) => {
  currentFilter.value = country
  // 更新URL参数
  if (country === '全部') {
    router.push({ path: '/cases' })
  } else {
    router.push({ path: '/cases', query: { country } })
  }
}

const loadData = async () => {
  try {
    loading.value = true
    const response = await getCases()
    cases.value = response.data
    
    // 检查URL中是否有country参数
    const urlCountry = route.query.country
    if (urlCountry && filterCountries.includes(urlCountry)) {
      currentFilter.value = urlCountry
    }
  } catch (error) {
    console.error('加载案例失败:', error)
  } finally {
    loading.value = false
  }
}

const viewDetail = (caseItem) => {
  selectedCase.value = caseItem
  detailVisible.value = true
}

// 监听路由变化
const unwatch = router.afterEach(() => {
  const urlCountry = route.query.country
  if (urlCountry && filterCountries.includes(urlCountry)) {
    currentFilter.value = urlCountry
  } else {
    currentFilter.value = '全部'
  }
})

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
  cursor: pointer;
  transition: color 0.3s;
}

.case-item:hover .case-content h3 {
  color: #1b53f2;
}

.case-item {
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.case-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
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