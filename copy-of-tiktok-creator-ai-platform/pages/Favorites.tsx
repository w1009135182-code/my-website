import React, { useState } from 'react';
import { Search, Star, Plus, Trash2, Zap, ExternalLink, Filter, TrendingUp, X, CheckCircle, FileText, RefreshCw, Bot, Flame, Clock } from 'lucide-react';
import { MOCK_CREATORS, MOCK_PRODUCTS } from '../constants';
import { Creator } from '../types';

interface Props {
  onViewAnalysis?: () => void;
}

// Mock current date to demonstrate different statuses based on mock data dates (2023-10-20 to 2023-10-24)
const MOCK_NOW = new Date('2023-10-25').getTime();
const STALE_THRESHOLD_DAYS = 3;

const Favorites: React.FC<Props> = ({ onViewAnalysis }) => {
  const [favorites, setFavorites] = useState<Creator[]>(MOCK_CREATORS.filter(c => c.isFavorite));
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  
  // Modal states
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [analysisStep, setAnalysisStep] = useState<'SELECT' | 'SUCCESS'>('SELECT');

  const filteredProducts = MOCK_PRODUCTS.filter(p => 
    p.title.toLowerCase().includes(productSearch.toLowerCase())
  );

  const toggleAll = () => {
    if (selectedCreatorIds.length === favorites.length) {
      setSelectedCreatorIds([]);
    } else {
      setSelectedCreatorIds(favorites.map(c => c.id));
    }
  };

  const toggleCreator = (id: string) => {
    if (selectedCreatorIds.includes(id)) {
      setSelectedCreatorIds(selectedCreatorIds.filter(cid => cid !== id));
    } else {
      setSelectedCreatorIds([...selectedCreatorIds, id]);
    }
  };

  const handleRemoveFavorite = (id: string) => {
    if (window.confirm('确认将该达人从收藏夹移除吗？')) {
      setFavorites(favorites.filter(c => c.id !== id));
      setSelectedCreatorIds(selectedCreatorIds.filter(cid => cid !== id));
    }
  };

  const handleBatchRemove = () => {
    if (window.confirm(`确认将选中的 ${selectedCreatorIds.length} 位达人从收藏夹移除吗？`)) {
      setFavorites(favorites.filter(c => !selectedCreatorIds.includes(c.id)));
      setSelectedCreatorIds([]);
    }
  };

  const handleAddToPool = (count: number) => {
    alert(`成功将 ${count} 位达人加入"我的达人池"`);
    setSelectedCreatorIds([]);
  };

  const handleAnalyze = (ids: string[]) => {
    setSelectedCreatorIds(ids);
    setAnalysisStep('SELECT');
    setProductSearch('');
    setSelectedProductId('');
    setIsBatchModalOpen(true);
  };
  
  const handleViewReport = (id: string) => {
    if (onViewAnalysis) onViewAnalysis();
  };

  const handleBatchAnalyzeClick = () => {
    setAnalysisStep('SELECT');
    setProductSearch('');
    setSelectedProductId('');
    setIsBatchModalOpen(true);
  };

  const confirmBatchAnalysis = () => {
    setTimeout(() => {
        setAnalysisStep('SUCCESS');
        // Update local state to show as analyzed for demo purposes
        setFavorites(prev => prev.map(c => 
            selectedCreatorIds.includes(c.id) ? { ...c, lastAnalyzedAt: new Date().toISOString() } : c
        ));
    }, 500);
  };

  const handleCloseModal = () => {
    setIsBatchModalOpen(false);
    setSelectedCreatorIds([]);
    setSelectedProductId('');
  };

  const handleGoToResults = () => {
    handleCloseModal();
    if (onViewAnalysis) {
      onViewAnalysis();
    }
  };

  // Helper to determine status
  const getAnalysisStatus = (creator: Creator) => {
    if (!creator.lastAnalyzedAt) {
        return {
            type: 'UNANALYZED',
            label: '未分析',
            icon: <Zap size={10} />,
            colorClass: 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200 hover:text-gray-700',
            action: () => handleAnalyze([creator.id])
        };
    }

    const analyzedDate = new Date(creator.lastAnalyzedAt).getTime();
    const daysDiff = (MOCK_NOW - analyzedDate) / (1000 * 3600 * 24);

    if (daysDiff > STALE_THRESHOLD_DAYS) {
        return {
            type: 'STALE',
            label: '可更新',
            icon: <RefreshCw size={10} />,
            colorClass: 'bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100',
            action: () => handleAnalyze([creator.id])
        };
    }

    return {
        type: 'ANALYZED',
        label: '已分析',
        icon: <CheckCircle size={10} />,
        colorClass: 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100',
        action: () => handleViewReport(creator.id)
    };
  };

  return (
    <div className="p-8 max-w-7xl mx-auto relative min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-lg text-yellow-600">
                <Star size={24} fill="currentColor" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-900">收藏达人</h1>
                <p className="text-sm text-gray-500">管理您关注的优质达人资源</p>
            </div>
        </div>
        <div className="text-sm text-gray-500">
            共收藏 <span className="font-bold text-gray-900">{favorites.length}</span> 位达人
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex justify-between items-center">
         <div className="relative w-64">
            <input 
                type="text" 
                placeholder="搜索达人昵称..." 
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
         </div>
         <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                <Filter size={16} /> 筛选
            </button>
         </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-20">
         <table className="w-full text-left border-collapse">
           <thead className="bg-gray-50 border-b border-gray-200">
             <tr>
               <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-12">
                 <input 
                   type="checkbox" 
                   className="rounded text-blue-600 focus:ring-blue-500"
                   checked={favorites.length > 0 && selectedCreatorIds.length === favorites.length}
                   onChange={toggleAll}
                 />
               </th>
               <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">达人信息</th>
               <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">来源</th>
               <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">垂类标签</th>
               <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">粉丝数</th>
               <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">操作</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-gray-100">
             {favorites.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                        暂无收藏达人，去"热门达人"逛逛吧
                    </td>
                </tr>
             ) : (
                favorites.map((creator) => {
                    const status = getAnalysisStatus(creator);
                    return (
                        <tr key={creator.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                                <input 
                                type="checkbox" 
                                className="rounded text-blue-600 focus:ring-blue-500"
                                checked={selectedCreatorIds.includes(creator.id)}
                                onChange={() => toggleCreator(creator.id)}
                                />
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                <img src={creator.avatar} className="w-10 h-10 rounded-full bg-gray-200" alt="" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold text-gray-900">{creator.nickname}</div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); status.action(); }}
                                            className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold border transition-colors cursor-pointer ${status.colorClass}`}
                                            title={status.type === 'ANALYZED' ? '点击查看历史分析' : '点击进行分析'}
                                        >
                                            {status.icon}
                                            {status.label}
                                        </button>
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">{creator.region}</div>
                                    <a 
                                    href="#" 
                                    className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 hover:underline border border-blue-200 bg-blue-50 px-2 py-0.5 rounded transition-colors"
                                    onClick={(e) => e.preventDefault()}
                                    >
                                    View TikTok Profile <ExternalLink size={10} />
                                    </a>
                                </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                {creator.source === 'SMART_MATCHING' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                                        <Bot size={10} /> 智能匹配
                                    </span>
                                ) : creator.source === 'HOT_CREATORS' ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-100">
                                        <Flame size={10} /> 热门榜单
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                                        其他
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-1 flex-wrap">
                                {creator.tags.slice(0, 2).map(t => (
                                    <span key={t} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{t}</span>
                                ))}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{(creator.followers/1000).toFixed(1)}K</div>
                                <div className="text-xs text-green-500 flex items-center gap-0.5">
                                <TrendingUp size={10} /> +2.5%
                                </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button 
                                        onClick={() => handleRemoveFavorite(creator.id)}
                                        className="p-1.5 text-yellow-500 bg-yellow-50 hover:bg-yellow-100 rounded transition-colors"
                                        title="取消收藏"
                                    >
                                        <Star size={16} fill="currentColor" />
                                    </button>
                                    
                                    {creator.lastAnalyzedAt ? (
                                        <>
                                            <button 
                                                onClick={() => handleViewReport(creator.id)}
                                                className="px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded hover:bg-gray-50 flex items-center gap-1"
                                            >
                                                <FileText size={12} /> 历史分析
                                            </button>
                                            <button 
                                                onClick={() => handleAnalyze([creator.id])}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                                title="重新分析"
                                            >
                                                <RefreshCw size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <button 
                                            onClick={() => handleAnalyze([creator.id])}
                                            className="px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50 flex items-center gap-1"
                                        >
                                            <Zap size={12} /> 开始分析
                                        </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    );
                })
             )}
           </tbody>
         </table>
      </div>

      {/* Batch Operations Bar */}
      {selectedCreatorIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-xl border border-gray-200 p-4 w-auto min-w-[500px] flex items-center justify-between z-20 animate-slideUp">
           <div className="flex items-center gap-3">
             <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
               {selectedCreatorIds.length}
             </div>
             <span className="text-sm font-medium text-gray-700">已选择达人</span>
             <div className="h-4 w-px bg-gray-300 mx-2"></div>
             <button 
               onClick={() => setSelectedCreatorIds([])}
               className="text-sm text-gray-500 hover:text-gray-800"
             >
               取消选择
             </button>
           </div>
           <div className="flex gap-3">
             <button 
                onClick={handleBatchRemove}
                className="px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center gap-2"
             >
               <Trash2 size={16} /> 批量取消收藏
             </button>
             <button 
                onClick={() => handleAddToPool(selectedCreatorIds.length)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
             >
                <Plus size={16} /> 批量加入达人池
             </button>
             <button 
               onClick={handleBatchAnalyzeClick}
               className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 flex items-center gap-2"
             >
               <Zap size={16} /> 批量分析
             </button>
           </div>
        </div>
      )}

      {/* Batch Analysis Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn">
             {/* Header */}
             <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
               <h3 className="font-bold text-gray-900">
                 {analysisStep === 'SELECT' ? 'AI匹配分析' : '分析任务已提交'}
               </h3>
               <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-700">
                 <X size={20} />
               </button>
             </div>

             {/* Content: Step 1 Select */}
             {analysisStep === 'SELECT' && (
                <div className="p-6">
                   <p className="text-sm text-gray-600 mb-4">
                     即将对已选的 <span className="font-bold text-blue-600">{selectedCreatorIds.length}</span> 位达人进行深度匹配分析。
                   </p>
                   
                   <div className="mb-4">
                     <label className="block text-sm font-medium text-gray-700 mb-2">选择关联商品</label>
                     
                     {/* Search Box */}
                     <div className="relative mb-3">
                        <input 
                          type="text"
                          placeholder="搜索商品名称..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        />
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                     </div>

                     {/* Product List */}
                     <div className="border border-gray-200 rounded-lg max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredProducts.length > 0 ? (
                          filteredProducts.map(product => (
                            <div 
                               key={product.id}
                               onClick={() => setSelectedProductId(product.id)}
                               className={`flex items-center gap-3 p-3 cursor-pointer transition-colors border-b border-gray-50 last:border-0 ${
                                 selectedProductId === product.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                               }`}
                            >
                               <img src={product.image} alt={product.title} className="w-10 h-10 rounded object-cover bg-gray-100" />
                               <div className="flex-1 min-w-0">
                                  <div className={`text-sm font-medium truncate ${selectedProductId === product.id ? 'text-blue-700' : 'text-gray-900'}`}>
                                    {product.title}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    ¥{product.price} · 销量 {product.sales}
                                  </div>
                               </div>
                               {selectedProductId === product.id && <CheckCircle className="text-blue-600 ml-2" size={18} />}
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-sm text-gray-400">
                            未找到相关商品
                          </div>
                        )}
                     </div>
                   </div>

                   <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 text-xs text-yellow-800 mb-6">
                     注意：批量分析可能需要几分钟时间生成报告。分析完成后，结果将自动保存至“历史记录”。
                   </div>

                   <div className="flex gap-3">
                      <button 
                        onClick={handleCloseModal}
                        className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                      >
                        取消
                      </button>
                      <button 
                        onClick={confirmBatchAnalysis}
                        disabled={!selectedProductId}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold text-white transition-colors ${selectedProductId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'}`}
                      >
                        开始分析
                      </button>
                   </div>
                </div>
             )}

             {/* Content: Step 2 Success */}
             {analysisStep === 'SUCCESS' && (
                <div className="p-8 text-center">
                   <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-scaleIn">
                      <CheckCircle size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-2">分析任务创建成功!</h3>
                   <p className="text-gray-500 text-sm mb-8">
                     系统正在后台为您分析 <span className="font-bold text-gray-900">{selectedCreatorIds.length}</span> 位达人的匹配数据。
                     <br />您可以前往历史记录查看进度。
                   </p>
                   
                   <button 
                     onClick={handleGoToResults}
                     className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                   >
                     查看分析结果
                   </button>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;