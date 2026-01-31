// 网站数据 - 通过管理后台更新于 2026/2/1 02:55:05

// 站点配置
export const siteConfig = {
  "siteName": "软件网",
  "siteTitle": "不懂请找UP主",
  "siteLogo": "/assets/logo.png",
  "siteDescription": "推荐独享socks5住宅IP、住宅vps",
  "icpRecord": "",
  "publicSecurityRecord": "",
  "publicSecurityRecordUrl": ""
};

export const websiteData = [];

// 分类定义 - 支持二级分类
export const categories = [
  {
    "id": "category_1769885618545",
    "name": "socks5独享住宅ip",
    "icon": "/assets/tools_icon.png",
    "special": false,
    "subcategories": []
  },
  {
    "id": "category_1769885643033",
    "name": "独享住宅vps推荐",
    "icon": "/assets/Browser-Code.png",
    "special": false,
    "subcategories": []
  }
];

// 搜索引擎配置
export const searchEngines = [
  { id: "bing", name: "必应", url: "https://www.bing.com/search?q=", color: "bg-blue-600" },
  { id: "baidu", name: "百度", url: "https://www.baidu.com/s?wd=", color: "bg-red-600" },
  { id: "google", name: "谷歌", url: "https://www.google.com/search?q=", color: "bg-green-600" },
  { id: "internal", name: "站内搜索", url: "", color: "bg-purple-600" }
];

// 推荐内容配置
export const recommendations = [
  {
    id: 1,
    title: "阿里云",
    description: "点击领取2000元限量云产品优惠券",
    url: "https://aliyun.com",
    type: "sponsor",
    color: "from-blue-50 to-blue-100"
  },
  {
    id: 2,
    title: "设计资源",
    description: "高质量设计素材网站推荐",
    url: "#design_resources",
    type: "internal",
    color: "from-green-50 to-green-100"
  }
];

// 热门标签
export const popularTags = [
  "设计工具", "免费素材", "UI设计", "前端开发", "图标库", "配色方案",
  "设计灵感", "原型工具", "代码托管", "学习平台", "社区论坛", "创业资讯"
];

// 网站统计信息
export const siteStats = {
  totalSites: websiteData.length,
  totalCategories: categories.length,
  totalTags: [...new Set(websiteData.flatMap(site => site.tags || []))].length,
  lastUpdated: "2026-01-31"
};
