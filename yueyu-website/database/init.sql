-- 青岛悦途国际经济技术合作有限公司网站数据库
-- 创建数据库
CREATE DATABASE IF NOT EXISTS yueyu_website CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE yueyu_website;

-- 联系我们表单数据表
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL COMMENT '姓名',
    phone VARCHAR(30) NOT NULL COMMENT '电话',
    wechat VARCHAR(50) NULL COMMENT '微信号',
    message TEXT NOT NULL COMMENT '留言内容',
    submit_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '提交时间',
    ip VARCHAR(45) NULL COMMENT 'IP地址',
    user_agent VARCHAR(255) NULL COMMENT '用户代理',
    is_valid TINYINT(1) DEFAULT 1 COMMENT '是否有效',
    INDEX idx_phone (phone),
    INDEX idx_submit_time (submit_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='联系我们表单数据';

-- 服务项目表
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL COMMENT '服务标题',
    description TEXT COMMENT '服务描述',
    icon VARCHAR(100) NULL COMMENT '图标',
    image VARCHAR(255) NULL COMMENT '图片',
    content TEXT NULL COMMENT '详细内容',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT(1) DEFAULT 1 COMMENT '状态：1显示，0隐藏',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服务项目';

-- 成功案例表
CREATE TABLE cases (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL COMMENT '案例标题',
    description TEXT COMMENT '案例描述',
    country VARCHAR(50) NOT NULL COMMENT '国家',
    image VARCHAR(255) NULL COMMENT '图片',
    content TEXT NULL COMMENT '详细内容',
    employer VARCHAR(100) NULL COMMENT '雇主',
    result TEXT NULL COMMENT '成果',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT(1) DEFAULT 1 COMMENT '状态：1显示，0隐藏',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='成功案例';

-- 新闻资讯表
CREATE TABLE news (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '新闻标题',
    summary TEXT COMMENT '摘要',
    content TEXT NULL COMMENT '详细内容',
    image VARCHAR(255) NULL COMMENT '图片',
    publish_date DATE NOT NULL COMMENT '发布日期',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT(1) DEFAULT 1 COMMENT '状态：1显示，0隐藏',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_publish_date (publish_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='新闻资讯';

-- 出国指南表
CREATE TABLE guides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL COMMENT '指南标题',
    content TEXT NULL COMMENT '详细内容',
    category VARCHAR(50) NULL COMMENT '分类',
    file_url VARCHAR(255) NULL COMMENT '下载文件URL',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT(1) DEFAULT 1 COMMENT '状态：1显示，0隐藏',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='出国指南';

-- 合作伙伴表
CREATE TABLE partners (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT '伙伴名称',
    logo VARCHAR(255) NULL COMMENT 'Logo图片',
    website VARCHAR(255) NULL COMMENT '网站链接',
    description TEXT NULL COMMENT '描述',
    sort_order INT DEFAULT 0 COMMENT '排序',
    status TINYINT(1) DEFAULT 1 COMMENT '状态：1显示，0隐藏',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='合作伙伴';

-- 管理员表
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码（加密）',
    email VARCHAR(100) NULL COMMENT '邮箱',
    role VARCHAR(20) DEFAULT 'admin' COMMENT '角色',
    status TINYINT(1) DEFAULT 1 COMMENT '状态：1启用，0禁用',
    last_login DATETIME NULL COMMENT '最后登录时间',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员';

-- 插入初始数据

-- 服务项目初始数据
INSERT INTO services (title, description, icon, content) VALUES
('对外劳务合作', '向境外派遣各类工程师、技术工人、医护人员及服务人员，涵盖多个行业和领域', '🌍', '提供全方位的对外劳务合作服务，包括人员招聘、培训、派遣等一站式服务。'),
('技能人才派遣', '专业派遣厨师、护理人员、酒店服务人员、建筑工人等各类技能人才', '👨‍🍳', '根据企业需求，精准匹配各类技能人才，确保人员素质和专业技能符合要求。'),
('出国培训服务', '提供语言培训、技能培训、文化适应培训等全方位出国前培训服务', '🎓', '专业的培训团队，提供系统的出国前培训，帮助外派人员快速适应国外工作和生活。'),
('签证及手续办理', '专业办理工作签证、护照及其他相关出国手续，确保流程顺利', '📝', '经验丰富的签证团队，提供专业的签证指导和服务，确保手续办理顺利高效。'),
('人力资源咨询', '为企业和个人提供专业的人力资源咨询服务，包括职业规划、跨国就业指导等', '🏢', '专业的人力资源顾问，提供个性化的职业发展规划和跨国就业指导服务。'),
('境外就业安置', '提供境外工作安排、接机、住宿安排等一站式境外就业安置服务', '✈️', '完善的境外安置服务，从工作安排到生活服务，全方位保障外派人员权益。');

-- 成功案例初始数据
INSERT INTO cases (title, description, country, content, employer, result) VALUES
('澳大利亚厨师派遣项目', '成功向澳大利亚多家星级酒店和餐厅派遣中餐厨师，获得雇主一致好评', '澳大利亚', '项目历时2年，共派遣厨师50余人，全部获得雇主好评', '澳大利亚星级酒店协会', '客户满意度100%，续签率90%'),
('日本技术研修生项目', '与日本多家企业合作，派遣制造业技术工人，促进中日技术交流', '日本', '与日本20多家制造业企业建立合作关系，派遣技术工人100余人', '日本制造业联合会', '技术交流成果显著，人员留存率95%'),
('新加坡医护人才派遣', '向新加坡多家医疗机构派遣护理人员，填补当地医护人力缺口', '新加坡', '为新加坡医疗机构派遣专业护理人员200余人', '新加坡卫生部', '人员专业素质获得认可，派遣规模持续扩大');

-- 新闻资讯初始数据
INSERT INTO news (title, summary, content, publish_date) VALUES
('公司荣获"2023年度对外劳务合作优秀企业"称号', '在近日举行的全国对外劳务合作行业评选中，我公司凭借良好的信誉和专业的服务，荣获"2023年度对外劳务合作优秀企业"称号', '详细新闻内容...', '2023-10-15'),
('澳大利亚482签证项目说明会成功举办', '上周六，我公司在总部成功举办了澳大利亚482工作签证项目说明会，吸引了近百名有意向赴澳工作的技术人员参加', '详细新闻内容...', '2023-09-28'),
('日本技能实习项目新增合作企业', '近日，我公司与日本多家制造业企业达成合作，新增200个技能实习名额，涵盖机械加工、电子装配等多个工种', '详细新闻内容...', '2023-09-05');

-- 出国指南初始数据
INSERT INTO guides (title, content, category) VALUES
('澳大利亚工作签证申请流程', '详细的澳大利亚工作签证申请指南...', '签证指南'),
('日本技能实习制度详解', '日本技能实习制度的全面介绍...', '政策解读'),
('新加坡就业环境与薪资水平', '新加坡就业市场分析和薪资水平...', '就业指导'),
('出国前培训的重要性', '出国前培训的内容和意义...', '培训指南'),
('海外工作适应指南', '如何快速适应海外工作和生活...', '生活指南');

-- 合作伙伴初始数据
INSERT INTO partners (name, website, description) VALUES
('澳大利亚劳工部', 'https://australia.gov.au', '澳大利亚官方劳工合作机构'),
('日本国际合作机构', 'https://www.jica.go.jp', '日本官方国际合作机构'),
('新加坡人力部', 'https://www.mom.gov.sg', '新加坡人力资源管理部门'),
('加拿大就业与社会发展部', 'https://www.canada.ca', '加拿大就业服务官方机构');

-- 管理员初始数据（密码：admin123，需要加密）
INSERT INTO admins (username, password, email, role) VALUES
('admin', '$2b$10$K7mFL3IY4F7I9Q5Q4Q2Q7O5Q6Q3Q9Q4Q2Q7O5Q6Q3Q9Q4Q2Q7O5Q', 'admin@yueyu.com', 'super_admin');