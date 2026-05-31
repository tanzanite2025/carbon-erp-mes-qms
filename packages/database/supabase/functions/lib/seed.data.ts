/**
 * Shared seed data for company initialization
 * Used by both seed-dev.ts (Node.js) and seed-company edge function (Deno)
 *
 * This is the single source of truth for all seed data.
 */

export const dimensions = [
  { name: "库位", entityType: "Location" },
  { name: "部门", entityType: "Department" },
  { name: "员工", entityType: "Employee" },
  { name: "成本中心", entityType: "CostCenter" },
  { name: "物料过账组", entityType: "ItemPostingGroup" },
  { name: "客户类型", entityType: "CustomerType" },
  { name: "供应商类型", entityType: "SupplierType" },
  { name: "工作中心", entityType: "WorkCenter" },
  { name: "工艺路线", entityType: "Process" },
  { name: "资产类别", entityType: "FixedAssetClass" },
] as const;

export const supplierStatuses = [
  "启用",
  "禁用",
  "待审核",
  "已拒绝"
] as const;

export const customerStatuses = [
  "启用",
  "禁用",
  "意向客户/线索",
  "挂起/冻结",
  "已取消"
] as const;

export const scrapReasons = ["缺陷/次品", "损坏", "质量不合格"] as const;

export const paymentTerms = [
  {
    name: "15天内付款",
    daysDue: 15,
    calculationMethod: "Net",
    daysDiscount: 0,
    discountPercentage: 0,
    createdBy: "system"
  },
  {
    name: "30天内付款",
    daysDue: 30,
    calculationMethod: "Net",
    daysDiscount: 0,
    discountPercentage: 0,
    createdBy: "system"
  },
  {
    name: "60天内付款",
    daysDue: 60,
    calculationMethod: "Net",
    daysDiscount: 0,
    discountPercentage: 0,
    createdBy: "system"
  },
  {
    name: "10天内付款享1%折扣，30天内付款",
    daysDue: 30,
    calculationMethod: "Net",
    daysDiscount: 10,
    discountPercentage: 1,
    createdBy: "system"
  },
  {
    name: "10天内付款享2%折扣，30天内付款",
    daysDue: 30,
    calculationMethod: "Net",
    daysDiscount: 10,
    discountPercentage: 2,
    createdBy: "system"
  },
  {
    name: "货到付款",
    daysDue: 0,
    calculationMethod: "Net",
    daysDiscount: 0,
    discountPercentage: 0,
    createdBy: "system"
  },
  {
    name: "预付款/形式发票",
    daysDue: 0,
    calculationMethod: "Net",
    daysDiscount: 0,
    discountPercentage: 0,
    createdBy: "system"
  },
  {
    name: "月底10日内结清",
    daysDue: 10,
    calculationMethod: "End of Month",
    daysDiscount: 0,
    discountPercentage: 0,
    createdBy: "system"
  }
] as const;

export const unitOfMeasures = [
  { name: "个", code: "EA", createdBy: "system" },
  { name: "箱", code: "CS", createdBy: "system" },
  { name: "包", code: "PK", createdBy: "system" },
  { name: "托盘", code: "PL", createdBy: "system" },
  { name: "卷", code: "RL", createdBy: "system" },
  { name: "盒", code: "BX", createdBy: "system" },
  { name: "袋", code: "BG", createdBy: "system" },
  { name: "桶", code: "DR", createdBy: "system" },
  { name: "加仑", code: "GL", createdBy: "system" },
  { name: "升", code: "LT", createdBy: "system" },
  { name: "盎司", code: "OZ", createdBy: "system" },
  { name: "磅", code: "LB", createdBy: "system" },
  { name: "吨", code: "TN", createdBy: "system" },
  { name: "码", code: "YD", createdBy: "system" },
  { name: "米", code: "MT", createdBy: "system" },
  { name: "英寸", code: "INCH", createdBy: "system" },
  { name: "英尺", code: "FOOT", createdBy: "system" }
] as const;

export const gaugeTypes = [
  "量块",
  "内径卡尺",
  "外径卡尺",
  "深度卡尺",
  "外径千分尺",
  "内径千分尺",
  "深度千分尺",
  "百分表/千分表",
  "高度计",
  "螺纹规",
  "针规",
  "环规",
  "塞规",
  "内径百分表",
  "塞尺/感觉规",
  "平板",
  "通止规",
  "轮廓样板",
  "三坐标测量仪 (CMM)",
  "投影仪/光学比较仪"
] as const;

export const failureModes = [
  "轴承故障",
  "润滑不良",
  "电气故障",
  "泄漏",
  "严重磨损",
  "对中不良",
  "过热",
  "裂纹/疲劳",
  "堵塞",
  "异常振动"
] as const;

export const nonConformanceTypes = [
  { name: "设计缺陷", createdBy: "system" },
  { name: "制造缺陷", createdBy: "system" },
  { name: "工艺偏差", createdBy: "system" },
  { name: "材料问题", createdBy: "system" },
  { name: "测试不合格", createdBy: "system" },
  { name: "文档错误", createdBy: "system" },
  { name: "培训缺失", createdBy: "system" },
  { name: "设备故障", createdBy: "system" },
  { name: "供应商问题", createdBy: "system" },
  { name: "客户投诉", createdBy: "system" }
] as const;

export const nonConformanceRequiredActions = [
  { name: "纠正措施", systemType: "Corrective" as const, createdBy: "system" },
  { name: "预防措施", systemType: "Preventive" as const, createdBy: "system" },
  { name: "隔离措施", systemType: "Containment" as const, createdBy: "system" },
  { name: "验证", systemType: "Verification" as const, createdBy: "system" },
  { name: "客户沟通", systemType: "Communication" as const, createdBy: "system" },
  { name: "根本原因分析", createdBy: "system" },
  { name: "库存清查", createdBy: "system" },
  { name: "在制品检查", createdBy: "system" },
  { name: "产成品检查", createdBy: "system" },
  { name: "来料检查", createdBy: "system" },
  { name: "工艺过程检查", createdBy: "system" },
  { name: "文档修改", createdBy: "system" }
] as const;

export const sequences = [
  {
    table: "journalEntry",
    name: "日记账凭证",
    prefix: "JE-%{yyyy}-%{mm}-",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "job",
    name: "生产工单",
    prefix: "J",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "gauge",
    name: "测量量具规",
    prefix: "G",
    suffix: null,
    next: 0,
    size: 5,
    step: 1
  },
  {
    table: "inboundInspection",
    name: "来料检验单",
    prefix: "II",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "maintenanceDispatch",
    name: "设备保修单",
    prefix: "MAIN",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "nonConformance",
    name: "不合格品单",
    prefix: "NCR",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "purchaseOrder",
    name: "采购订单",
    prefix: "PO",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "purchaseInvoice",
    name: "采购发票",
    prefix: "AP",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "purchasingRfq",
    name: "采购询价单",
    prefix: "PRFQ",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "receipt",
    name: "收货单",
    prefix: "RE",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "salesRfq",
    name: "销售询价单",
    prefix: "RFQ",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "salesOrder",
    name: "销售订单",
    prefix: "SO",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "salesInvoice",
    name: "销售发票",
    prefix: "AR",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "stockTransfer",
    name: "库存划拨单",
    prefix: "ST",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "quote",
    name: "销售报价单",
    prefix: "Q",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "supplierQuote",
    name: "供应商报价单",
    prefix: "SQ",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "shipment",
    name: "发货单",
    prefix: "SHP",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "warehouseTransfer",
    name: "库位转移单",
    prefix: "WT",
    suffix: null,
    next: 0,
    size: 6,
    step: 1
  },
  {
    table: "fixedAsset",
    name: "固定资产",
    prefix: "FA",
    suffix: null,
    next: 1,
    size: 6,
    step: 1
  },
  {
    table: "depreciationRun",
    name: "计提折旧单",
    prefix: "DR",
    suffix: null,
    next: 1,
    size: 6,
    step: 1
  }
] as const;

// All 118 currencies from the original seed
export const currencies = [
  { code: "USD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "CAD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "EUR", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "AED", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "AFN", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "ALL", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "AMD", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "ARS", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "AUD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "AZN", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "BAM", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "BDT", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "BGN", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "BHD", exchangeRate: 1, decimalPlaces: 3, createdBy: "system" },
  { code: "BIF", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "BND", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "BOB", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "BRL", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "BWP", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "BYN", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "BZD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "CDF", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "CHF", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "CLP", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "CNY", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "COP", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "CRC", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "CVE", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "CZK", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "DJF", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "DKK", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "DOP", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "DZD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "EGP", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "ERN", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "ETB", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "GBP", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "GEL", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "GHS", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "GNF", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "GTQ", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "HKD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "HNL", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "HRK", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "HUF", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "IDR", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "ILS", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "INR", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "IQD", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "IRR", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "ISK", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "JMD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "JOD", exchangeRate: 1, decimalPlaces: 3, createdBy: "system" },
  { code: "JPY", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "KES", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "KHR", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "KMF", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "KRW", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "KWD", exchangeRate: 1, decimalPlaces: 3, createdBy: "system" },
  { code: "KZT", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "LBP", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "LKR", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "LTL", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "LVL", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "LYD", exchangeRate: 1, decimalPlaces: 3, createdBy: "system" },
  { code: "MAD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "MDL", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "MGA", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "MKD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "MMK", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "MOP", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "MUR", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "MXN", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "MYR", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "MZN", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "NAD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "NGN", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "NIO", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "NOK", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "NPR", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "NZD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "OMR", exchangeRate: 1, decimalPlaces: 3, createdBy: "system" },
  { code: "PAB", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "PEN", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "PHP", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "PKR", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "PLN", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "PYG", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "QAR", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "RON", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "RSD", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "RUB", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "RWF", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "SAR", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "SDG", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "SEK", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "SGD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "SOS", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "SYP", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "THB", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "TND", exchangeRate: 1, decimalPlaces: 3, createdBy: "system" },
  { code: "TOP", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "TRY", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "TTD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "TWD", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "TZS", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "UAH", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "UGX", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "UYU", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "UZS", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "VEF", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "VND", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "XAF", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "XOF", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "YER", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "ZAR", exchangeRate: 1, decimalPlaces: 2, createdBy: "system" },
  { code: "ZMK", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" },
  { code: "ZWL", exchangeRate: 1, decimalPlaces: 0, createdBy: "system" }
] as const;


// Chart of accounts - parent-child tree structure
// key/parentKey are used to resolve parentId at insert time (not stored in the database)
// Group accounts have number: null (they are organizational containers)
// Leaf accounts have 4-digit numbers following the standard COA structure:
//   1000-1999 Assets | 2000-2999 Liabilities | 3000-3999 Equity
//   4000-4999 Revenue | 5000-5999 COGS | 6000-6999 Operating Expenses | 7000-7999 Other Expenses
export const accounts = [
  // ═══════════════════════════════════════════════════════════
  // BALANCE SHEET (资产负债表)
  // ═══════════════════════════════════════════════════════════
  { key: "balance-sheet", number: null, name: "资产负债表", isGroup: true, parentKey: null, accountType: null, incomeBalance: "Balance Sheet", class: null, consolidatedRate: "Current", isSystem: true, createdBy: "system" },

  // ─── 1000-1999: ASSETS (资产) ───
  { key: "assets", number: null, name: "资产", isGroup: true, parentKey: "balance-sheet", accountType: "Other Current Asset", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },

  // Cash & Bank (货币资金)
  { key: "cash-and-bank", number: null, name: "货币资金", isGroup: true, parentKey: "assets", accountType: "Bank", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1010", number: "1010", name: "库存现金", isGroup: false, parentKey: "cash-and-bank", accountType: "Bank", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1020", number: "1020", name: "银行存款 - 本币", isGroup: false, parentKey: "cash-and-bank", accountType: "Bank", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1030", number: "1030", name: "银行存款 - 外币", isGroup: false, parentKey: "cash-and-bank", accountType: "Bank", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },

  // Receivables (应收款项)
  { key: "receivables", number: null, name: "应收款项", isGroup: true, parentKey: "assets", accountType: "Accounts Receivable", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1110", number: "1110", name: "应收账款", isGroup: false, parentKey: "receivables", accountType: "Accounts Receivable", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1130", number: "1130", name: "内部往来应收款", isGroup: false, parentKey: "receivables", accountType: "Accounts Receivable", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },

  // Inventory (存货)
  { key: "inventory", number: null, name: "存货", isGroup: true, parentKey: "assets", accountType: "Inventory", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1210", number: "1210", name: "原材料/库存商品", isGroup: false, parentKey: "inventory", accountType: "Inventory", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1230", number: "1230", name: "在制品 (WIP)", isGroup: false, parentKey: "inventory", accountType: "Inventory", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1240", number: "1240", name: "存货跌价准备", isGroup: false, parentKey: "inventory", accountType: "Inventory", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },

  // Property, Plant & Equipment (固定资产)
  { key: "ppe", number: null, name: "固定资产", isGroup: true, parentKey: "assets", accountType: "Fixed Asset", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1310", number: "1310", name: "固定资产原值", isGroup: false, parentKey: "ppe", accountType: "Fixed Asset", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1320", number: "1320", name: "待处置固定资产原值", isGroup: false, parentKey: "ppe", accountType: "Fixed Asset", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1330", number: "1330", name: "累计折旧", isGroup: false, parentKey: "ppe", accountType: "Accumulated Depreciation", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1340", number: "1340", name: "待处置累计折旧", isGroup: false, parentKey: "ppe", accountType: "Accumulated Depreciation", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1350", number: "1350", name: "机器设备", isGroup: false, parentKey: "ppe", accountType: "Fixed Asset", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1360", number: "1360", name: "房屋及建筑物", isGroup: false, parentKey: "ppe", accountType: "Fixed Asset", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },

  // Other Assets (其他资产)
  { key: "other-assets", number: null, name: "其他资产", isGroup: true, parentKey: "assets", accountType: "Other Asset", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1410", number: "1410", name: "无形资产", isGroup: false, parentKey: "other-assets", accountType: "Other Asset", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1420", number: "1420", name: "累计摊销", isGroup: false, parentKey: "other-assets", accountType: "Other Asset", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1430", number: "1430", name: "长期股权投资", isGroup: false, parentKey: "other-assets", accountType: "Investments", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },
  { key: "1440", number: "1440", name: "递延所得税资产", isGroup: false, parentKey: "other-assets", accountType: "Other Asset", incomeBalance: "Balance Sheet", class: "Asset", consolidatedRate: "Current", createdBy: "system" },

  // ─── 2000-2999: LIABILITIES (负债) ───
  { key: "liabilities", number: null, name: "负债", isGroup: true, parentKey: "balance-sheet", accountType: "Other Current Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },

  // Payables (应付款项)
  { key: "payables", number: null, name: "应付款项", isGroup: true, parentKey: "liabilities", accountType: "Accounts Payable", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2010", number: "2010", name: "应付账款", isGroup: false, parentKey: "payables", accountType: "Accounts Payable", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2020", number: "2020", name: "内部往来应付款", isGroup: false, parentKey: "payables", accountType: "Accounts Payable", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },

  // Current Liabilities (流动负债)
  { key: "current-liabilities", number: null, name: "流动负债", isGroup: true, parentKey: "liabilities", accountType: "Other Current Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2110", number: "2110", name: "预收账款", isGroup: false, parentKey: "current-liabilities", accountType: "Other Current Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2125", number: "2125", name: "暂估应付款 (GR/IR)", isGroup: false, parentKey: "current-liabilities", accountType: "Other Current Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2130", number: "2130", name: "已发货未开票存货", isGroup: false, parentKey: "current-liabilities", accountType: "Other Current Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2140", number: "2140", name: "应付利息/预提费用", isGroup: false, parentKey: "current-liabilities", accountType: "Other Current Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2150", number: "2150", name: "应付职工薪酬", isGroup: false, parentKey: "current-liabilities", accountType: "Other Current Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2160", number: "2160", name: "递延收益", isGroup: false, parentKey: "current-liabilities", accountType: "Other Current Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2170", number: "2170", name: "短期借款", isGroup: false, parentKey: "current-liabilities", accountType: "Other Current Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },

  // Tax Liabilities (应交税费)
  { key: "tax-liabilities", number: null, name: "应交税费", isGroup: true, parentKey: "liabilities", accountType: "Tax", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2210", number: "2210", name: "应交增值税 (销项)", isGroup: false, parentKey: "tax-liabilities", accountType: "Tax", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2220", number: "2220", name: "应交增值税 (进项)", isGroup: false, parentKey: "tax-liabilities", accountType: "Tax", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2230", number: "2230", name: "反向征税税金", isGroup: false, parentKey: "tax-liabilities", accountType: "Tax", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },

  // Long-Term Liabilities (非流动负债)
  { key: "long-term-liabilities", number: null, name: "非流动负债", isGroup: true, parentKey: "liabilities", accountType: "Long Term Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2410", number: "2410", name: "长期借款", isGroup: false, parentKey: "long-term-liabilities", accountType: "Long Term Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2420", number: "2420", name: "递延所得税负债", isGroup: false, parentKey: "long-term-liabilities", accountType: "Long Term Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },
  { key: "2430", number: "2430", name: "应付养老金", isGroup: false, parentKey: "long-term-liabilities", accountType: "Long Term Liability", incomeBalance: "Balance Sheet", class: "Liability", consolidatedRate: "Current", createdBy: "system" },

  // ─── 3000-3999: EQUITY (所有者权益) ───
  { key: "equity", number: null, name: "所有者权益", isGroup: true, parentKey: "balance-sheet", accountType: "Equity - No Close", incomeBalance: "Balance Sheet", class: "Equity", consolidatedRate: "Historical", createdBy: "system" },
  { key: "3010", number: "3010", name: "实收资本 (股本)", isGroup: false, parentKey: "equity", accountType: "Equity - No Close", incomeBalance: "Balance Sheet", class: "Equity", consolidatedRate: "Historical", createdBy: "system" },
  { key: "3100", number: "3100", name: "未分配利润", isGroup: false, parentKey: "equity", accountType: "Retained Earnings", incomeBalance: "Balance Sheet", class: "Equity", consolidatedRate: "Historical", createdBy: "system" },
  { key: "3200", number: "3200", name: "外币报表折算差额", isGroup: false, parentKey: "equity", accountType: "Equity - Close", incomeBalance: "Balance Sheet", class: "Equity", consolidatedRate: "Historical", createdBy: "system" },
  { key: "3300", number: "3300", name: "应付股利", isGroup: false, parentKey: "equity", accountType: "Equity - Close", incomeBalance: "Balance Sheet", class: "Equity", consolidatedRate: "Historical", createdBy: "system" },

  // ═══════════════════════════════════════════════════════════
  // INCOME STATEMENT (损益表)
  // ═══════════════════════════════════════════════════════════
  { key: "income-statement", number: null, name: "损益表", isGroup: true, parentKey: null, accountType: null, incomeBalance: "Income Statement", class: null, consolidatedRate: "Average", isSystem: true, createdBy: "system" },

  // ─── 4000-4999: REVENUE (营业收入) ───
  { key: "revenue", number: null, name: "营业收入", isGroup: true, parentKey: "income-statement", accountType: "Income", incomeBalance: "Income Statement", class: "Revenue", consolidatedRate: "Average", createdBy: "system" },
  { key: "4010", number: "4010", name: "主营业务收入", isGroup: false, parentKey: "revenue", accountType: "Income", incomeBalance: "Income Statement", class: "Revenue", consolidatedRate: "Average", createdBy: "system" },
  { key: "4020", number: "4020", name: "销售折让/折扣", isGroup: false, parentKey: "revenue", accountType: "Income", incomeBalance: "Income Statement", class: "Revenue", consolidatedRate: "Average", createdBy: "system" },
  { key: "4030", number: "4030", name: "加工服务收入", isGroup: false, parentKey: "revenue", accountType: "Income", incomeBalance: "Income Statement", class: "Revenue", consolidatedRate: "Average", createdBy: "system" },

  // Other Income (其他收益)
  { key: "other-income", number: null, name: "其他收益", isGroup: true, parentKey: "income-statement", accountType: "Other Income", incomeBalance: "Income Statement", class: "Revenue", consolidatedRate: "Average", createdBy: "system" },
  { key: "4110", number: "4110", name: "废料销售收入", isGroup: false, parentKey: "other-income", accountType: "Other Income", incomeBalance: "Income Statement", class: "Revenue", consolidatedRate: "Average", createdBy: "system" },
  { key: "4120", number: "4120", name: "汇兑损益 (收益)", isGroup: false, parentKey: "other-income", accountType: "Other Income", incomeBalance: "Income Statement", class: "Revenue", consolidatedRate: "Average", createdBy: "system" },

  // ─── 5000-5999: COST OF GOODS SOLD (营业成本) ───
  { key: "cogs", number: null, name: "营业成本", isGroup: true, parentKey: "income-statement", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "5010", number: "5010", name: "主营业务成本", isGroup: false, parentKey: "cogs", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "5050", number: "5050", name: "间接材料与服务成本", isGroup: false, parentKey: "cogs", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "5060", number: "5060", name: "人工及机器折旧分摊", isGroup: false, parentKey: "cogs", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },

  // Variances (成本差异)
  { key: "variances", number: null, name: "成本差异", isGroup: true, parentKey: "cogs", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "5210", number: "5210", name: "材料采购价格差异 (PPV)", isGroup: false, parentKey: "variances", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "5220", number: "5220", name: "原材料用量差异", isGroup: false, parentKey: "variances", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "5230", number: "5230", name: "人工及工时差异", isGroup: false, parentKey: "variances", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "5240", number: "5240", name: "制造费用差异", isGroup: false, parentKey: "variances", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "5250", number: "5250", name: "批量差异", isGroup: false, parentKey: "variances", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "5260", number: "5260", name: "委外加工差异", isGroup: false, parentKey: "variances", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },

  // Inventory Adjustments (存货盘点损益)
  { key: "inventory-adjustments", number: null, name: "存货盘点损益", isGroup: true, parentKey: "cogs", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "5310", number: "5310", name: "存货盘点差异调整", isGroup: false, parentKey: "inventory-adjustments", accountType: "Cost of Goods Sold", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },

  // ─── 6000-6999: OPERATING EXPENSES (期间费用) ───
  { key: "operating-expenses", number: null, name: "期间费用 (管理/销售费用)", isGroup: true, parentKey: "income-statement", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6010", number: "6010", name: "维修费用", isGroup: false, parentKey: "operating-expenses", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6020", number: "6020", name: "销售佣金", isGroup: false, parentKey: "operating-expenses", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6030", number: "6030", name: "广告及宣传费", isGroup: false, parentKey: "operating-expenses", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6040", number: "6040", name: "运输及装卸费", isGroup: false, parentKey: "operating-expenses", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6050", number: "6050", name: "信用减值损失 (坏账准备)", isGroup: false, parentKey: "operating-expenses", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6060", number: "6060", name: "管理人员薪酬", isGroup: false, parentKey: "operating-expenses", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6070", number: "6070", name: "租赁及水电费", isGroup: false, parentKey: "operating-expenses", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6080", number: "6080", name: "中介及咨询审计费", isGroup: false, parentKey: "operating-expenses", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6090", number: "6090", name: "差旅及业务招待费", isGroup: false, parentKey: "operating-expenses", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6100", number: "6100", name: "保险费", isGroup: false, parentKey: "operating-expenses", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6110", number: "6110", name: "财务费用 - 手续费", isGroup: false, parentKey: "operating-expenses", accountType: "Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },

  // Depreciation & Amortization (折旧与摊销费用)
  { key: "depreciation", number: null, name: "折旧与摊销费用", isGroup: true, parentKey: "operating-expenses", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6310", number: "6310", name: "折旧费用", isGroup: false, parentKey: "depreciation", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "6320", number: "6320", name: "资产处置损益", isGroup: false, parentKey: "depreciation", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },

  // ─── 7000-7999: OTHER / NON-OPERATING EXPENSES (其他支出) ───
  { key: "other-expenses", number: null, name: "其他支出/营业外支出", isGroup: true, parentKey: "income-statement", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "7010", number: "7010", name: "财务费用 - 利息支出", isGroup: false, parentKey: "other-expenses", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "7020", number: "7020", name: "现金折扣 (供应商)", isGroup: false, parentKey: "other-expenses", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "7030", number: "7030", name: "现金折扣 (客户)", isGroup: false, parentKey: "other-expenses", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "7040", number: "7040", name: "服务费支出", isGroup: false, parentKey: "other-expenses", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "7050", number: "7050", name: "尾差调整账户", isGroup: false, parentKey: "other-expenses", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "7060", number: "7060", name: "汇兑损益 (损失)", isGroup: false, parentKey: "other-expenses", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "7070", number: "7070", name: "所得税费用", isGroup: false, parentKey: "other-expenses", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "7080", number: "7080", name: "研发费用", isGroup: false, parentKey: "other-expenses", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
  { key: "7090", number: "7090", name: "递延所得税费用", isGroup: false, parentKey: "other-expenses", accountType: "Other Expense", incomeBalance: "Income Statement", class: "Expense", consolidatedRate: "Average", createdBy: "system" },
] as const;

export const accountDefaults = {
  salesAccount: "4010",
  salesDiscountAccount: "4020",
  costOfGoodsSoldAccount: "5010",
  purchaseVarianceAccount: "5210",
  inventoryAdjustmentVarianceAccount: "5310",
  materialVarianceAccount: "5220",
  laborAndMachineVarianceAccount: "5230",
  overheadVarianceAccount: "5240",
  lotSizeVarianceAccount: "5250",
  subcontractingVarianceAccount: "5260",
  laborAbsorptionAccount: "5060",
  indirectCostAccount: "5050",
  maintenanceAccount: "6010",
  assetDepreciationExpenseAccount: "6310",
  assetGainsAndLossesAccount: "6320",
  serviceChargeAccount: "7040",
  interestAccount: "7010",
  supplierPaymentDiscountAccount: "7020",
  customerPaymentDiscountAccount: "7030",
  roundingAccount: "7050",
  assetAquisitionCostAccount: "1310",
  assetAquisitionCostOnDisposalAccount: "1320",
  accumulatedDepreciationAccount: "1330",
  accumulatedDepreciationOnDisposalAccount: "1340",
  inventoryAccount: "1210",
  workInProgressAccount: "1230",
  receivablesAccount: "1110",
  bankCashAccount: "1010",
  bankLocalCurrencyAccount: "1020",
  bankForeignCurrencyAccount: "1030",
  prepaymentAccount: "2110",
  payablesAccount: "2010",
  goodsReceivedNotInvoicedAccount: "2125",
  inventoryShippedNotInvoicedAccount: "2130",
  salesTaxPayableAccount: "2210",
  purchaseTaxPayableAccount: "2220",
  reverseChargeSalesTaxPayableAccount: "2230",
  retainedEarningsAccount: "3100",
  currencyTranslationAccount: "3200",
  deferredTaxLiabilityAccountId: "2420",
  deferredTaxExpenseAccountId: "7090",
} as const;

export const fixedAssetClasses = [
  {
    name: "房屋及建筑物",
    depreciationMethod: "Straight Line" as const,
    usefulLifeMonths: 468,
    residualValuePercent: 0,
    assetAccount: "1360",
    accumulatedDepreciationAccount: "1330",
    depreciationExpenseAccount: "6310",
    writeOffAccount: "6320",
    writeDownAccount: "6320",
    disposalAccount: "6320",
  },
  {
    name: "机器设备",
    depreciationMethod: "Straight Line" as const,
    usefulLifeMonths: 120,
    residualValuePercent: 0,
    assetAccount: "1350",
    accumulatedDepreciationAccount: "1330",
    depreciationExpenseAccount: "6310",
    writeOffAccount: "6320",
    writeDownAccount: "6320",
    disposalAccount: "6320",
  },
  {
    name: "运输工具",
    depreciationMethod: "Straight Line" as const,
    usefulLifeMonths: 60,
    residualValuePercent: 0,
    assetAccount: "1310",
    accumulatedDepreciationAccount: "1330",
    depreciationExpenseAccount: "6310",
    writeOffAccount: "6320",
    writeDownAccount: "6320",
    disposalAccount: "6320",
  },
];

export const fiscalYearSettings = {
  startMonth: "January",
  taxStartMonth: "January",
  updatedBy: "system"
} as const;

/**
 * Default location seeded for new companies
 * Required for inventory quantities, jobs, and other location-dependent features
 */
export const defaultLocation = {
  name: "总部仓库",
  addressLine1: "高新技术开发区科创路88号",
  city: "深圳市",
  stateProvince: "广东省",
  postalCode: "518000",
  countryCode: "CN",
  timezone: "Asia/Shanghai",
  createdBy: "system"
} as const;

export const groups = [
  {
    idPrefix: "00000000-0000",
    name: "全体员工",
    isCustomerTypeGroup: false,
    isEmployeeTypeGroup: true,
    isSupplierTypeGroup: false
  },
  {
    idPrefix: "11111111-1111",
    name: "全体客户",
    isCustomerTypeGroup: true,
    isEmployeeTypeGroup: false,
    isSupplierTypeGroup: false
  },
  {
    idPrefix: "22222222-2222",
    name: "全体供应商",
    isCustomerTypeGroup: false,
    isEmployeeTypeGroup: false,
    isSupplierTypeGroup: true
  }
] as const;

/**
 * Helper to generate group ID from idPrefix and company ID
 * The resulting ID format: {idPrefix}-{companyId formatted as XXXX-YYYY-ZZZZZZZZZZZZ}
 */
export function getGroupId(idPrefix: string, companyId: string): string {
  const companyIdPart = `${companyId.substring(0, 4)}-${companyId.substring(
    4,
    8
  )}-${companyId.substring(8, 20)}`;
  return `${idPrefix}-${companyIdPart}`;
}
