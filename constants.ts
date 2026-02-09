
import { AnalysisRecord, AnalysisReport, Creator, Product, SalesPerformance } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: '无线蓝牙耳机 - 降噪版',
    price: 299.00,
    image: 'https://picsum.photos/200/200?random=1',
    sales: 3876,
    reviews: 1235,
    currency: 'CNY'
  },
  {
    id: 'p2',
    title: '氨基酸温和洁面乳 100g',
    price: 89.90,
    image: 'https://picsum.photos/200/200?random=2',
    sales: 12050,
    reviews: 4500,
    currency: 'CNY'
  },
  {
    id: 'p3',
    title: '智能运动手环 Pro',
    price: 199.00,
    image: 'https://picsum.photos/200/200?random=3',
    sales: 890,
    reviews: 120,
    currency: 'CNY'
  }
];

export const MOCK_CREATORS: Creator[] = [
  {
    id: 'c1',
    nickname: 'Tech Guru Leo',
    avatar: 'https://picsum.photos/100/100?random=10',
    region: 'Philippines',
    followers: 27500,
    videos: 231,
    likes: 150000,
    engagementRate: 5.2,
    tags: ['数码测评', '生活黑客'],
    matchScore: 92,
    recommendReason: '粉丝画像高度重合，过往3C类目转化率极高',
    isFavorite: true,
    source: 'SMART_MATCHING',
    lastAnalyzedAt: '2023-10-24',
    followerGrowth: 2.5
  },
  {
    id: 'c2',
    nickname: 'Beauty Sarah',
    avatar: 'https://picsum.photos/100/100?random=11',
    region: 'Thailand',
    followers: 850000,
    videos: 540,
    likes: 2300000,
    engagementRate: 3.8,
    tags: ['美妆护肤', '日常Vlog'],
    matchScore: 88,
    recommendReason: '粉丝购买力强，互动氛围好',
    isFavorite: true,
    source: 'HOT_CREATORS',
    lastAnalyzedAt: '2023-10-20',
    followerGrowth: 1.8
  },
  {
    id: 'c3',
    nickname: 'Fitness Mark',
    avatar: 'https://picsum.photos/100/100?random=12',
    region: 'Malaysia',
    followers: 120000,
    videos: 180,
    likes: 560000,
    engagementRate: 4.5,
    tags: ['健身', '健康饮食'],
    matchScore: 75,
    recommendReason: '垂直领域精准，但客单价偏好较低',
    notRecommendReason: '近期广告内容过多，可能影响转化',
    isFavorite: true,
    source: 'HOT_CREATORS',
    lastAnalyzedAt: undefined,
    followerGrowth: 3.1
  },
  {
    id: 'c4',
    nickname: 'Daily Life Jane',
    avatar: 'https://picsum.photos/100/100?random=13',
    region: 'Vietnam',
    followers: 45000,
    videos: 320,
    likes: 89000,
    engagementRate: 2.1,
    tags: ['生活记录', '好物分享'],
    matchScore: 60,
    notRecommendReason: '互动率低于行业平均水平',
    isFavorite: false,
    source: 'SMART_MATCHING',
    lastAnalyzedAt: undefined,
    followerGrowth: 0.5
  },
   {
    id: 'c5',
    nickname: 'GamerXpert',
    avatar: 'https://picsum.photos/100/100?random=14',
    region: 'Philippines',
    followers: 1250000,
    videos: 890,
    likes: 12000000,
    engagementRate: 7.8,
    tags: ['游戏直播', '电竞', '3C数码'],
    isFavorite: false,
    source: 'HOT_CREATORS',
    lastAnalyzedAt: '2023-10-23',
    followerGrowth: 5.2
  },
  {
    id: 'c6',
    nickname: 'Fashionista Amy',
    avatar: 'https://picsum.photos/100/100?random=15',
    region: 'Thailand',
    followers: 340000,
    videos: 410,
    likes: 980000,
    engagementRate: 4.1,
    tags: ['时尚穿搭', 'OOTD'],
    isFavorite: true,
    source: 'HOT_CREATORS',
    lastAnalyzedAt: undefined,
    followerGrowth: 2.1
  },
  {
    id: 'c7',
    nickname: 'Foodie Chen',
    avatar: 'https://picsum.photos/100/100?random=16',
    region: 'Malaysia',
    followers: 95000,
    videos: 215,
    likes: 450000,
    engagementRate: 6.3,
    tags: ['美食探店', '烹饪教程'],
    isFavorite: false,
    source: 'HOT_CREATORS',
    lastAnalyzedAt: '2023-10-21',
    followerGrowth: 4.5
  },
  {
    id: 'c8',
    nickname: 'Travel Bug Ben',
    avatar: 'https://picsum.photos/100/100?random=17',
    region: 'Vietnam',
    followers: 680000,
    videos: 150,
    likes: 3200000,
    engagementRate: 5.9,
    tags: ['旅行Vlog', '摄影'],
    isFavorite: false,
    source: 'HOT_CREATORS',
    lastAnalyzedAt: undefined,
    followerGrowth: 1.2
  },
];

export const MOCK_HISTORY: AnalysisRecord[] = [
  {
    id: 'h1',
    product: MOCK_PRODUCTS[0],
    createdAt: '2023-10-24 14:30',
    createdBy: '张建联',
    creatorCount: 29, // Analyzed
    recommendedCount: 12, // Recommended
    contactedCount: 8, // Contacted
    collaboratedCount: 3, // Collaborated
    creators: MOCK_CREATORS.slice(0, 4),
    strategySummary: {
      overview: '本次筛选主要聚焦于数码垂直领域的腰部达人，整体转化率表现优异。高匹配度达人集中在菲律宾和泰国地区，视频风格以硬核测评为主。',
      conversionRate: 4.2,
      highConversionTraits: ['视频平均时长>3分钟', '粉丝互动率>5%', '过往有3C带货记录'],
      optimizationTips: '建议在下一轮筛选中，增加对“生活黑客”类泛科技达人的关注，同时适当放宽粉丝量级限制以探索潜力新星。'
    }
  },
  {
    id: 'h2',
    product: MOCK_PRODUCTS[1],
    createdAt: '2023-10-23 09:15',
    createdBy: '李小美',
    creatorCount: 50,
    recommendedCount: 8,
    contactedCount: 2,
    collaboratedCount: 0,
    creators: [MOCK_CREATORS[1], MOCK_CREATORS[3]],
    strategySummary: {
      overview: '针对美妆类目的初次尝试，筛选范围较广。发现泛娱乐类达人虽然曝光量大，但对单价较低的洁面产品转化效果一般。',
      conversionRate: 1.1,
      highConversionTraits: ['成分党', '粉丝年龄25-34岁', '直播频率高'],
      optimizationTips: '建议收缩范围，专注于“成分分析”和“敏感肌护肤”细分赛道，排除纯剧情类达人。'
    }
  }
];

// Helper to generate mock sales data
export const generateMockSalesData = (): SalesPerformance => ({
    last30Days: {
        gmv: Math.floor(Math.random() * 500000) + 10000,
        itemsSold: Math.floor(Math.random() * 5000) + 100,
        avgPrice: Math.floor(Math.random() * 100) + 20
    },
    video: {
        count: Math.floor(Math.random() * 20) + 5,
        sales: Math.floor(Math.random() * 200000) + 5000,
        gom: Math.floor(Math.random() * 50) + 10,
        avgViews: Math.floor(Math.random() * 50000) + 2000
    },
    live: {
        count: Math.floor(Math.random() * 10),
        sales: Math.floor(Math.random() * 300000),
        gpm: Math.floor(Math.random() * 80) + 20,
        avgViews: Math.floor(Math.random() * 10000) + 500
    },
    updatedAt: new Date().toISOString()
});

export const MOCK_REPORTS: Record<string, AnalysisReport> = {
  'c1': {
    creatorId: 'c1',
    audience: {
      gender: [{ name: '男', value: 67 }, { name: '女', value: 33 }],
      age: [
        { name: '18-24', value: 25 }, 
        { name: '25-34', value: 29 }, 
        { name: '35-44', value: 26 },
        { name: '45-55', value: 7 },
        { name: '55+', value: 13 }
      ]
    },
    salesData: {
        last30Days: {
            gmv: 450000,
            itemsSold: 2300,
            avgPrice: 195
        },
        video: {
            count: 12,
            sales: 380000,
            gom: 45,
            avgViews: 25000
        },
        live: {
            count: 2,
            sales: 70000,
            gpm: 120,
            avgViews: 5000
        },
        updatedAt: '2023-10-24T10:00:00Z'
    },
    matchDetails: {
      audienceOverlap: {
        score: 95,
        items: [
          '核心受众年龄 (18-34岁) 占比达 80%，高度吻合',
          '粉丝对数码/科技话题关注度极高',
          '活跃时间段集中在晚间 8-10 点，适合投放'
        ]
      },
      contentRelevance: {
        score: 88,
        items: [
          '往期“耳机横评”类视频平均播放量高',
          '视频风格专业硬核，符合降噪耳机调性',
          '具备清晰的开箱和功能演示能力'
        ]
      },
      promotionPotential: {
        score: 90,
        items: [
          '近30天涨粉趋势良好，处于上升期',
          '过往3C类产品带货转化率优于同级达人',
          '粉丝购买意愿强，评论区求链接比例高'
        ]
      },
      engagementQuality: {
        score: 85,
        items: [
          '评论区技术讨论氛围浓厚，水军少',
          '达人回复率高，粉丝粘性强',
          '负面评价极少，品牌安全度高'
        ]
      }
    },
    swot: {
      advantages: ['专业度高，粉丝信任感强', '视频制作精良', '过往类似产品转化率Top 5%', '回复评论积极', '配合度高'],
      risks: ['排期较满，需提前预约', '报价略高于平均水平', '对脚本要求较严格', '不接受纯佣金合作', '竞品广告排斥']
    },
    suggestions: {
      format: '深度测评 + 场景植入',
      commission: '一口价 $500 + 15% CPS',
      scripts: [
        '场景一：嘈杂地铁中戴上耳机瞬间安静，突出降噪功能。',
        '场景二：与千元级耳机音质盲测对比，突出性价比。',
        '场景三：游戏延迟测试，展示低延迟特性。'
      ],
      message: 'Hi Leo, 关注到您最近关于降噪耳机的测评非常专业。我们是[品牌名]，有一款新品在降噪深度上可对标一线大牌，但价格仅为1/3。希望能邀请您体验并分享真实感受...'
    },
    relevantVideos: [
      {
        id: 'v1',
        thumbnailUrl: 'https://picsum.photos/400/225?random=201',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        title: '深度体验：这款降噪耳机真的值吗？',
        views: 185000,
        tags: ['深度测评', '数码产品', '高播放 (10万+)', '专业权威', '高互动', '突出降噪']
      },
      {
        id: 'v2',
        thumbnailUrl: 'https://picsum.photos/400/225?random=202',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
        title: '开箱！百元级耳机音质挑战千元旗舰',
        views: 250000,
        tags: ['开箱初见', '对比视频', '爆款潜力', '热情幽默', '强调性价比', '快节奏']
      },
      {
        id: 'v3',
        thumbnailUrl: 'https://picsum.photos/400/225?random=203',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: '通勤必备！我的Top 3数码好物分享',
        views: 98000,
        tags: ['日常使用', '中播放 (1万-10万)', '亲和日常', '简约美学']
      }
    ]
  },
  'c2': {
    creatorId: 'c2',
    audience: {
      gender: [{ name: '男', value: 10 }, { name: '女', value: 90 }],
      age: [
        { name: '18-24', value: 60 }, 
        { name: '25-34', value: 25 }, 
        { name: '35-44', value: 10 },
        { name: '45-55', value: 3 },
        { name: '55+', value: 2 }
      ]
    },
    salesData: null, // Simulate empty data
    matchDetails: {
      audienceOverlap: {
        score: 60,
        items: [
          '性别分布与美妆类目高度一致',
          '年龄层偏年轻，对低客单价敏感',
          '地域分布主要集中在曼谷等一线城市'
        ]
      },
      contentRelevance: {
        score: 70,
        items: [
          '视觉风格唯美，适合展示产品外观',
          '生活化场景植入自然',
          '缺乏专业向的功能解说经验'
        ]
      },
      promotionPotential: {
        score: 85,
        items: [
          '粉丝基数大，品牌曝光效果好',
          '易打造爆款视觉素材',
          '适合做品牌认知度的初期铺量'
        ]
      },
      engagementQuality: {
        score: 92,
        items: [
          '粉丝互动极其活跃，点赞比高',
          '粉丝对种草内容接受度高',
          '社区氛围友好，易于引导舆论'
        ]
      }
    },
    swot: {
      advantages: ['粉丝基数大，曝光能力强', '视觉表现力极佳', '擅长营造购买欲望', '粉丝粘性高', '具备直播带货能力'],
      risks: ['受众主要关注美妆，数码产品可能跨度大', '客单价敏感度高', '视频完播率波动大', '档期不稳定', '需寄送全套赠品']
    },
    suggestions: {
      format: 'GRWM (Get Ready With Me) / 晨间好物分享',
      commission: '一口价 $1200 + 10% CPS',
      scripts: [
        '场景一：晨跑时佩戴，展示稳固性和时尚搭配。',
        '场景二：化妆时听音乐，展示沉浸感。'
      ],
      message: 'Hi Sarah, 您的生活方式非常令人向往。我们是[品牌名]，这款耳机的颜值设计非常适合您的OOTD风格...'
    },
    relevantVideos: [
       {
        id: 'v4',
        thumbnailUrl: 'https://picsum.photos/400/225?random=204',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        title: 'GRWM | 跟我一起准备出门吧',
        views: 450000,
        tags: ['教程', '护肤', '美妆流程', '高播放 (10万+)', '评论活跃', '亲和日常']
      },
      {
        id: 'v5',
        thumbnailUrl: 'https://picsum.photos/400/225?random=205',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        title: 'VLOG: 曼谷周末怎么过？',
        views: 320000,
        tags: ['日常使用', '时尚穿搭', '高播放 (10万+)', '电影感', '故事驱动', '专业剪辑']
      }
    ]
  }
};
