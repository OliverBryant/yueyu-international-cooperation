<template>
  <div>
    <!-- 轮播图 -->
    <section class="banner animate-on-scroll">
      <div class="banner-slide" style="background: linear-gradient(135deg, #1b53f2 0%, #076ce0 100%);">
        <div class="banner-content">
          <h2 class="animate-on-scroll">专业国际劳务合作服务</h2>
          <p class="animate-on-scroll">成立于2020年，致力于向全球多个国家和地区派遣各类技术人员和服务人员</p>
          <el-button type="primary" size="large" @click="$router.push('/about')" class="animate-on-scroll">
            了解更多
          </el-button>
        </div>
      </div>
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
            <p>自成立以来，公司已同澳大利亚、日本、新加坡、新西兰、加拿大、韩国、俄罗斯等国家和地区的相关机构、公司、协会建立了长期稳定的合作关系。</p>
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
              <ul>
                <li v-for="guide in guides" :key="guide.id">
                  <router-link :to="'/guides'">
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
import { getServices, getCases, getNews, getGuides, getPartners } from '../api'
import dayjs from 'dayjs'

const services = ref([])
const cases = ref([])
const news = ref([])
const guides = ref([])
const partners = ref([])
const currentFilter = ref('全部')

const filterCountries = ['全部', '澳大利亚', '日本', '新加坡', '新西兰', '加拿大', '俄罗斯']

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

const loadData = async () => {
  try {
    const [servicesRes, casesRes, newsRes, guidesRes, partnersRes] = await Promise.all([
      getServices(),
      getCases(),
      getNews(),
      getGuides(),
      getPartners()
    ])
    
    services.value = servicesRes.data.slice(0, 6)
    cases.value = casesRes.data
    news.value = newsRes.data.slice(0, 3)
    guides.value = guidesRes.data.slice(0, 5)
    partners.value = partnersRes.data
    
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
  position: relative;
}

.banner-slide::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.05"><polygon points="30 30 0 0 60 0"/></g></svg>');
  animation: slideUp 20s linear infinite;
}

@keyframes slideUp {
  0% { transform: translateY(100%); }
  100% { transform: translateY(-100%); }
}

.banner-content {
  width: 1200px;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 15px;
  color: #fff;
  position: relative;
  z-index: 2;
}

.banner-content h2 {
  font-size: 48px;
  margin-bottom: 25px;
  font-weight: 700;
  animation: fadeInUp 1s ease 0.2s both;
  text-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.banner-content p {
  font-size: 20px;
  margin-bottom: 35px;
  max-width: 700px;
  line-height: 1.6;
  animation: fadeInUp 1s ease 0.4s both;
  text-shadow: 0 1px 5px rgba(0,0,0,0.2);
  color: rgba(255,255,255,0.9);
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