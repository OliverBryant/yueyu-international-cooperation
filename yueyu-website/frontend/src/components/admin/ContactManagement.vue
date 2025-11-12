<template>
  <div>
    <!-- 顶部工具栏 -->
    <div class="admin-toolbar">
      <div class="toolbar-left">
        <h1>联系表单管理</h1>
        <el-tag type="info">共 {{ pagination.total }} 条记录</el-tag>
      </div>
      <div class="toolbar-right">
        <el-button type="success" @click="$emit('exportData')" :loading="exporting" plain>
          <el-icon><Download /></el-icon>
          导出Excel
        </el-button>
        <el-button @click="$router.push('/')" plain>
          <el-icon><View /></el-icon>
          预览网站
        </el-button>
      </div>
    </div>

    <!-- 数据统计卡片 -->
    <div class="stats-cards">
      <div class="stat-card">
        <div class="stat-icon blue">
          <el-icon><User /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ pagination.total }}</div>
          <div class="stat-label">总咨询数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <el-icon><Calendar /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ todayCount }}</div>
          <div class="stat-label">今日咨询</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orange">
          <el-icon><Phone /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ phoneCount }}</div>
          <div class="stat-label">含手机号</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">
          <el-icon><ChatDotRound /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-number">{{ wechatCount }}</div>
          <div class="stat-label">含微信号</div>
        </div>
      </div>
    </div>

    <!-- 搜索筛选区 -->
    <div class="filter-section">
      <el-form :model="searchForm" inline>
        <el-form-item>
          <el-input
            v-model="searchForm.search"
            placeholder="搜索姓名或留言内容"
            clearable
            style="width: 250px"
            prefix-icon="Search"
            @change="$emit('loadData')"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="searchForm.phone"
            placeholder="手机号筛选"
            clearable
            style="width: 180px"
            prefix-icon="Phone"
            @change="$emit('loadData')"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            :model-value="dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
            style="width: 240px"
            @change="$emit('handleDateChange')"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="$emit('loadData')">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="$emit('resetSearch')">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <el-table
        :data="tableData"
        v-loading="loading"
        stripe
        size="large"
        @sort-change="$emit('handleSortChange')"
        empty-text="暂无数据"
      >
        <el-table-column prop="name" label="姓名" width="120" sortable>
          <template #default="scope">
            <el-tag size="small" type="primary">{{ scope.row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话" width="140" sortable>
          <template #default="scope">
            <span class="phone-number">{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="wechat" label="微信号" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.wechat" size="small" type="success">
              {{ scope.row.wechat }}
            </el-tag>
            <span v-else class="empty-value">--</span>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="留言内容" min-width="250">
          <template #default="scope">
            <el-popover placement="top" :width="300" trigger="hover">
              <template #reference>
                <div class="message-preview">{{ scope.row.message }}</div>
              </template>
              <div>{{ scope.row.message }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column 
          prop="submit_time" 
          label="提交时间" 
          width="160" 
          sortable="custom"
        >
          <template #default="scope">
            <div class="time-info">
              <div>{{ formatDate(scope.row.submit_time) }}</div>
              <small>{{ formatTime(scope.row.submit_time) }}</small>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="ip" label="IP" width="120">
          <template #default="scope">
            <el-tag v-if="scope.row.ip" size="small" type="info">
              {{ scope.row.ip }}
            </el-tag>
            <span v-else class="empty-value">--</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              @click="$emit('viewDetail', scope.row)"
            >
              详情
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="$emit('deleteRecord', scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="table-pagination">
        <el-pagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :page-sizes="[10, 25, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @size-change="$emit('handleSizeChange')"
          @current-change="$emit('handleCurrentChange')"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const exporting = ref(false)

const props = defineProps({
  tableData: Array,
  pagination: Object,
  loading: Boolean,
  dateRange: Array,
  searchForm: Object,
  todayCount: Number,
  phoneCount: Number,
  wechatCount: Number
})

const formatDate = (dateTime) => {
  return new Date(dateTime).toLocaleDateString('zh-CN')
}

const formatTime = (dateTime) => {
  return new Date(dateTime).toLocaleTimeString('zh-CN')
}

defineEmits([
  'loadData',
  'viewDetail', 
  'deleteRecord',
  'exportData',
  'resetSearch',
  'handleDateChange',
  'handleSortChange',
  'handleSizeChange',
  'handleCurrentChange'
])
</script>

<style scoped>
.admin-toolbar {
  background: white;
  border-radius: 12px;
  padding: 20px 25px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.toolbar-left h1 {
  margin: 0;
  font-size: 24px;
  color: #2c3e50;
  font-weight: 600;
}

.toolbar-right {
  display: flex;
  gap: 10px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s, box-shadow 0.3s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stat-icon.blue { background: linear-gradient(135deg, #1b53f2, #076ce0); }
.stat-icon.green { background: linear-gradient(135deg, #67c23a, #529b2e); }
.stat-icon.orange { background: linear-gradient(135deg, #e6a23c, #cf9236); }
.stat-icon.purple { background: linear-gradient(135deg, #9c27b0, #7b1fa2); }

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 5px;
}

.stat-label {
  color: #666;
  font-size: 14px;
}

.filter-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.table-section {
  background: white;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.phone-number {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #076ce0;
}

.empty-value {
  color: #c0c4cc;
  font-style: italic;
}

.message-preview {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  color: #606266;
}

.message-preview:hover {
  color: #076ce0;
}

.time-info {
  line-height: 1.4;
}

.time-info small {
  color: #999;
  font-size: 12px;
}

.table-pagination {
  margin-top: 20px;
  text-align: right;
}
</style>