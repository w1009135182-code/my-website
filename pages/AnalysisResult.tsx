
import React, { useState } from 'react';
import { ArrowLeft, Star, Plus, ThumbsUp, AlertTriangle, MessageSquare, ChevronRight, BarChart3, Target, Zap, Lock, Send, LayoutDashboard, Brain, Filter, ArrowRight, Sparkles, X, Microscope, Check, CheckCircle2, Sliders, Coins, Loader, RefreshCw, ShoppingBag, Video, Radio, Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { AnalysisRecord, AnalysisReport, Creator } from '../types';
import { MOCK_REPORTS, generateMockSalesData } from '../constants';

interface Props {
  record: AnalysisRecord;
  onBack: () => void;
}

// Mock extra similar creators for the prototype demonstration
const MOCK_NEW_SIMILAR_CREATORS: Creator[] = [
  {
    id: 'sim1',
    nickname: 'Creative Anna',
    avatar: 'https://picsum.photos/100/100?random=101',
    region: 'Philippines',
    followers: 45000,
    videos: 120,
    likes: 230000,
    engagementRate: 4.8,
    tags: ['Vlog', 'Fashion'],
    matchScore: 0 
  },
  {
    id: 'sim2',
    nickname: 'Tech Reviewer Bob',
    avatar: 'https://picsum.photos/100/100?random=102',
    region: 'Thailand',
    followers: 12000,
    videos: 85,
    likes: 56000,
    engagementRate: 6.2,
    tags: ['Tech', 'Unboxing'],
    matchScore: 0
  },
  {
    id: 'sim3',
    nickname: 'Foodie Tom',
    avatar: 'https://picsum.photos/100/100?random=103',
    region: 'Vietnam',
    followers: 89000,
    videos: 340,
    likes: 1200000,
    engagementRate: 3.5,
    tags: ['Food', 'Lifestyle'],
    matchScore: 0
  },
  {
    id: 'sim4',
    nickname: 'Gamer X',
    avatar: 'https://picsum.photos/100/100?random=104',
    region: 'Malaysia',
    followers: 210000,
    videos: 400,
    likes: 800000,
    engagementRate: 5.1,
    tags: ['Gaming', 'Live'],
    matchScore: 0
  },
  {
    id: 'sim5',
    nickname: 'Makeup Lily',
    avatar: 'https://picsum.photos/100/100?random=105',
    region: 'Vietnam',
    followers: 67000,
    videos: 150,
    likes: 300000,
    engagementRate: 4.2,
    tags: ['Beauty', 'Tutorial'],
    matchScore: 0
  }
];

// Helper function to assign color classes to video tags
const getTagColor = (tag: string) => {
    const lowerTag = tag.toLowerCase();
    // Performance Tags (播放, 互动, 爆款)
    if (lowerTag.includes('播放') || lowerTag.includes('互动') || lowerTag.includes('爆款')) {
        return 'bg-green-50 text-green-700 border-green-100';
    }
    // Content Tags (测评, 开箱, 教程, 对比, 数码, 护肤)
    if (lowerTag.includes('测评') || lowerTag.includes('开箱') || lowerTag.includes('教程') || lowerTag.includes('对比') || lowerTag.includes('数码') || lowerTag.includes('护肤')) {
        return 'bg-blue-50 text-blue-700 border-blue-100';
    }
    // Style Tags (专业, 电影, 幽默, 亲和, 美学)
    if (lowerTag.includes('专业') || lowerTag.includes('电影') || lowerTag.includes('幽默') || lowerTag.includes('亲和') || lowerTag.includes('美学')) {
        return 'bg-purple-50 text-purple-700 border-purple-100';
    }
    return 'bg-gray-50 text-gray-600 border-gray-100';
};


const AnalysisResult: React.FC<Props> = ({ record, onBack }) => {
  // Use local state for creators to support adding new ones from "Similar" view
  const [localCreators, setLocalCreators] = useState<Creator[]>(record.creators);
  const sortedCreators = [...localCreators].sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  
  // Local state for reports to support data updates
  const [localReports, setLocalReports] = useState<Record<string, AnalysisReport>>(MOCK_REPORTS);

  // View states
  const [activeView, setActiveView] = useState<'OVERVIEW' | 'CREATOR_DETAIL' | 'SIMILAR'>('OVERVIEW');
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  
  // Selection Mode State (Sidebar)
  const [isSidebarSelectionMode, setIsSidebarSelectionMode] = useState(false);
  const [selectedResultCreatorIds, setSelectedResultCreatorIds] = useState<string[]>([]);
  const [isBatchCollecting, setIsBatchCollecting] = useState(false);

  // Similar Creators State
  const [availableSimilarCreators, setAvailableSimilarCreators] = useState<Creator[]>(MOCK_NEW_SIMILAR_CREATORS);
  const [selectedSimilarIds, setSelectedSimilarIds] = useState<string[]>([]);
  const [analyzingIds, setAnalyzingIds] = useState<string[]>([]);
  
  // Analysis Loading State for Batch
  const [isBatchAnalyzing, setIsBatchAnalyzing] = useState(false);
  
  // Deep Analysis Modal State
  const [isDeepAnalysisModalOpen, setIsDeepAnalysisModalOpen] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'PRECISION' | 'EXPLORATION'>('PRECISION');

  // Batch Analysis Config Modal State
  const [isBatchConfigModalOpen, setIsBatchConfigModalOpen] = useState(false);
  const [batchConfig, setBatchConfig] = useState({
    basic: true,
    content: true,
    commercial: false,
    custom: ''
  });

  // Data Collection State (Sales Module)
  const [isCollectingSales, setIsCollectingSales] = useState(false);
  const [showUpdateToast, setShowUpdateToast] = useState(false);
  
  // Video Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);


  const selectedCreator = sortedCreators.find(c => c.id === selectedCreatorId) || sortedCreators[0];
  const report = selectedCreatorId ? (localReports[selectedCreatorId] || localReports['c1']) : localReports['c1'];

  const handleSelectCreator = (id: string) => {
    if (isSidebarSelectionMode) {
      if (selectedResultCreatorIds.includes(id)) {
        setSelectedResultCreatorIds(prev => prev.filter(pid => pid !== id));
      } else {
        setSelectedResultCreatorIds(prev => [...prev, id]);
      }
    } else {
      setSelectedCreatorId(id);
      setActiveView('CREATOR_DETAIL');
    }
  };

  const toggleSidebarSelectionMode = () => {
    setIsSidebarSelectionMode(!isSidebarSelectionMode);
    setSelectedResultCreatorIds([]);
  };

  // Batch Collection for Sidebar
  const handleBatchCollectSales = () => {
    setIsBatchCollecting(true);
    setTimeout(() => {
        // Update reports for all selected creators
        setLocalReports(prev => {
            const next = { ...prev };
            selectedResultCreatorIds.forEach(id => {
                if (next[id]) {
                    next[id] = {
                        ...next[id],
                        salesData: generateMockSalesData()
                    };
                }
            });
            return next;
        });
        
        setIsBatchCollecting(false);
        setIsSidebarSelectionMode(false);
        setSelectedResultCreatorIds([]);
        alert(`已成功更新 ${selectedResultCreatorIds.length} 位达人的带货数据。报告结论已根据最新数据自动优化。`);
    }, 1500);
  };

  // Single Collection for Detail View
  const handleCollectSingleSales = () => {
    setIsCollectingSales(true);
    setTimeout(() => {
        setLocalReports(prev => ({
            ...prev,
            [selectedCreator.id]: {
                ...prev[selectedCreator.id],
                salesData: generateMockSalesData()
            }
        }));
        setIsCollectingSales(false);
        setShowUpdateToast(true);
        setTimeout(() => setShowUpdateToast(false), 5000);
    }, 1500);
  };

  const handleRecalculateReport = () => {
      // Simulate report update
      alert("AI 已基于最新销售数据重新计算达人匹配度与合作建议。");
      setShowUpdateToast(false);
  };

  const handleDeepAnalysisStart = () => {
    setIsDeepAnalysisModalOpen(false);
    alert("已根据历史策略启动深度分析任务，请在历史记录中查看新生成的报告。");
    onBack();
  };

  const toggleSimilarSelection = (id: string) => {
    if (selectedSimilarIds.includes(id)) {
      setSelectedSimilarIds(prev => prev.filter(pid => pid !== id));
    } else {
      setSelectedSimilarIds(prev => [...prev, id]);
    }
  };

  const handleOpenBatchConfig = () => {
    if (selectedSimilarIds.length === 0) return;
    setIsBatchConfigModalOpen(true);
  };

  const executeBatchAnalysis = () => {
    setIsBatchConfigModalOpen(false);
    setIsBatchAnalyzing(true);

    setTimeout(() => {
        const toAdd = availableSimilarCreators.filter(c => selectedSimilarIds.includes(c.id));
        
        const enriched = toAdd.map(c => {
          const baseScore = Math.floor(Math.random() * 10) + 88; 
          const tags: string[] = [];
          
          if (batchConfig.basic) {
             const basicTags = ['受众高度重合', '性价比优', '粉丝画像匹配'];
             tags.push(basicTags[Math.floor(Math.random() * basicTags.length)]);
          }
          if (batchConfig.content) {
             const contentTags = ['内容质量S级', '植入自然', '创意表现佳', '完播率高'];
             tags.push(contentTags[Math.floor(Math.random() * contentTags.length)]);
          }
          if (batchConfig.commercial) {
             const commTags = ['高转化潜力', '预期ROI>2.5', '商业配合度高'];
             tags.push(commTags[Math.floor(Math.random() * commTags.length)]);
          }
          if (batchConfig.custom && batchConfig.custom.trim().length > 0) {
             tags.push('符合自定义策略');
          }
          if (baseScore > 92) tags.unshift('优先建联');

          return {
            ...c,
            matchScore: baseScore, 
            recommendReason: '批量分析推荐：各项指标表现优异，符合筛选策略',
            analysisTags: tags.slice(0, 3), 
            source: 'SMART_MATCHING' as const,
            lastAnalyzedAt: new Date().toISOString(),
            isNew: true 
          };
        });

        setLocalCreators(prev => [...prev, ...enriched]);
        setAvailableSimilarCreators(prev => prev.filter(c => !selectedSimilarIds.includes(c.id)));
        setSelectedSimilarIds([]);
        setIsBatchAnalyzing(false);
    }, 2000);
  };

  const handleSingleAddSimilar = async (id: string) => {
    setAnalyzingIds(prev => [...prev, id]);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const creator = availableSimilarCreators.find(c => c.id === id);
    if (!creator) {
        setAnalyzingIds(prev => prev.filter(pid => pid !== id));
        return;
    }
    const enriched = {
      ...creator,
      matchScore: Math.floor(Math.random() * 15) + 75,
      recommendReason: '基于相似达人挖掘推荐',
      source: 'SMART_MATCHING' as const,
      lastAnalyzedAt: new Date().toISOString(),
      isNew: true 
    };
    setLocalCreators(prev => [...prev, enriched]);
    setAvailableSimilarCreators(prev => prev.filter(c => c.id !== id));
    setAnalyzingIds(prev => prev.filter(pid => pid !== id));
  };
  
  const handleOpenVideoModal = (url: string) => {
    setSelectedVideoUrl(url);
    setIsVideoModalOpen(true);
  };

  const handleCloseVideoModal = () => {
    setIsVideoModalOpen(false);
    setSelectedVideoUrl(null);
  };


  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Left Sidebar: Creator List */}
      <div className="w-80 md:w-96 flex flex-col border-r border-gray-200 bg-white shadow-sm z-10 relative">
        {/* Product Header */}
        <div className="p-4 border-b border-gray-100 flex gap-3 bg-gray-50/50">
           <button onClick={onBack} className="text-gray-400 hover:text-gray-700 transition-colors">
             <ArrowLeft size={20} />
           </button>
           <div className="flex gap-3">
             <img src={record.product.image} className="w-12 h-12 rounded bg-white object-cover border border-gray-200" alt="product" />
             <div className="overflow-hidden">
                <h3 className="text-xs font-bold text-gray-900 truncate">{record.product.title}</h3>
                <p className="text-xs text-blue-600 font-medium">¥ {record.product.price}</p>
             </div>
           </div>
        </div>

        {/* Dashboard Entry */}
        <div 
            onClick={() => { setActiveView('OVERVIEW'); setSelectedCreatorId(null); setIsSidebarSelectionMode(false); }}
            className={`p-4 cursor-pointer border-b border-gray-100 flex items-center gap-3 transition-colors ${activeView === 'OVERVIEW' ? 'bg-blue-50 text-blue-700 border-l-4 border-l-blue-600' : 'hover:bg-gray-50 text-gray-700 border-l-4 border-l-transparent'}`}
        >
            <div className={`p-2 rounded-lg ${activeView === 'OVERVIEW' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <LayoutDashboard size={18} />
            </div>
            <div>
                <h3 className="text-sm font-bold">策略总结报告</h3>
                <p className="text-xs opacity-70">AI复盘与深度分析入口</p>
            </div>
        </div>

        {/* List Header */}
        <div className="p-3 bg-white border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">匹配结果 ({sortedCreators.length})</h3>
          <button 
             onClick={toggleSidebarSelectionMode}
             className={`text-xs px-2 py-1 rounded transition-colors ${isSidebarSelectionMode ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'}`}
          >
             {isSidebarSelectionMode ? '完成' : '批量操作'}
          </button>
        </div>
        
        {/* Creator List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-gray-50/30 pb-20">
          {sortedCreators.map(creator => (
            <div 
              key={creator.id}
              onClick={() => handleSelectCreator(creator.id)}
              className={`p-3 rounded-lg border cursor-pointer transition-all relative ${
                selectedCreatorId === creator.id && activeView !== 'OVERVIEW' && !isSidebarSelectionMode
                ? 'bg-white border-blue-500 shadow-md ring-1 ring-blue-100' 
                : isSidebarSelectionMode && selectedResultCreatorIds.includes(creator.id)
                ? 'bg-blue-50 border-blue-500 shadow-sm'
                : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
              }`}
            >
              <div className="flex gap-3 relative">
                 {/* Checkbox for selection mode */}
                 {isSidebarSelectionMode && (
                    <div className="flex items-center justify-center">
                        <input 
                            type="checkbox"
                            checked={selectedResultCreatorIds.includes(creator.id)}
                            onChange={() => {}} // handled by parent div click
                            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 pointer-events-none"
                        />
                    </div>
                 )}

                <div className="relative">
                    <img src={creator.avatar} className="w-10 h-10 rounded-full bg-gray-100" alt={creator.nickname} />
                    {creator.isNew && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white animate-scaleIn">
                            NEW
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-sm text-gray-900 truncate">{creator.nickname}</span>
                    <span className={`text-sm font-bold ${creator.matchScore && creator.matchScore > 80 ? 'text-green-600' : 'text-amber-500'}`}>
                      {creator.matchScore}分
                    </span>
                  </div>
                  {creator.analysisTags && creator.analysisTags.length > 0 ? (
                    <div className="flex gap-1 mt-1 flex-wrap">
                        {creator.analysisTags.map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-100 font-medium">
                                {tag}
                            </span>
                        ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 truncate mt-0.5">{creator.recommendReason || creator.notRecommendReason}</p>
                  )}
                </div>
              </div>
              
              <div className="mt-3 flex justify-between items-center pt-2 border-t border-gray-50">
                <button 
                  onClick={(e) => { e.stopPropagation(); setActiveView('SIMILAR'); setSelectedCreatorId(creator.id); }}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center hover:underline"
                >
                  找相似 <ChevronRight size={12} />
                </button>
                <div className="flex gap-2 text-gray-400">
                  <Star size={14} className="hover:text-yellow-400 cursor-pointer transition-colors" />
                  <Plus size={14} className="hover:text-blue-600 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Batch Action Bar */}
        {isSidebarSelectionMode && selectedResultCreatorIds.length > 0 && (
            <div className="absolute bottom-4 left-4 right-4 bg-white border border-gray-200 shadow-xl rounded-xl p-3 z-20 animate-slideUp">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-gray-500">已选 {selectedResultCreatorIds.length} 位</span>
                    <button onClick={() => setSelectedResultCreatorIds([])} className="text-xs text-gray-400">清空</button>
                </div>
                <button 
                    onClick={handleBatchCollectSales}
                    disabled={isBatchCollecting}
                    className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1.5"
                >
                    {isBatchCollecting ? <Loader size={12} className="animate-spin" /> : <Zap size={12} />}
                    采集带货数据
                </button>
            </div>
        )}
      </div>

      {/* Right Content Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 relative">
        
        {/* Success Toast for Data Update */}
        {showUpdateToast && (
             <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-white border border-green-200 shadow-lg rounded-full px-6 py-3 flex items-center gap-4 z-30 animate-slideUp">
                 <div className="flex items-center gap-2">
                     <CheckCircle size={18} className="text-green-500" />
                     <span className="text-sm font-medium text-gray-800">带货数据已更新</span>
                 </div>
                 <div className="h-4 w-px bg-gray-200"></div>
                 <button 
                    onClick={handleRecalculateReport}
                    className="text-sm font-bold text-blue-600 hover:text-blue-800"
                 >
                     立即刷新报告结论
                 </button>
             </div>
        )}

        {/* View: Strategy Dashboard (OVERVIEW) */}
        {activeView === 'OVERVIEW' && (
             <div className="max-w-5xl mx-auto p-6 md:p-10 animate-fadeIn space-y-8">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                           <Sparkles className="text-purple-500" /> 选达人策略总结报告
                        </h1>
                        <p className="text-gray-500 mt-2">基于本次筛选数据生成的AI复盘报告，助您优化后续策略。</p>
                    </div>
                    <button 
                        onClick={() => setIsDeepAnalysisModalOpen(true)}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <Microscope size={20} />
                        基于此结果深度分析
                    </button>
                </div>

                {/* Funnel & Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Funnel */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm lg:col-span-2">
                        <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                            <Filter size={18} className="text-blue-500" /> 筛选漏斗分析
                        </h3>
                        <div className="flex items-center justify-between relative px-4">
                            {/* Line */}
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -z-10 transform -translate-y-1/2"></div>
                            
                            {[
                                { label: 'AI分析达人', val: record.creatorCount, color: 'bg-gray-200', text: 'text-gray-600' },
                                { label: '推荐建联', val: record.recommendedCount, color: 'bg-blue-100', text: 'text-blue-600' },
                                { label: '成功触达', val: record.contactedCount, color: 'bg-purple-100', text: 'text-purple-600' },
                                { label: '达成合作', val: record.collaboratedCount, color: 'bg-green-100', text: 'text-green-600' },
                            ].map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center bg-white px-2">
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl mb-3 shadow-sm ${step.color} ${step.text}`}>
                                        {step.val}
                                    </div>
                                    <span className="text-sm font-bold text-gray-700">{step.label}</span>
                                    {idx > 0 && (
                                        <span className="text-xs text-gray-400 mt-1">
                                            {Math.round((step.val / record.creatorCount) * 100)}% 转化
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Performance Highlight */}
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="font-medium text-indigo-100 mb-1">群体平均转化率</h3>
                            <div className="text-4xl font-bold mb-4">{record.strategySummary?.conversionRate}%</div>
                            <div className="flex flex-wrap gap-2">
                                {record.strategySummary?.highConversionTraits.map((trait, i) => (
                                    <span key={i} className="px-2 py-1 bg-white/20 rounded text-xs backdrop-blur-sm">
                                        {trait}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <Brain className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10" />
                    </div>
                </div>

                {/* AI Text Analysis */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100 flex items-center gap-2">
                        <Brain size={20} className="text-blue-600" />
                        <h3 className="font-bold text-blue-900">AI 策略洞察</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        <div>
                            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-2 text-gray-500">当前策略复盘</h4>
                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                                {record.strategySummary?.overview}
                            </p>
                        </div>
                        <div>
                             <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide mb-2 flex items-center gap-2 text-indigo-600">
                                <Zap size={16} /> 下一步优化建议
                             </h4>
                             <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 text-indigo-900 flex gap-3">
                                <ArrowRight className="flex-shrink-0 mt-1" size={18} />
                                <p>{record.strategySummary?.optimizationTips}</p>
                             </div>
                        </div>
                    </div>
                </div>
             </div>
        )}

        {/* View: Creator Detail Report */}
        {activeView === 'CREATOR_DETAIL' && (
          <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6 animate-fadeIn">
            {/* ... Existing Creator Detail Code ... */}
            <div className="flex items-center justify-between mb-4">
               <div>
                 <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2 inline-block">正在分析</span>
                 <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                   {selectedCreator.nickname}
                   <span className="text-sm font-normal text-gray-500 ml-2">ID: {selectedCreator.id}</span>
                 </h1>
               </div>
               <div className="flex gap-3">
                 <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
                    <Star size={16} /> 收藏
                 </button>
                 <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                    <Plus size={16} /> 加入达人池
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-4 gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
               <div className="text-center border-r border-gray-100">
                 <div className="text-2xl font-bold text-gray-900">{(selectedCreator.followers / 1000).toFixed(1)}K</div>
                 <div className="text-xs text-gray-500 mt-1">粉丝数</div>
               </div>
               <div className="text-center border-r border-gray-100">
                 <div className="text-2xl font-bold text-gray-900">{selectedCreator.videos}</div>
                 <div className="text-xs text-gray-500 mt-1">视频数</div>
               </div>
               <div className="text-center border-r border-gray-100">
                 <div className="text-2xl font-bold text-gray-900">{selectedCreator.engagementRate}%</div>
                 <div className="text-xs text-gray-500 mt-1">互动率</div>
               </div>
               <div className="text-center">
                 <div className={`text-2xl font-bold ${selectedCreator.matchScore && selectedCreator.matchScore > 80 ? 'text-green-600' : 'text-amber-500'}`}>
                    {selectedCreator.matchScore}
                 </div>
                 <div className="text-xs text-gray-500 mt-1">AI 匹配度</div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left: Fan Demographics */}
              <div className="bg-white p-6 pb-5 rounded-xl border border-gray-200 shadow-sm h-full">
                <h3 className="font-bold text-gray-800 mb-6">粉丝画像</h3>
                
                {/* Gender Distribution */}
                <div className="mb-8">
                  <h4 className="text-sm text-gray-600 mb-3">性别分布</h4>
                  {(() => {
                    const male = report.audience.gender.find(g => g.name === '男')?.value || 0;
                    const female = report.audience.gender.find(g => g.name === '女')?.value || 0;
                    const total = male + female || 1;
                    const malePct = Math.round((male / total) * 100);
                    const femalePct = 100 - malePct;
                    
                    return (
                      <div className="w-full h-8 flex rounded-full overflow-hidden text-xs font-bold text-white">
                        <div style={{ width: `${malePct}%` }} className="bg-blue-500 flex items-center justify-center pl-2">
                          男性 {malePct}%
                        </div>
                        <div style={{ width: `${femalePct}%` }} className="bg-pink-500 flex items-center justify-center pr-2">
                          女性 {femalePct}%
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Age Distribution */}
                <div>
                  <h4 className="text-sm text-gray-600 mb-3">年龄分布</h4>
                  <div className="space-y-4">
                    {report.audience.age.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 text-sm">
                         <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div style={{ width: `${item.value}%` }} className="h-full bg-cyan-400 rounded-full"></div>
                         </div>
                         <span className="w-24 text-gray-600 text-xs text-right whitespace-nowrap">{item.name} {item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right: Sales Capability Module */}
              <div className="bg-white p-6 pb-5 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col relative overflow-hidden">
                 <div className="flex justify-between items-center mb-4">
                     <h3 className="font-bold text-gray-800">带货能力</h3>
                     <button 
                        onClick={handleCollectSingleSales}
                        disabled={isCollectingSales}
                        className={`text-xs px-2.5 py-1 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
                            isCollectingSales 
                            ? 'bg-gray-100 text-gray-400 border-gray-200' 
                            : 'bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100'
                        }`}
                     >
                        {isCollectingSales ? (
                            <>
                                <Loader size={12} className="animate-spin" />
                                采集中...
                            </>
                        ) : (
                            <>
                                <RefreshCw size={12} />
                                {report.salesData ? '更新数据' : '采集数据'}
                            </>
                        )}
                     </button>
                 </div>

                 {report.salesData ? (
                    <div className="flex-1 flex flex-col gap-4 animate-fadeIn">
                        {/* Overall Stats - Top Card */}
                        <div className="grid grid-cols-3 gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                             <div className="text-center">
                                 <div className="text-xs text-gray-500 mb-1">近30天GMV</div>
                                 <div className="text-base font-bold text-gray-900">¥{(report.salesData.last30Days.gmv/1000).toFixed(1)}k</div>
                             </div>
                             <div className="text-center">
                                 <div className="text-xs text-gray-500 mb-1">销量</div>
                                 <div className="text-base font-bold text-gray-900">{report.salesData.last30Days.itemsSold}</div>
                             </div>
                             <div className="text-center">
                                 <div className="text-xs text-gray-500 mb-1">平均客单价</div>
                                 <div className="text-base font-bold text-gray-900">¥{report.salesData.last30Days.avgPrice}</div>
                             </div>
                        </div>

                        {/* Video & Live Stats - Middle Section, expanded to fill available space */}
                        <div className="grid grid-cols-2 gap-4 flex-1">
                             {/* Video */}
                             <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-between">
                                 <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-2">
                                     <Video size={14} className="text-blue-500" /> 视频带货
                                 </div>
                                 <div className="space-y-3 flex-1 flex flex-col justify-center">
                                     <div className="flex justify-between items-center text-xs">
                                         <span className="text-gray-500">视频数</span>
                                         <span className="font-bold text-gray-900 text-sm">{report.salesData.video.count}</span>
                                     </div>
                                     <div className="flex justify-between items-center text-xs">
                                         <span className="text-gray-500">GOM</span>
                                         <span className="font-bold text-gray-900 text-sm">¥{report.salesData.video.gom}</span>
                                     </div>
                                     <div className="flex justify-between items-center text-xs">
                                         <span className="text-gray-500">平均浏览</span>
                                         <span className="font-bold text-gray-900 text-sm">{(report.salesData.video.avgViews/1000).toFixed(1)}k</span>
                                     </div>
                                     <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-200 border-dashed">
                                         <span className="text-gray-500">预估销售</span>
                                         <span className="font-bold text-blue-600 text-sm">¥{(report.salesData.video.sales/1000).toFixed(1)}k</span>
                                     </div>
                                 </div>
                             </div>

                             {/* Live */}
                             <div className="bg-gray-50 p-4 rounded-lg flex flex-col justify-between">
                                 <div className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 border-b border-gray-200 pb-2">
                                     <Radio size={14} className="text-pink-500" /> 直播带货
                                 </div>
                                 <div className="space-y-3 flex-1 flex flex-col justify-center">
                                     <div className="flex justify-between items-center text-xs">
                                         <span className="text-gray-500">场次数</span>
                                         <span className="font-bold text-gray-900 text-sm">{report.salesData.live.count}</span>
                                     </div>
                                     <div className="flex justify-between items-center text-xs">
                                         <span className="text-gray-500">GPM</span>
                                         <span className="font-bold text-gray-900 text-sm">¥{report.salesData.live.gpm}</span>
                                     </div>
                                     <div className="flex justify-between items-center text-xs">
                                         <span className="text-gray-500">平均观看</span>
                                         <span className="font-bold text-gray-900 text-sm">{(report.salesData.live.avgViews/1000).toFixed(1)}k</span>
                                     </div>
                                     <div className="flex justify-between items-center text-xs pt-1 border-t border-gray-200 border-dashed">
                                         <span className="text-gray-500">预估销售</span>
                                         <span className="font-bold text-blue-600 text-sm">¥{(report.salesData.live.sales/1000).toFixed(1)}k</span>
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {report.salesData.updatedAt && (
                            <div className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1 pt-2">
                                <Clock size={10} />
                                数据更新于 {new Date(report.salesData.updatedAt).toLocaleDateString()}
                            </div>
                        )}
                    </div>
                 ) : (
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 relative">
                            <BarChart3 className="text-gray-300" size={32} />
                            {isCollectingSales && (
                                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                            )}
                        </div>
                        <span className="text-lg font-medium text-gray-900">暂无数据</span>
                        <p className="text-xs text-gray-400 mt-2 text-center max-w-[200px]">
                            {isCollectingSales ? "正在从达人后台拉取销售数据..." : "点击右上角采集按钮，获取近30天带货数据以辅助决策"}
                        </p>
                    </div>
                 )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">深度匹配分析</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                    { 
                        label: '受众重合度', 
                        data: report.matchDetails.audienceOverlap, 
                        icon: <Target className="text-blue-500" /> 
                    },
                    { 
                        label: '内容相关性', 
                        data: report.matchDetails.contentRelevance, 
                        icon: <BarChart3 className="text-purple-500" /> 
                    },
                    { 
                        label: '推广潜力', 
                        data: report.matchDetails.promotionPotential, 
                        icon: <Zap className="text-yellow-500" /> 
                    },
                    { 
                        label: '互动质量', 
                        data: report.matchDetails.engagementQuality, 
                        icon: <ThumbsUp className="text-green-500" /> 
                    },
                ].map((item, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-gray-50 rounded-lg">{item.icon}</div>
                            <span className="font-bold text-gray-800">{item.label}</span>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-bold text-blue-600">{item.data.score}</span>
                            <span className="text-xs text-gray-400">综合得分</span>
                        </div>
                    </div>
                    
                    <div className="w-full bg-gray-100 h-2 rounded-full mb-4 overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${item.data.score}%` }}></div>
                    </div>

                    <ul className="space-y-3">
                        {item.data.items.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-gray-600">
                                <div className="mt-0.5 min-w-4 w-4 h-4 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                    <Check size={10} strokeWidth={3} />
                                </div>
                                <span>{detail}</span>
                            </li>
                        ))}
                    </ul>
                    </div>
                ))}
                </div>
                {/* Relevant videos now live inside the Deep Match Analysis module */}
                {report.relevantVideos && report.relevantVideos.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-md font-bold text-gray-800 mb-4">相关视频分析</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {report.relevantVideos.map(video => (
                        <div key={video.id} className="bg-gray-50 rounded-lg border border-gray-100 overflow-hidden group transition-shadow hover:shadow-lg">
                            <div 
                                className="relative cursor-pointer"
                                onClick={() => handleOpenVideoModal(video.videoUrl)}
                            >
                                <img src={video.thumbnailUrl} alt={video.title} className="w-full h-40 object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle size={48} className="text-white/80" />
                                </div>
                            </div>
                            <div className="p-4">
                                <h5 className="font-bold text-gray-900 truncate text-sm">{video.title}</h5>
                                <p className="text-xs text-gray-500 mb-3">{video.views.toLocaleString()} views</p>
                                <div className="flex flex-wrap gap-2">
                                    {video.tags.slice(0, 4).map(tag => ( // Show up to 4 tags
                                        <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTagColor(tag)}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                    </div>
                </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="bg-green-50/50 p-6 rounded-xl border border-green-100">
                  <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
                    <ThumbsUp size={18} /> 合作优势
                  </h3>
                  <ul className="space-y-2">
                    {report.swot.advantages.map((point, i) => (
                      <li key={i} className="flex gap-2 text-sm text-green-900">
                        <span className="text-green-500 font-bold">•</span> {point}
                      </li>
                    ))}
                  </ul>
               </div>
               <div className="bg-red-50/50 p-6 rounded-xl border border-red-100">
                  <h3 className="font-bold text-red-800 mb-4 flex items-center gap-2">
                    <AlertTriangle size={18} /> 潜在风险
                  </h3>
                  <ul className="space-y-2">
                    {report.swot.risks.map((point, i) => (
                      <li key={i} className="flex gap-2 text-sm text-red-900">
                        <span className="text-red-500 font-bold">•</span> {point}
                      </li>
                    ))}
                  </ul>
               </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
               <h3 className="text-lg font-bold text-gray-900">合作建议</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase">建议合作形式</label>
                   <p className="mt-1 text-gray-900 font-medium">{report.suggestions.format}</p>
                 </div>
                 <div>
                   <label className="text-xs font-bold text-gray-500 uppercase">建议报价区间</label>
                   <p className="mt-1 text-gray-900 font-medium">{report.suggestions.commission}</p>
                 </div>
               </div>

               <div>
                 <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">视频脚本思路</label>
                 <div className="space-y-2 mb-3">
                   {report.suggestions.scripts.map((script, i) => (
                     <div key={i} className="bg-gray-50 p-3 rounded text-sm text-gray-700 border border-gray-100">
                       <span className="font-bold text-blue-600 mr-2">Idea {i+1}:</span> {script}
                     </div>
                   ))}
                 </div>
                 <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm">
                    <Lock size={16} />
                    解锁爆款视频分析
                 </button>
               </div>

               <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block flex items-center gap-2">
                    <MessageSquare size={14} /> 邀约话术参考
                  </label>
                  <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 text-sm text-gray-700 italic mb-3">
                    "{report.suggestions.message}"
                  </div>
                  <button className="w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
                    <Send size={16} />
                    一键发消息
                  </button>
               </div>
            </div>
            
            <div className="h-10"></div>
          </div>
        )}

        {/* View: Similar Creators */}
        {activeView === 'SIMILAR' && (
          <div className="max-w-5xl mx-auto p-6 md:p-10 animate-fadeIn relative pb-24">
            <div className="flex items-center gap-4 mb-6">
              <button 
                onClick={() => setActiveView('CREATOR_DETAIL')}
                className="flex items-center gap-1 text-gray-500 hover:text-gray-900 font-medium"
              >
                <ArrowLeft size={18} /> 返回报告
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h2 className="text-xl font-bold text-gray-900">
                与 "{selectedCreator.nickname}" 相似的达人
              </h2>
            </div>
            
            {availableSimilarCreators.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <CheckCircle2 size={48} className="mb-4 text-green-500 opacity-80" />
                    <p>暂无更多相似达人推荐</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableSimilarCreators.map(simCreator => {
                    const isAnalyzing = analyzingIds.includes(simCreator.id);
                    return (
                    <div 
                        key={simCreator.id} 
                        className={`bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition-all cursor-pointer ${selectedSimilarIds.includes(simCreator.id) ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50/30' : 'border-gray-200'}`}
                        onClick={() => toggleSimilarSelection(simCreator.id)}
                    >
                        <div className="flex justify-between mb-2">
                             <div className="flex items-start gap-4 overflow-hidden">
                                <div className="relative flex-shrink-0">
                                    <img src={simCreator.avatar} className="w-14 h-14 rounded-full" alt={simCreator.nickname} />
                                    {selectedSimilarIds.includes(simCreator.id) && (
                                        <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white rounded-full p-0.5 border-2 border-white">
                                            <Check size={10} />
                                        </div>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 
                                        className="font-bold text-gray-900 truncate" 
                                        title={simCreator.nickname}
                                    >
                                        {simCreator.nickname}
                                    </h3>
                                    <p className="text-xs text-gray-500">{simCreator.region}</p>
                                    <div className="mt-1 text-xs bg-green-50 text-green-700 inline-block px-2 py-0.5 rounded">
                                    相似度 {Math.floor(Math.random() * 10) + 80}%
                                    </div>
                                </div>
                            </div>
                            <input 
                                type="checkbox"
                                checked={selectedSimilarIds.includes(simCreator.id)}
                                onChange={() => {}} // Handled by div click
                                className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500 pointer-events-none flex-shrink-0"
                            />
                        </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mb-4 bg-gray-50 p-2 rounded">
                        <div className="text-center">
                        <div className="font-bold text-gray-900">{simCreator.followers/1000}K</div>
                        <div>粉丝</div>
                        </div>
                        <div className="text-center">
                        <div className="font-bold text-gray-900">{simCreator.videos}</div>
                        <div>视频</div>
                        </div>
                        <div className="text-center">
                        <div className="font-bold text-gray-900">{simCreator.engagementRate}%</div>
                        <div>互动</div>
                        </div>
                    </div>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isAnalyzing) {
                                handleSingleAddSimilar(simCreator.id);
                            }
                        }}
                        disabled={isAnalyzing}
                        className={`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                            isAnalyzing 
                                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed' 
                                : 'bg-white border border-blue-600 text-blue-600 hover:bg-blue-50'
                        }`}
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader size={14} className="animate-spin" /> 分析中...
                            </>
                        ) : '开始分析'}
                    </button>
                    </div>
                )})}
                </div>
            )}

            {/* Batch Operation Floating Bar */}
            {selectedSimilarIds.length > 0 && (
                <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-auto min-w-[400px] flex items-center justify-between z-20 animate-slideUp">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
                        {selectedSimilarIds.length}
                        </div>
                        <span className="text-sm font-medium text-gray-700">已选择达人</span>
                        <div className="h-4 w-px bg-gray-300 mx-2"></div>
                        <button 
                        onClick={() => setSelectedSimilarIds([])}
                        className="text-sm text-gray-500 hover:text-gray-800"
                        >
                        取消选择
                        </button>
                    </div>
                    <button 
                        onClick={handleOpenBatchConfig}
                        disabled={isBatchAnalyzing}
                        className={`px-6 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all ${isBatchAnalyzing ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                        {isBatchAnalyzing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                分析中...
                            </>
                        ) : (
                            <>
                                <Zap size={16} /> 批量AI分析
                            </>
                        )}
                    </button>
                </div>
            )}
          </div>
        )}

        {/* Video Player Modal */}
        {isVideoModalOpen && selectedVideoUrl && (
            <div 
                className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn"
                onClick={handleCloseVideoModal}
            >
                <div 
                    className="bg-black rounded-lg w-full max-w-4xl shadow-2xl transform transition-all animate-scaleIn aspect-video relative"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on video
                >
                    <button 
                        onClick={handleCloseVideoModal} 
                        className="absolute -top-4 -right-4 z-10 w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center hover:bg-white/40 transition-colors"
                    >
                        <X size={20} />
                    </button>
                    <video 
                        src={selectedVideoUrl} 
                        controls 
                        autoPlay 
                        className="w-full h-full rounded-lg"
                    >
                        Your browser does not support the video tag.
                    </video>
                </div>
            </div>
        )}
      </div>

      {/* Overview Page Deep Analysis Modal */}
      {isDeepAnalysisModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl transform transition-all animate-scaleIn">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Microscope className="text-indigo-600" />
                        深度迭代分析配置
                    </h2>
                    <button onClick={() => setIsDeepAnalysisModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100">
                        <span className="font-bold block mb-1">🎯 目标：</span>
                        基于当前 {record.creatorCount} 位达人的分析结果，AI 将自动学习高转化特征（如：{record.strategySummary?.highConversionTraits.join('、')}），进行更精准的二次筛选。
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-3">选择分析模式</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div 
                                onClick={() => setAnalysisMode('PRECISION')}
                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${analysisMode === 'PRECISION' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className="flex items-center gap-2 mb-2 font-bold text-gray-900">
                                    <Target size={18} className={analysisMode === 'PRECISION' ? 'text-indigo-600' : 'text-gray-400'} />
                                    精准收敛模式
                                </div>
                                <p className="text-xs text-gray-500">仅保留与高转化案例相似度 &gt;90% 的达人，大幅提升匹配精度，适合确定性投放。</p>
                            </div>
                            <div 
                                onClick={() => setAnalysisMode('EXPLORATION')}
                                className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${analysisMode === 'EXPLORATION' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <div className="flex items-center gap-2 mb-2 font-bold text-gray-900">
                                    <Zap size={18} className={analysisMode === 'EXPLORATION' ? 'text-indigo-600' : 'text-gray-400'} />
                                    探索拓展模式
                                </div>
                                <p className="text-xs text-gray-500">基于高转化特征，向外拓展相似圈层，寻找未被发掘的潜力新星。</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">额外筛选条件 (可选)</label>
                        <div className="flex gap-2">
                             <span className="px-3 py-1 bg-gray-100 rounded-full text-xs text-gray-600 flex items-center gap-1">
                                粉丝数 &gt; 50k <X size={12} className="cursor-pointer" />
                             </span>
                             <button className="px-3 py-1 border border-dashed border-gray-300 rounded-full text-xs text-gray-500 hover:border-gray-400">
                                + 添加条件
                             </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                    <button 
                        onClick={() => setIsDeepAnalysisModalOpen(false)}
                        className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        取消
                    </button>
                    <button 
                        onClick={handleDeepAnalysisStart}
                        className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    >
                        <Sparkles size={18} />
                        开始深度分析
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Batch Analysis Config Modal */}
      {isBatchConfigModalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                        <Sliders size={18} className="text-blue-600"/>
                        配置批量分析维度
                    </h3>
                    <button onClick={() => setIsBatchConfigModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-500 mb-4">
                        将对选中的 <span className="font-bold text-blue-600">{selectedSimilarIds.length}</span> 位达人进行AI评估。分析完成后，结果将自动刷新至左侧列表。
                    </p>

                    <div className="space-y-3">
                        <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${batchConfig.basic ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:border-blue-200'}`}>
                            <input 
                                type="checkbox" 
                                checked={batchConfig.basic}
                                onChange={(e) => setBatchConfig({...batchConfig, basic: e.target.checked})}
                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="block text-sm font-bold text-gray-900">基础对比分析 (必选)</span>
                                <span className="block text-xs text-gray-500">对比粉丝画像重合度、互动率分布、预估报价区间。</span>
                            </div>
                        </label>

                        <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${batchConfig.content ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:border-blue-200'}`}>
                            <input 
                                type="checkbox" 
                                checked={batchConfig.content}
                                onChange={(e) => setBatchConfig({...batchConfig, content: e.target.checked})}
                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="block text-sm font-bold text-gray-900">内容质量评估</span>
                                <span className="block text-xs text-gray-500">AI 扫描近期视频，评估创意水平、制作精良度及广告植入自然度。</span>
                            </div>
                        </label>

                        <label className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${batchConfig.commercial ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:border-blue-200'}`}>
                            <input 
                                type="checkbox" 
                                checked={batchConfig.commercial}
                                onChange={(e) => setBatchConfig({...batchConfig, commercial: e.target.checked})}
                                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <div>
                                <span className="block text-sm font-bold text-gray-900">商业价值预测</span>
                                <span className="block text-xs text-gray-500">基于历史带货数据模型，预测潜在转化率及合作风险等级。</span>
                            </div>
                        </label>
                    </div>

                    <div className="pt-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">自定义分析指令 (可选)</label>
                        <textarea 
                            value={batchConfig.custom}
                            onChange={(e) => setBatchConfig({...batchConfig, custom: e.target.value})}
                            placeholder="例如：分析谁的视频风格更符合'国潮'审美..."
                            className="w-full p-3 border border-gray-300 rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-blue-500 outline-none"
                        ></textarea>
                    </div>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center bg-gray-50">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Coins size={14} className="text-yellow-500"/>
                        预计消耗 <span className="font-bold text-gray-800">120</span> AI算力点
                    </div>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsBatchConfigModalOpen(false)}
                            className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg text-sm"
                        >
                            取消
                        </button>
                        <button 
                            onClick={executeBatchAnalysis}
                            className="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm shadow hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            <Zap size={16} />
                            开始分析
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AnalysisResult;