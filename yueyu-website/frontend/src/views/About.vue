<template>
  <div class="page">
    <div class="container">
      <div class="section-title">
        <h2>关于我们</h2>
        <p>专业、可靠、高效的对外劳务合作服务商</p>
      </div>
      
      <div class="about-content">
        <div class="about-text">
          <h3>青岛悦途国际经济技术合作有限公司</h3>
          <p>公司成立于2020年1月，是经国家商务部批准的从事对外劳务合作的专业公司。公司拥有《对外劳务合作（外派劳务）经营资格证书》，致力于向全球各国派遣各类工程师、技术工人、医护人员及服务人员。</p>
          <p>自成立以来，公司已同澳大利亚、日本、新加坡、新西兰、加拿大、韩国等国家和地区的相关机构、公司、协会建立了长期稳定的合作关系。</p>
          <p>公司拥有一支经验丰富、专业素质高的团队，为外派人员提供全方位的服务，包括技能培训、语言培训、文化适应指导、签证办理、境外安置等一站式服务。</p>
          <div class="company-features">
            <div class="feature-item">
              <span class="feature-icon">📋</span>
              <div class="feature-text">
                <h4>资质齐全</h4>
                <p>拥有国家商务部颁发的对外劳务合作经营资格证书</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🤝</span>
              <div class="feature-text">
                <h4>经验丰富</h4>
                <p>多年国际劳务合作经验，成功派遣数千名技术人员</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🌍</span>
              <div class="feature-text">
                <h4>全球合作</h4>
                <p>与全球20多个国家和地区的企业建立合作关系</p>
              </div>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✅</span>
              <div class="feature-text">
                <h4>服务保障</h4>
                <p>提供全方位的境外就业服务和支持</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 公司位置地图 -->
      <section class="map-section">
        <div class="section-title">
          <h2>公司位置</h2>
          <p>欢迎来到我们的办公室，我们期待与您合作</p>
        </div>
        <div class="map-container">
          <div class="map-info">
            <div class="info-card">
              <h3>青岛悦途国际经济技术合作有限公司</h3>
              <div class="info-item">
                <span class="info-icon">📍</span>
                <span>山东省青岛市市北区敦化路379号中铁青岛广场A座1522室</span>
              </div>
              <div class="info-item">
                <span class="info-icon">📞</span>
                <span>0532-81978007</span>
              </div>
              <div class="info-item">
                <span class="info-icon">✉️</span>
                <span>syndicate_2008@yahoo.com</span>
              </div>
              <div class="info-item">
                <span class="info-icon">🕐</span>
                <span>周一至周五 9:00-18:00</span>
              </div>
            </div>
          </div>
          <div class="map-wrapper">
            <div id="amap-container" class="amap-container"></div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

const mapInstance = ref(null)

// 青岛悦途公司的位置
const companyLocation = {
  longitude: 120.3826,  // 经度
  latitude: 36.0671,    // 纬度
  address: '山东省青岛市市北区敦化路379号中铁青岛广场A座1522室'
}

const initMap = () => {
  try {
    // 创建地图实例
    mapInstance.value = new AMap.Map('amap-container', {
      zoom: 16,
      center: [companyLocation.longitude, companyLocation.latitude],
      mapStyle: 'amap://styles/normal', // 使用标准样式
      features: ['bg', 'road', 'building', 'point'],
      viewMode: '2D',
      resizeEnable: true,
      doubleClickZoom: true
    })

    // 添加控件
    mapInstance.value.addControl(new AMap.Scale())
    mapInstance.value.addControl(new AMap.ToolBar({
      position: 'RB'
    }))

    // 等待地图完全加载后再添加标记
    mapInstance.value.on('complete', () => {
      console.log('地图加载完成，添加标记')
      addMarker()
    })
    
    // 如果地图已经加载完成，直接添加标记
    if (mapInstance.value.getStatus() === 'complete') {
      addMarker()
    }

    console.log('高德地图初始化成功')

  } catch (error) {
    console.error('地图初始化失败:', error)
    // 显示地图加载失败的提示
    showMapError()
  }
}

const addMarker = () => {
  try {
    // 创建公司位置标记
    const marker = new AMap.Marker({
      position: [companyLocation.longitude, companyLocation.latitude],
      title: '青岛悦途国际经济技术合作有限公司',
      content: createMarkerContent(),
      offset: new AMap.Pixel(-15, -30)
    })

    // 将标记添加到地图
    mapInstance.value.add(marker)

    // 创建信息窗体
    const infoWindow = new AMap.InfoWindow({
      content: createInfoWindowContent(),
      offset: new AMap.Pixel(0, -30)
    })

    // 点击标记时显示信息窗体
    marker.on('click', () => {
      infoWindow.open(mapInstance.value, marker.getPosition())
    })

    console.log('标记添加成功');

  } catch (error) {
    console.error('添加标记失败:', error);
  }
}

const createMarkerContent = () => {
  const div = document.createElement('div')
  div.className = 'custom-marker'
  div.innerHTML = `
    <div class="marker-icon">
      <svg viewBox="0 0 24 24" width="24" height="24">
        <path fill="#e60012" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    </div>
  `
  return div
}

const createInfoWindowContent = () => {
  return `
    <div class="info-window">
      <h4>青岛悦途国际经济技术合作有限公司</h4>
      <p>📍 ${companyLocation.address}</p>
      <p>📞 0532-81978007</p>
      <p>✉️ syndicate_2008@yahoo.com</p>
      <p>🕐 周一至周五 9:00-18:00</p>
    </div>
  `
}

const showMapError = () => {
  const container = document.getElementById('amap-container')
  if (container) {
    container.innerHTML = `
      <div class="map-error">
        <h3>地图加载失败</h3>
        <p>地图服务暂时无法使用，请直接联系：</p>
        <p>📍 ${companyLocation.address}</p>
        <p>📞 0532-81978007</p>
      </div>
    `
  }
}

const loadAMapScript = () => {
  return new Promise((resolve, reject) => {
    if (window.AMap) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = 'https://webapi.amap.com/maps?v=2.0&key=30fd6c74d4d53149e32ec858e245c2b9&plugin=AMap.Scale,AMap.ToolBar,AMap.Marker,AMap.InfoWindow'
    script.async = true

    script.onload = () => {
      // 等待高德地图API完全加载
      setTimeout(() => {
        if (window.AMap) {
          resolve()
        } else {
          reject(new Error('高德地图API加载失败'))
        }
      }, 500)
    }

    script.onerror = () => {
      reject(new Error('高德地图脚本加载失败'))
    }

    document.head.appendChild(script)
  })
}

onMounted(async () => {
  try {
    // 加载高德地图脚本
    await loadAMapScript()
    
    // 初始化地图
    setTimeout(() => {
      initMap()
    }, 100)
  } catch (error) {
    console.error('地图加载错误:', error)
    showMapError()
  }
})

onUnmounted(() => {
  // 清理地图实例
  if (mapInstance.value) {
    mapInstance.value.destroy()
    mapInstance.value = null
  }
})
</script>

<style scoped>
.page {
  padding: 60px 0;
  background-color: #fff;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
}

.about-text h3 {
  font-size: 28px;
  color: #2c3e50;
  margin-bottom: 30px;
  text-align: center;
}

.about-text p {
  font-size: 16px;
  line-height: 1.8;
  margin-bottom: 20px;
  color: #555;
}

.company-features {
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
}

.feature-item {
  display: flex;
  align-items: flex-start;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.feature-icon {
  font-size: 32px;
  margin-right: 15px;
  margin-top: 5px;
}

.feature-text h4 {
  font-size: 18px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.feature-text p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .company-features {
    grid-template-columns: 1fr;
  }
}

/* 地图部分样式 */
.map-section {
  padding: 60px 0;
  background-color: #f8f9fa;
}

.map-container {
  display: flex;
  gap: 30px;
  align-items: flex-start;
  max-width: 1200px;
  margin: 0 auto;
}

.map-info {
  flex: 1;
  min-width: 300px;
}

.map-wrapper {
  flex: 2;
  min-width: 400px;
}

.info-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #e60012;
}

.info-card h3 {
  font-size: 20px;
  color: #2c3e50;
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  gap: 10px;
}

.info-icon {
  font-size: 16px;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.amap-container {
  width: 100%;
  height: 450px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #f0f0f0;
}

/* 自定义标记样式 */
.custom-marker {
  background: white;
  border-radius: 50%;
  border: 2px solid #e60012;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 信息窗体样式 */
.info-window {
  padding: 15px;
  min-width: 250px;
}

.info-window h4 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 16px;
}

.info-window p {
  margin: 5px 0;
  font-size: 14px;
  color: #555;
}

/* 地图错误提示 */
.map-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  color: #666;
}

.map-error h3 {
  color: #e60012;
  margin-bottom: 10px;
}

.map-error p {
  margin: 5px 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .map-container {
    flex-direction: column;
  }
  
  .map-wrapper {
    width: 100%;
    min-width: auto;
  }
  
  .amap-container {
    height: 350px;
  }
}
</style>