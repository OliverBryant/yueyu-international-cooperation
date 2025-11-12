<template>
  <header>
    <div class="header-top">
      <div class="container">
        <div class="header-content">
          <div class="logo">
            <img src="/58db86718fde7480122be78fab5fb182.png" alt="青岛悦途国际" style="height: 50px; margin-right: 10px;">
            <div class="logo-text">
              <h1>青岛悦途国际经济技术合作有限公司</h1>
              <span>Qingdao Syndicate International Economic & Technical Cooperation Co., Ltd.</span>
            </div>
          </div>
          <div class="header-contact">
            <div class="phone">0532-81978007</div>
            <div class="email">syndicate_2008@yahoo.com</div>
          </div>
        </div>
      </div>
    </div>
    <nav>
      <div class="container">
        <ul>
          <li><router-link to="/" :class="{ active: $route.name === 'Home' }">首页</router-link></li>
          <li><router-link to="/about" :class="{ active: $route.name === 'About' }">关于我们</router-link></li>
          <li><router-link to="/services" :class="{ active: $route.name === 'Services' }">服务项目</router-link></li>
          <li><router-link to="/cases" :class="{ active: $route.name === 'Cases' }">成功案例</router-link></li>
          <li><router-link to="/news" :class="{ active: $route.name === 'News' }">新闻资讯</router-link></li>
          <li><router-link to="/guides" :class="{ active: $route.name === 'Guides' }">出国指南</router-link></li>
          <li><router-link to="/partners" :class="{ active: $route.name === 'Partners' }">合作伙伴</router-link></li>
          <li><router-link to="/contact" :class="{ active: $route.name === 'Contact' }">联系我们</router-link></li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script setup>
</script>

<style scoped>
header {
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-top {
  padding: 15px 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
}

.logo img {
  height: 50px;
  margin-right: 10px;
}

.logo h1 {
  font-size: 24px;
  color: #2c3e50;
  margin: 0;
}

.logo span {
  font-size: 14px;
  color: #7f8c8d;
  margin-left: 5px;
}

.header-contact {
  text-align: right;
}

.header-contact .phone {
  font-size: 20px;
  font-weight: bold;
  color: #e60012;
}

.header-contact .email {
  font-size: 14px;
  color: #7f8c8d;
}

nav {
  background: linear-gradient(135deg, #324D52 0%, #2b2b2b 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

nav ul {
  display: flex;
  margin: 0;
  padding: 0;
}

nav ul li {
  position: relative;
}

nav ul li a {
  display: block;
  padding: 15px 25px;
  color: #ffffff;
  font-size: 16px;
  transition: all 0.3s ease;
  position: relative;
  font-weight: 500;
}

nav ul li a::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 3px;
  background: linear-gradient(135deg, #1b53f2 0%, #076ce0 100%);
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

nav ul li a:hover,
nav ul li a.active {
  color: #5EC5FD;
}

nav ul li a:hover::before,
nav ul li a.active::before {
  width: 80%;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .header-contact {
    margin-top: 15px;
    text-align: center;
  }

  nav ul {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>