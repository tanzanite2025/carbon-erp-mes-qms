# Carbon 项目 ERP 与 MES 架构分析

## 📊 核心结论

**ERP 和 MES 共享同一个数据库，数据是完全互通的！**

---

## 🏗️ 架构设计

### 1. 统一数据库架构

Carbon 采用 **单一数据库 + 多应用前端** 的架构：

```
┌─────────────────────────────────────────────────────┐
│                  Supabase PostgreSQL                │
│              (统一的数据库实例)                      │
│                                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │  公司 (company)                              │  │
│  │  用户 (user)                                 │  │
│  │  权限 (permissions)                          │  │
│  │  零件 (parts)                                │  │
│  │  订单 (sales_order, purchase_order)          │  │
│  │  生产任务 (jobs)                             │  │
│  │  工序 (job_operations)                       │  │
│  │  库存 (inventory)                            │  │
│  │  质量 (quality, ncr)                         │  │
│  │  设备 (equipment)                            │  │
│  │  ... 所有业务数据 ...                        │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
           ↑                           ↑
           │                           │
    ┌──────┴──────┐           ┌───────┴────────┐
    │  ERP 应用   │           │   MES 应用     │
    │             │           │                │
    │ - 销售管理  │           │ - 生产执行     │
    │ - 采购管理  │           │ - 工序追踪     │
    │ - 库存管理  │           │ - 质量控制     │
    │ - 财务管理  │           │ - 设备监控     │
    │ - 报价管理  │           │ - 实时数据     │
    └─────────────┘           └────────────────┘
```

### 2. 多租户架构

```sql
-- 核心表结构
CREATE TABLE "company" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  ...
);

CREATE TABLE "user" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL,
  ...
);

CREATE TABLE "userToCompany" (
  "userId" TEXT REFERENCES "user",
  "companyId" TEXT REFERENCES "company",
  "role" ENUM('customer', 'employee', 'supplier'),
  PRIMARY KEY ("userId", "companyId")
);
```

**关键特性**：
- ✅ 每个公司的数据通过 `companyId` 隔离
- ✅ 使用 Row-Level Security (RLS) 确保数据安全
- ✅ 用户可以属于多个公司，扮演不同角色
- ✅ 所有业务表都包含 `companyId` 字段

---

## 🔗 数据互通机制

### 1. 共享数据模型

ERP 和 MES 访问**完全相同的数据表**：

| 数据类型 | 表名 | ERP 使用 | MES 使用 |
|---------|------|---------|---------|
| 生产任务 | `job` | ✅ 创建、查看 | ✅ 执行、更新 |
| 工序 | `jobOperation` | ✅ 规划 | ✅ 执行、记录 |
| 零件 | `part` | ✅ 管理、报价 | ✅ 查看、追踪 |
| 库存 | `itemLedger` | ✅ 管理、调整 | ✅ 消耗、产出 |
| 订单 | `salesOrder` | ✅ 创建、管理 | ✅ 查看、关联 |
| 质量 | `nonConformanceReport` | ✅ 查看、审批 | ✅ 创建、处理 |
| 设备 | `equipment` | ✅ 管理、维护 | ✅ 使用、监控 |

### 2. 实时数据同步

使用 **Supabase Realtime** 实现实时数据同步：

```typescript
// ERP 创建生产任务
const { data } = await supabase
  .from('job')
  .insert({ ... });

// MES 立即收到更新（通过 Realtime 订阅）
supabase
  .channel('jobs')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'job' },
    (payload) => {
      // MES 界面自动更新
    }
  )
  .subscribe();
```

### 3. 统一 API

两个应用使用**相同的 Supabase API**：

```typescript
// packages/database/src/client.ts
export const getSupabaseClient = () => {
  return createClient<Database>(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );
};

// ERP 和 MES 都使用这个客户端
import { getSupabaseClient } from '@carbon/database/client';
```

---

## 🎯 应用职责划分

### ERP 应用 (apps/erp)

**核心功能**：
- 📋 **销售管理** - 报价、订单、客户关系
- 🛒 **采购管理** - 采购订单、供应商管理
- 📦 **库存管理** - 库存调整、转移、盘点
- 💰 **财务管理** - 发票、付款、账目
- 🏭 **生产计划** - 创建生产任务、排程
- 📊 **报表分析** - 业务报表、KPI

**用户角色**：
- 销售人员
- 采购人员
- 仓库管理员
- 财务人员
- 生产计划员
- 管理层

### MES 应用 (apps/mes)

**核心功能**：
- ⚙️ **生产执行** - 工序开始/完成、实时进度
- 📝 **工序追踪** - 记录工时、材料消耗
- ✅ **质量控制** - 检验、不合格品处理
- 🔧 **设备监控** - 设备状态、维护记录
- 📊 **实时看板** - 生产状态可视化
- 🏷️ **追溯管理** - 批次追踪、序列号

**用户角色**：
- 车间操作员
- 质检员
- 设备维护人员
- 车间主管
- 生产调度员

---

## 🔄 典型业务流程

### 示例：从订单到生产

```
1. ERP - 销售人员创建销售订单
   ↓ (写入 salesOrder 表)
   
2. ERP - 生产计划员创建生产任务
   ↓ (写入 job 表)
   
3. MES - 车间操作员看到新任务
   ↓ (从 job 表读取)
   
4. MES - 开始工序，记录进度
   ↓ (更新 jobOperation 表)
   
5. ERP - 管理层查看生产进度
   ↓ (从 jobOperation 表读取)
   
6. MES - 完成生产，入库
   ↓ (更新 job 状态，写入 itemLedger)
   
7. ERP - 仓库看到新库存
   ↓ (从 itemLedger 读取)
   
8. ERP - 发货给客户
   ↓ (更新 salesOrder，创建 shipment)
```

**关键点**：
- ✅ 所有步骤操作同一个数据库
- ✅ 数据实时同步，无需导入/导出
- ✅ 完整的业务追溯链

---

## 📁 代码组织

### 共享包 (packages/)

```
packages/
├── database/          # 数据库模型、迁移、类型
│   ├── supabase/
│   │   └── migrations/  # 所有数据库迁移
│   └── src/
│       ├── types.ts     # 自动生成的类型定义
│       └── client.ts    # Supabase 客户端
│
├── react/             # 共享 UI 组件
├── form/              # 共享表单组件
├── locale/            # 国际化翻译
└── utils/             # 工具函数
```

### 应用特定代码

```
apps/
├── erp/
│   └── app/
│       ├── routes/
│       │   ├── x.sales/      # 销售模块
│       │   ├── x.purchasing/ # 采购模块
│       │   ├── x.inventory/  # 库存模块
│       │   └── x.accounting/ # 财务模块
│       └── ...
│
└── mes/
    └── app/
        ├── routes/
        │   ├── x.production/  # 生产执行
        │   ├── x.quality/     # 质量控制
        │   └── x.equipment/   # 设备管理
        └── ...
```

---

## 🔐 权限控制

### Row-Level Security (RLS)

```sql
-- 示例：job 表的 RLS 策略
CREATE POLICY "Users can view jobs in their company"
ON "job"
FOR SELECT
USING (
  "companyId" IN (
    SELECT "companyId" 
    FROM "userToCompany" 
    WHERE "userId" = auth.uid()
  )
);
```

**特性**：
- ✅ 数据库级别的安全控制
- ✅ 自动过滤不同公司的数据
- ✅ ERP 和 MES 使用相同的权限规则
- ✅ 支持细粒度的 ABAC (Attribute-Based Access Control)

---

## 📊 数据库统计

根据迁移文件分析：

- **总迁移文件数**: 500+ 个
- **核心业务表**: 100+ 个
- **支持的模块**:
  - ✅ ERP (销售、采购、库存、财务)
  - ✅ MES (生产执行、质量、设备)
  - ✅ QMS (质量管理系统)
  - ✅ 追溯系统
  - ✅ 配置器
  - ✅ MRP (物料需求计划)
  - ✅ 维护管理
  - ✅ 培训管理
  - ✅ 风险管理

---

## 🎨 UI 差异

虽然共享数据，但 UI 针对不同用户优化：

### ERP UI
- 📊 **表格为主** - 适合办公室工作
- 🖱️ **鼠标操作** - 复杂的表单和筛选
- 📈 **报表丰富** - 图表、分析、导出
- 🎯 **功能全面** - 完整的业务流程

### MES UI
- 📱 **卡片为主** - 适合车间环境
- 👆 **触摸友好** - 大按钮、简化操作
- ⏱️ **实时更新** - 动态刷新、状态指示
- 🎯 **聚焦执行** - 快速录入、扫码支持

---

## 🚀 技术优势

### 1. 数据一致性
- ✅ 单一数据源，无需同步
- ✅ 实时更新，无延迟
- ✅ 事务一致性保证

### 2. 开发效率
- ✅ 共享数据模型和类型
- ✅ 统一的 API 和工具
- ✅ 代码复用率高

### 3. 扩展性
- ✅ 易于添加新模块
- ✅ 支持多租户
- ✅ 水平扩展能力强

### 4. 维护性
- ✅ 统一的数据库迁移
- ✅ 集中的权限管理
- ✅ 简化的部署流程

---

## 📝 总结

### 核心特点

1. **统一数据库** 
   - ERP 和 MES 共享同一个 PostgreSQL 数据库
   - 所有数据实时互通，无需同步

2. **多应用架构**
   - 不同的前端应用服务不同的用户群体
   - 相同的后端 API 和数据模型

3. **多租户设计**
   - 通过 `companyId` 隔离不同公司数据
   - RLS 确保数据安全

4. **实时同步**
   - Supabase Realtime 提供实时数据推送
   - ERP 和 MES 之间数据变化立即可见

5. **模块化设计**
   - 共享的核心包 (database, react, utils)
   - 独立的应用代码 (erp, mes)

### 业务价值

- ✅ **无缝集成** - ERP 和 MES 天然集成，无需接口
- ✅ **实时可见** - 生产数据实时反馈到 ERP
- ✅ **完整追溯** - 从订单到生产到发货全程可追溯
- ✅ **灵活扩展** - 易于添加新功能和模块
- ✅ **降低成本** - 单一系统，降低维护成本

---

## 🎯 结论

**Carbon 的 ERP 和 MES 不是分离的系统，而是同一个系统的不同视图！**

它们：
- ✅ 共享同一个数据库
- ✅ 使用相同的数据模型
- ✅ 通过相同的 API 访问数据
- ✅ 数据完全互通，实时同步
- ✅ 只是针对不同用户场景优化了 UI

这种设计提供了：
- 🎯 **最佳的数据一致性**
- 🎯 **最高的开发效率**
- 🎯 **最强的系统集成度**
- 🎯 **最低的维护成本**

这就是现代化的 **统一制造管理平台** 的架构！🚀
