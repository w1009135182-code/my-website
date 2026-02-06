import React, { useState } from 'react';
import { Search, ChevronDown, CheckCircle2, Trash2, ArrowLeft, X, Inbox } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_CREATORS } from '../constants';
import { Product, Creator } from '../types';

interface Props {
  onExecute: () => void;
  onBack: () => void;
}

const NewAnalysis: React.FC<Props> = ({ onExecute, onBack }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchMode, setSearchMode] = useState<'ID' | 'CONFIG'>('ID');
  const [searchResults, setSearchResults] = useState<Creator[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = () => {
    setIsLoading(true);
    // Simulate search delay
    setTimeout(() => {
        setIsLoading(false);
        setHasSearched(true);
        setSearchResults(MOCK_CREATORS); // Reset to mock for demo
    }, 800);
  };

  const handleClearAll = () => {
    if (searchResults.length === 0) return;
    if (window.confirm('确认清空所有搜索结果吗？')) {
      setSearchResults([]);
      setHasSearched(false);
    }
  };

  const handleDeleteCreator = (id: string) => {
    if (window.confirm('确认删除该达人吗？')) {
      setSearchResults(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden bg-gray-50">
      {/* Left Panel: Configuration */}
      <div className="w-full md:w-2/5 p-6 border-r border-gray-200 overflow-y-auto bg-white flex flex-col gap-6">
        
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 pb-2">
            <button 
                onClick={onBack}
                className="p-2 -ml-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                title="返回"
            >
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">创建分析任务</h1>
        </div>

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">第一步：选择推广商品</h2>
          <div className="relative">
             <select 
               className="w-full p-3 border border-gray-300 rounded-lg appearance-none bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
               onChange={(e) => {
                 const prod = MOCK_PRODUCTS.find(p => p.id === e.target.value);
                 setSelectedProduct(prod || null);
               }}
             >
                <option value="">请选择商品库中的商品...</option>
                {MOCK_PRODUCTS.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
             </select>
             <ChevronDown className="absolute right-3 top-3.5 text-gray-400 pointer-events-none" size={16} />
          </div>

          {selectedProduct && (
            <div className="mt-4 p-4 border border-blue-100 bg-blue-50/30 rounded-lg flex gap-4 animate-fadeIn">
              <img src={selectedProduct.image} alt={selectedProduct.title} className="w-20 h-20 object-cover rounded bg-white" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{selectedProduct.title}</h3>
                <div className="text-blue-600 font-bold mt-1">¥ {selectedProduct.price}</div>
                <div className="text-xs text-gray-500 mt-2 space-x-3">
                  <span>销量: {selectedProduct.sales}</span>
                  <span>评价: {selectedProduct.reviews}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 mb-4">第二步：选择达人来源</h2>
          
          <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${searchMode === 'ID' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSearchMode('ID')}
            >
              ID搜索
            </button>
            <button 
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${searchMode === 'CONFIG' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setSearchMode('CONFIG')}
            >
              条件筛选搜索
            </button>
          </div>

          {searchMode === 'ID' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">输入达人ID或主页链接</label>
                <textarea 
                  className="w-full h-40 p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none bg-white"
                  placeholder="例如: @techguru_leo, @beauty_sarah (支持批量输入，用逗号或换行分隔)"
                ></textarea>
              </div>
              <button 
                onClick={handleSearch}
                className="w-full py-2.5 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                搜索达人
              </button>
            </div>
          ) : (
             <div className="space-y-4">
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">目标国家/地区</label>
                 <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                   <option>全部国家/地区</option>
                   <option>Philippines</option>
                   <option>Thailand</option>
                   <option>Vietnam</option>
                   <option>Malaysia</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-1">粉丝数范围</label>
                 <div className="flex items-center gap-2">
                   <select className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm bg-white">
                     <option>10000+</option>
                     <option>50000+</option>
                     <option>100000+</option>
                   </select>
                   <span className="text-gray-400">-</span>
                   <select className="w-1/2 p-2 border border-gray-300 rounded-lg text-sm bg-white">
                      <option>不限</option>
                      <option>100万</option>
                   </select>
                 </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">目标搜索人数</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                      <option>50个达人</option>
                      <option>100个达人</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">内容垂直</label>
                    <select className="w-full p-2 border border-gray-300 rounded-lg text-sm bg-white">
                      <option>美妆护肤</option>
                      <option>3C数码</option>
                      <option>家居生活</option>
                    </select>
                 </div>
               </div>
                <button 
                  onClick={handleSearch}
                  className="w-full py-2.5 bg-white border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors mt-2"
                >
                  搜索达人
                </button>
             </div>
          )}
        </div>
      </div>

      {/* Right Panel: Preview */}
      <div className="w-full md:w-3/5 p-6 flex flex-col relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">达人搜索结果</h2>
          <div className="flex items-center gap-4">
              {searchResults.length > 0 && (
                 <span className="text-sm text-gray-500">找到{searchResults.length}位达人</span>
              )}
              {searchResults.length > 0 && (
                  <button 
                    onClick={handleClearAll} 
                    className="flex items-center justify-center gap-1.5 bg-white border border-gray-200 hover:bg-red-50 hover:border-red-200 text-gray-600 hover:text-red-600 rounded-lg transition-all text-sm font-medium shadow-sm w-[98px] h-[38px]"
                  >
                    <Trash2 size={16} />
                    清空
                  </button>
              )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-20">
          {isLoading ? (
             <div className="flex items-center justify-center h-full text-gray-500">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
               正在搜索匹配达人...
             </div>
          ) : !hasSearched ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 pb-20">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                    <Inbox size={40} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">暂无数据</h3>
                <p className="text-sm text-gray-500 max-w-xs text-center">请选择商品并搜索达人，搜索结果将显示在这里</p>
             </div>
          ) : searchResults.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                <Search size={48} className="mb-4 opacity-20" />
                <p>未找到符合条件的达人</p>
             </div>
          ) : searchResults.map(creator => (
            <div key={creator.id} className="relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-4 group hover:border-blue-200 transition-colors">
              <img src={creator.avatar} className="w-12 h-12 rounded-full bg-gray-200" alt={creator.nickname} />
              <div className="flex-1 pr-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{creator.nickname}</h3>
                    <p className="text-xs text-gray-500">ID: {creator.id} | 地区: {creator.region}</p>
                  </div>
                  <a href="#" className="text-xs text-blue-600 hover:underline">查看TikTok主页</a>
                </div>
                <div className="mt-2 text-xs text-gray-600 flex gap-4">
                  <span>粉丝数: {(creator.followers / 1000).toFixed(1)}K</span>
                  <span>视频数: {creator.videos}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {creator.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => handleDeleteCreator(creator.id)}
                className="absolute top-2 right-2 p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                title="删除"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Action Bar */}
        <div className="absolute bottom-6 right-6">
           <button 
             onClick={onExecute}
             disabled={!selectedProduct || searchResults.length === 0}
             className={`px-8 py-3 rounded-xl shadow-lg font-bold text-white transition-all flex items-center gap-2 ${selectedProduct && searchResults.length > 0 ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105' : 'bg-gray-400 cursor-not-allowed'}`}
           >
             <CheckCircle2 size={20} />
             执行分析
           </button>
        </div>
      </div>
    </div>
  );
};

export default NewAnalysis;