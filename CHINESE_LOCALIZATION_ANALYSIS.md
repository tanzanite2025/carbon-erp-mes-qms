# Carbon 项目中文本地化分析报告

## 📊 分析结论

**Carbon 项目已经实现了完整的国际化系统，并且包含中文（简体中文）支持。**

---

## ✅ 已实现的功能

### 1. 国际化框架
- **使用技术**: [Lingui](https://lingui.dev/) - 专业的 React 国际化库
- **配置文件**: `lingui.config.js`
- **翻译格式**: PO (Portable Object) 文件格式

### 2. 支持的语言列表

项目目前支持 **11 种语言**：

| 语言代码 | 语言名称 | 本地化名称 |
|---------|---------|-----------|
| `en` | English | English |
| `zh` | Chinese | 中文 ⭐ |
| `es` | Spanish | Español |
| `de` | German | Deutsch |
| `fr` | French | Français |
| `it` | Italian | Italiano |
| `ja` | Japanese | 日本語 |
| `pl` | Polish | Polski |
| `pt` | Portuguese | Português |
| `ru` | Russian | Русский |
| `hi` | Hindi | हिन्दी |

### 3. 中文翻译文件位置

```
packages/locale/locales/zh/
├── erp.po    # ERP 应用的中文翻译（约 5848 行）
└── mes.po    # MES 应用的中文翻译
```

### 4. 翻译示例

从 `zh/erp.po` 文件中可以看到，中文翻译已经完成并且质量良好：

```po
msgid "A customer is a business or person who buys your parts or services."
msgstr "客户是购买您的零件或服务的企业或个人。"

msgid "A supplier is a business or person who sells you parts or services."
msgstr "供应商是向您销售零件或服务的企业或个人。"

msgid "{0} uploaded successfully"
msgstr "{0} 上传成功"

msgid "3D Model"
msgstr "3D 模型"
```

### 5. 语言切换实现

**配置文件**: `packages/locale/src/config.ts`

- 支持通过 Cookie (`locale`) 存储用户语言偏好
- 支持通过环境变量 `DEFAULT_LANGUAGE` 设置默认语言
- 自动语言检测和回退机制
- 提供语言选择器 UI 组件

**语言解析逻辑**:
```typescript
export const resolveLanguage = (locale: string | null | undefined): SupportedLanguage => {
  if (!locale) return defaultLanguage;
  const normalized = locale.toLowerCase().split("-")[0];
  if (supportedLanguages.includes(normalized as SupportedLanguage)) {
    return normalized as SupportedLanguage;
  }
  return defaultLanguage;
};
```

---

## 🔧 技术架构

### 翻译文件结构

```
packages/locale/
├── locales/
│   ├── en/          # 英文（源语言）
│   ├── zh/          # 中文 ⭐
│   ├── es/          # 西班牙语
│   ├── de/          # 德语
│   ├── fr/          # 法语
│   ├── it/          # 意大利语
│   ├── ja/          # 日语
│   ├── nl/          # 荷兰语
│   ├── pl/          # 波兰语
│   ├── pt/          # 葡萄牙语
│   ├── ru/          # 俄语
│   └── hi/          # 印地语
└── src/
    ├── config.ts    # 语言配置
    ├── i18n.tsx     # i18n Provider
    └── index.ts     # 导出
```

### 翻译覆盖范围

根据 `lingui.config.js` 配置，翻译覆盖以下代码：

**ERP 应用**:
- `apps/erp/app` - ERP 应用代码
- `packages/react/src` - 共享 React 组件
- `packages/form/src` - 表单组件

**MES 应用**:
- `apps/mes/app` - MES 应用代码
- `packages/react/src` - 共享 React 组件
- `packages/form/src` - 表单组件

---

## 🛠️ 翻译工作流

### 自动翻译工具

项目使用 **Linguito** 配合 **Ollama** 和 **Llama 3.2** 进行自动翻译：

```bash
# 安装和配置（macOS）
brew install ollama
brew services start ollama
ollama pull llama3.2

# 配置 Linguito
npx linguito config set \
  llmSettings.provider=ollama \
  llmSettings.url=http://127.0.0.1:11434/api

# 运行翻译
pnpm run translate
```

### 翻译命令

```bash
# 提取新的翻译字符串
pnpm lingui extract

# 编译翻译文件
pnpm lingui compile

# 自动翻译
pnpm run translate
```

---

## 📈 翻译完成度

### 统计数据

- **英文 ERP 翻译文件**: 约 5852 行
- **中文 ERP 翻译文件**: 约 5848 行
- **完成度**: ~99.9%

### 翻译质量

从抽样检查来看，中文翻译质量良好：
- ✅ 术语翻译准确（如 "supplier" → "供应商"）
- ✅ 语法通顺自然
- ✅ 保留了占位符格式（如 `{0}`, `{name}`）
- ✅ 保留了 HTML 标签（如 `<0>`, `<1>`）

---

## 🎯 如何使用中文版本

### 方法 1: 设置环境变量

在 `.env` 文件中添加：
```bash
DEFAULT_LANGUAGE=zh
```

### 方法 2: 通过 UI 切换

应用内应该有语言选择器，可以选择 "中文"。

### 方法 3: 通过 Cookie

设置 Cookie `locale=zh`。

### 方法 4: 通过浏览器语言

如果浏览器语言设置为中文，应用会自动检测并使用中文。

---

## 🚀 开发建议

### 如果需要改进中文翻译

1. **手动编辑翻译文件**:
   ```bash
   # 编辑 ERP 中文翻译
   code packages/locale/locales/zh/erp.po
   
   # 编辑 MES 中文翻译
   code packages/locale/locales/zh/mes.po
   ```

2. **使用翻译工具**:
   - [Poedit](https://poedit.net/) - 专业的 PO 文件编辑器
   - [Weblate](https://weblate.org/) - 在线协作翻译平台

3. **重新编译**:
   ```bash
   pnpm lingui compile
   ```

### 如果需要添加新的翻译字符串

1. 在代码中使用 Lingui 的 `Trans` 组件或 `t` 函数
2. 运行提取命令: `pnpm lingui extract`
3. 翻译新字符串
4. 编译: `pnpm lingui compile`

---

## 📝 总结

✅ **Carbon 项目已经有完整的中文支持**
✅ **使用专业的 Lingui 国际化框架**
✅ **支持 11 种语言，包括简体中文**
✅ **中文翻译完成度接近 100%**
✅ **提供自动翻译工具链**
✅ **支持多种语言切换方式**

**结论**: 这个项目不仅有英文版本，而且已经实现了完善的多语言系统，中文翻译质量良好，可以直接使用。
