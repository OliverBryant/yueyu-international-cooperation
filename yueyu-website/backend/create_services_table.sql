-- 创建服务项目表
CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL COMMENT '服务标题',
  description TEXT NOT NULL COMMENT '服务描述',
  icon VARCHAR(50) DEFAULT '' COMMENT '图标',
  image VARCHAR(255) DEFAULT '' COMMENT '图片地址',
  status TINYINT DEFAULT 1 COMMENT '状态：1=启用，0=禁用',
  sort_order INT DEFAULT 0 COMMENT '排序值，越小越靠前',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='服务项目表';

-- 插入一些示例数据
INSERT INTO services (title, description, icon, sort_order) VALUES
('技术工人派遣', '向建筑、制造等行业派遣各类技术工人，包括电工、焊工、机械操作工等', '🔧', 1),
('医护人员派遣', '向医疗机构派遣护士、护理员、医疗助理等专业医护人员', '🏥', 2),
('服务人员派遣', '向酒店、餐饮、零售等服务行业派遣优秀服务人员', '🍽️', 3),
('工程师派遣', '向各行业派遣专业工程师，包括软件工程师、机械工程师等', '💻', 4),
('语言培训', '提供专业的语言培训服务，帮助外派人员快速适应当地语言环境', '📚', 5),
('技能培训', '提供专业技能提升培训，确保外派人员具备岗位所需的职业技能', '⚡', 6);