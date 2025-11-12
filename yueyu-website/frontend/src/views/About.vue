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
          <p>自成立以来，公司已同澳大利亚、日本、新加坡、新西兰、加拿大、韩国、俄罗斯等国家和地区的相关机构、公司、协会建立了长期稳定的合作关系。</p>
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
    </div>
  </div>
</template>

<script setup>
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
</style>