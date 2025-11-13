-- 重命名服务项目表为工作项目表
-- 方案1：重命名现有表（推荐，保持数据完整性）
ALTER TABLE services RENAME TO jobs;

-- 更新字段注释，使其更符合工作项目的语义
ALTER TABLE jobs 
  MODIFY COLUMN title VARCHAR(100) NOT NULL COMMENT '工作职位',
  MODIFY COLUMN description TEXT NOT NULL COMMENT '职位描述',
  MODIFY COLUMN icon VARCHAR(50) DEFAULT '' COMMENT '职位图标',
  MODIFY COLUMN image VARCHAR(255) DEFAULT '' COMMENT '职位图片',
  MODIFY COLUMN status TINYINT DEFAULT 1 COMMENT '状态：1=招聘中，0=已结束',
  MODIFY COLUMN sort_order INT DEFAULT 0 COMMENT '排序值，越小越靠前';

-- 添加新字段以更好地支持工作项目管理
ALTER TABLE jobs 
  ADD COLUMN country VARCHAR(50) DEFAULT '' COMMENT '工作国家' AFTER icon,
  ADD COLUMN salary VARCHAR(100) DEFAULT '' COMMENT '薪资范围' AFTER country,
  ADD COLUMN requirements TEXT NULL COMMENT '任职要求' AFTER description,
  ADD COLUMN benefits VARCHAR(255) DEFAULT '' COMMENT '福利待遇' AFTER salary;

-- 为新字段添加索引
ALTER TABLE jobs ADD INDEX idx_country (country);

-- 更新表注释
ALTER TABLE jobs COMMENT='工作项目表';