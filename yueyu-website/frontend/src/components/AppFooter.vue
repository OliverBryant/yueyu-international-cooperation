<template>
  <footer>
    <div class="container">
      <div class="footer-content">
        <div class="footer-column">
          <h3>关于我们</h3>
          <ul>
            <li><router-link to="/about">公司简介</router-link></li>
            <li><a href="#">发展历程</a></li>
            <li><a href="#">企业文化</a></li>
            <li><a href="#">资质荣誉</a></li>
            <li><router-link to="/contact">联系我们</router-link></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>服务项目</h3>
          <ul>
            <li><router-link to="/services">对外劳务合作</router-link></li>
            <li><router-link to="/services">技能人才派遣</router-link></li>
            <li><router-link to="/services">出国培训服务</router-link></li>
            <li><router-link to="/services">签证及手续办理</router-link></li>
            <li><router-link to="/services">人力资源咨询</router-link></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>成功案例</h3>
          <ul>
            <li><router-link to="/cases?country=澳大利亚">澳大利亚项目</router-link></li>
            <li><router-link to="/cases?country=日本">日本项目</router-link></li>
            <li><router-link to="/cases?country=新加坡">新加坡项目</router-link></li>
            <li><router-link to="/cases?country=加拿大">加拿大项目</router-link></li>
            <li><router-link to="/cases?country=新西兰">新西兰项目</router-link></li>
          </ul>
        </div>
        <div class="footer-column">
          <h3>联系我们</h3>
          <ul class="contact-info">
            <li>
              <span>📍 地址：山东省青岛市市北区敦化路379号中铁青岛广场A座1522室</span>
            </li>
            <li>
              <span>📞 电话：0532-81978007</span>
            </li>
            <li>
              <span>✉️ 邮箱：syndicate_2008@yahoo.com</span>
            </li>
            <li>
              <span>🌐 网址：www.syndicate.cn</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <p>Copyright © 2025 青岛悦途国际经济技术合作有限公司 版权所有 | 鲁ICP备XXXXXXXX号</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
footer {
  background-color: #2c3e50;
  color: #ecf0f1;
  padding: 50px 0 20px;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 40px;
}

.footer-column h3 {
  font-size: 18px;
  margin-bottom: 20px;
  color: #fff;
  position: relative;
  padding-bottom: 10px;
}

.footer-column h3::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 40px;
  height: 2px;
  background-color: #e60012;
}

.footer-column ul li {
  margin-bottom: 10px;
}

.footer-column ul li a {
  color: #bdc3c7;
  transition: color 0.3s;
}

.footer-column ul li a:hover {
  color: #e60012;
}

.contact-info li {
  display: flex;
  margin-bottom: 15px;
  color: #bdc3c7;
}

.footer-bottom {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #34495e;
  color: #95a5a6;
  font-size: 14px;
}

@media (max-width: 992px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
  }
}
</style>