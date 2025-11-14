<template>
  <div>
    <!-- 轮播图 -->
    <section class="banner">
      <el-carousel :interval="4000" type="card" height="500px" :autoplay="true">
        <el-carousel-item v-for="item in bannerItems" :key="item.id">
          <div class="banner-slide" :style="{ background: item.background }">
            <div class="banner-content">
              <h2>{{ item.title }}</h2>
              <p>{{ item.description }}</p>
              <el-button type="primary" size="large" @click="item.action">{{ item.buttonText }}</el-button>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </section>

    <!-- 关于我们 -->
    <section class="about">
      <div class="container">
        <div class="section-title">
          <h2>关于我们</h2>
          <p>专业、可靠、高效的对外劳务合作服务商</p>
        </div>
        <div class="about-content">
          <div class="about-img">
            <img src="/e68237c13e2bb180a73fbb78ab179137.jpg" alt="关于我们">
          </div>
          <div class="about-text">
            <h3>青岛悦途国际经济技术合作有限公司</h3>
            <p>公司成立于2020年1月，是经国家商务部批准的从事对外劳务合作的专业公司。公司拥有《对外劳务合作（外派劳务）经营资格证书》，致力于向全球各国派遣各类工程师、技术工人、医护人员及服务人员。</p>
            <p>自成立以来，公司已同澳大利亚、日本、新加坡、新西兰、加拿大、韩国等国家和地区的相关机构、公司、协会建立了长期稳定的合作关系。</p>
            <el-button type="danger" @click="$router.push('/about')">了解更多</el-button>
          </div>
        </div>
      </div>
    </section>

    <!-- 服务项目 -->
    <section class="services">
      <div class="container">
        <div class="section-title">
          <h2>服务项目</h2>
          <p>专业、全面的国际人力资源服务</p>
        </div>
        <div class="grid-3">
          <div v-for="service in services" :key="service.id" class="card service-item">
            <div class="service-icon">
              <span>{{ service.icon }}</span>
            </div>
            <div class="service-content">
              <h3>{{ service.title }}</h3>
              <p>{{ service.description }}</p>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <el-button type="danger" size="large" @click="$router.push('/services')">查看更多服务</el-button>
        </div>
      </div>
    </section>

    <!-- 成功案例 -->
    <section class="cases">
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
        <div class="grid-3">
          <div v-for="caseItem in filteredCases" :key="caseItem.id" class="card case-item">
            <div class="case-img">
              <img :src="caseItem.image || '/placeholder.jpg'" :alt="caseItem.title" v-if="false">
              <div class="placeholder-img">{{ caseItem.title }}</div>
            </div>
            <div class="case-content">
              <h3>{{ caseItem.title }}</h3>
              <p>{{ caseItem.description }}</p>
              <el-tag type="info">{{ caseItem.country }}</el-tag>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <el-button type="danger" size="large" @click="$router.push('/cases')">查看更多案例</el-button>
        </div>
      </div>
    </section>

    <!-- 新闻资讯 -->
    <section class="news">
      <div class="container">
        <div class="section-title">
          <h2>新闻资讯</h2>
          <p>了解最新行业动态和公司新闻</p>
        </div>
        <div class="news-container">
          <div class="news-main">
            <div v-if="news.length === 0" class="empty-state">
              <p>暂无新闻资讯</p>
            </div>
            <div v-for="item in news" :key="item.id" class="news-item">
              <div class="news-date">
                <div class="day">{{ formatDate(item.publish_date, 'DD') }}</div>
                <div class="month">{{ formatDate(item.publish_date, 'YYYY.MM') }}</div>
              </div>
              <div class="news-content">
                <h3>{{ item.title }}</h3>
                <p>{{ item.summary }}</p>
              </div>
            </div>
          </div>
          <div class="news-sidebar">
            <div class="card news-links">
              <h3>出国指南</h3>
              <div v-if="guides.length === 0" class="empty-state">
                <p>暂无出国指南</p>
              </div>
              <ul v-else>
                <li v-for="guide in guides" :key="guide.id">
                  <router-link :to="'/guides'" @click="scrollToGuide(guide)">
                    {{ guide.title }}
                    <span>{{ formatDate(guide.created_at, 'YYYY-MM-DD') }}</span>
                  </router-link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div style="text-align: center; margin-top: 40px;">
          <el-button type="danger" size="large" @click="$router.push('/news')">查看更多新闻</el-button>
        </div>
      </div>
    </section>

    <!-- 合作伙伴 -->
    <section class="partners">
      <div class="container">
        <div class="section-title">
          <h2>合作伙伴</h2>
          <p>与全球20多个国家和地区的企业建立长期合作关系</p>
        </div>
        <div class="partners-slider">
          <div v-for="partner in partners" :key="partner.id" class="partner-item">
            <div class="partner-logo">
              <img :src="partner.logo || '/partner-placeholder.jpg'" :alt="partner.name" v-if="false">
              <div class="placeholder-img">{{ partner.name }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getCases, getNews, getGuides, getPartners } from '../api'
import dayjs from 'dayjs'

const router = useRouter()

const services = ref([
  {
    id: 1,
    title: '对外劳务合作',
    description: '向境外派遣各类工程师、技术工人、医护人员及服务人员，涵盖多个行业和领域',
    icon: '🌍'
  },
  {
    id: 2,
    title: '技能人才派遣',
    description: '专业派遣厨师、护理人员、酒店服务人员、建筑工人等各类技能人才',
    icon: '👨‍🍳'
  },
  {
    id: 3,
    title: '出国培训服务',
    description: '提供语言培训、技能培训、文化适应培训等全方位出国前培训服务',
    icon: '🎓'
  },
  {
    id: 4,
    title: '签证及手续办理',
    description: '专业办理工作签证、护照及其他相关出国手续，确保流程顺利',
    icon: '📝'
  },
  {
    id: 5,
    title: '人力资源咨询',
    description: '为企业和个人提供专业的人力资源咨询服务，包括职业规划、跨国就业指导等',
    icon: '🏢'
  },
  {
    id: 6,
    title: '境外就业安置',
    description: '提供境外工作安排、接机、住宿安排等一站式境外就业安置服务',
    icon: '✈️'
  }
])
const cases = ref([])
const news = ref([])
const guides = ref([])
const partners = ref([])
const currentFilter = ref('全部')

// 轮播图数据
const bannerItems = ref([
  {
    id: 1,
    title: '专业国际劳务合作服务',
    description: '成立于2020年，致力于向全球多个国家和地区派遣各类技术人员和服务人员',
    background: 'url("https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80") center/cover',
    buttonText: '了解更多',
    action: () => router.push('/about')
  },
  {
    id: 2,
    title: '全球派遣，成就梦想',
    description: '已成功向澳大利亚、日本、新加坡、加拿大等多个国家派遣数千名专业人才',
    background: 'url("https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80") center/cover',
    buttonText: '查看成功案例',
    action: () => router.push('/cases')
  },
  {
    id: 3,
    title: '一站式海外就业服务',
    description: '从技能培训到境外安置，为您提供全方位的海外就业解决方案',
    background: 'url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80") center/cover',
    buttonText: '了解服务项目',
    action: () => router.push('/services')
  }
])

const filterCountries = ['全部', '澳大利亚', '日本', '新加坡', '新西兰', '加拿大']

const filteredCases = computed(() => {
  if (currentFilter.value === '全部') {
    return cases.value.slice(0, 3)
  }
  return cases.value.filter(item => item.country === currentFilter.value).slice(0, 3)
})

const formatDate = (date, format) => {
  return dayjs(date).format(format)
}

const filterCases = (country) => {
  currentFilter.value = country
}

const scrollToGuide = (guide) => {
  // 如果需要，可以在跳转到指南页面时滚动到特定指南
  // 这里只是简单的导航跳转
  return true
}

const loadData = async () => {
  try {
    // 获取数据 - 服务项目使用硬编码，不需要从API获取
    const [casesRes, newsRes, guidesRes, partnersRes] = await Promise.all([
      getCases(),
      getNews(),
      getGuides(),
      getPartners()
    ])
    
    console.log('API返回的数据:', {
      news: newsRes,
      guides: guidesRes
    })
    
    // 处理案例数据
    cases.value = Array.isArray(casesRes.data) ? casesRes.data : []
    
    // 处理新闻数据 - 检查数据结构
    if (newsRes.data && newsRes.data.list) {
      news.value = newsRes.data.list.slice(0, 3)
    } else if (Array.isArray(newsRes.data)) {
      news.value = newsRes.data.slice(0, 3)
    } else {
      news.value = []
    }
    
    // 处理指南数据
    if (guidesRes.data && Array.isArray(guidesRes.data)) {
      guides.value = guidesRes.data.slice(0, 5)
    } else {
      guides.value = []
    }
    
    // 处理合作伙伴数据
    partners.value = Array.isArray(partnersRes.data) ? partnersRes.data : []
    
    console.log('处理后的数据:', {
      news: news.value,
      guides: guides.value
    })
    
    // 数据加载完成后初始化动画
    setTimeout(initScrollAnimations, 100)
  } catch (error) {
    console.error('加载数据失败:', error)
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
        }, index * 100)
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
/* 轮播图 */
.banner {
  height: 600px;
  position: relative;
  overflow: hidden;
  margin-bottom: 0;
  animation: fadeInDown 1s ease;
}

.banner-slide {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
}

.banner-content {
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 15px;
  color: #fff;
  position: relative;
  z-index: 2;
  text-align: center;
}

/* Element Plus 轮播图自定义样式 */
.banner :deep(.el-carousel) {
  border-radius: 12px;
  overflow: hidden;
}

.banner :deep(.el-carousel__container) {
  border-radius: 12px;
}

.banner :deep(.el-carousel__item) {
  border-radius: 12px;
  overflow: hidden;
}

.banner :deep(.el-carousel__arrow) {
  background-color: rgba(255, 255, 255, 0.8);
  border: none;
  color: #1b53f2;
  font-size: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.banner :deep(.el-carousel__arrow:hover) {
  background-color: #fff;
  transform: scale(1.1);
}

.banner :deep(.el-carousel__indicator) {
  background-color: rgba(255, 255, 255, 0.6);
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: all 0.3s;
}

.banner :deep(.el-carousel__indicator.is-active) {
  background-color: #fff;
  transform: scale(1.2);
}

.banner-content h2 {
  font-size: 40px;
  margin-bottom: 20px;
  font-weight: 700;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
  line-height: 1.2;
}

.banner-content p {
  font-size: 18px;
  margin-bottom: 30px;
  max-width: 700px;
  line-height: 1.6;
  text-shadow: 0 1px 5px rgba(0,0,0,0.2);
  color: rgba(255,255,255,0.95);
  margin-left: auto;
  margin-right: auto;
}

/* 关于我们 */
.about {
  padding: 60px 0;
  background-color: #fff;
}

.about-content {
  display: flex;
  align-items: center;
  gap: 50px;
}

.about-img {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.about-img img,
.placeholder-img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}

.about-text {
  flex: 1;
}

.about-text h3 {
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.about-text p {
  margin-bottom: 20px;
  line-height: 1.8;
}

/* 服务项目 */
.services {
  padding: 60px 0;
  background-color: #f8f9fa;
}

.service-item {
  text-align: center;
  padding: 30px;
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
}

/* 成功案例 */
.cases {
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

/* 新闻资讯 */
.news {
  padding: 60px 0;
  background-color: #f8f9fa;
}

.news-container {
  display: flex;
  gap: 30px;
}

.news-main {
  flex: 2;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}

.news-sidebar {
  flex: 1;
}

.news-item {
  display: flex;
  margin-bottom: 25px;
  padding-bottom: 25px;
  border-bottom: 1px solid #eee;
}

.news-date {
  width: 70px;
  text-align: center;
  margin-right: 20px;
  background: #f8f9fa;
  border-radius: 4px;
  padding: 10px;
}

.news-date .day {
  font-size: 30px;
  font-weight: bold;
  color: #e60012;
  line-height: 1;
}

.news-date .month {
  font-size: 14px;
  color: #7f8c8d;
}

.news-content h3 {
  font-size: 18px;
  margin-bottom: 10px;
}

.news-content p {
  color: #7f8c8d;
  font-size: 14px;
  line-height: 1.6;
}

.news-links {
  padding: 25px;
}

.news-links h3 {
  font-size: 20px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
  color: #2c3e50;
}

.news-links ul li {
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px dashed #eee;
}

.news-links ul li:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.news-links ul li a {
  display: flex;
  justify-content: space-between;
  color: #7f8c8d;
  transition: color 0.3s;
}

.news-links ul li a:hover {
  color: #e60012;
}

.news-links ul li a span {
  color: #999;
  font-size: 13px;
}

/* 合作伙伴 */
.partners {
  padding: 60px 0;
  background-color: #fff;
}

.partners-slider {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.partner-item {
  width: calc(16.666% - 17px);
  text-align: center;
  filter: grayscale(100%);
  opacity: 0.7;
  transition: all 0.3s;
}

.partner-item:hover {
  filter: grayscale(0);
  opacity: 1;
}

.partner-logo img,
.placeholder-img {
  max-width: 100%;
  height: 80px;
  object-fit: contain;
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  border-radius: 4px;
}

@media (max-width: 992px) {
  .about-content {
    flex-direction: column;
  }
  
  .news-container {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .banner {
    height: 400px;
  }
  
  .banner-content h2 {
    font-size: 32px;
  }
  
  .partner-item {
    width: calc(30% - 14px);
  }
}
</style>