import React from 'react';
import { Plus, Clock, User, Trash2, Users, CheckCircle, MessageCircle, ShoppingBag } from 'lucide-react';
import { AnalysisRecord } from '../types';

interface Props {
  history: AnalysisRecord[];
  onNewAnalysis: () => void;
  onViewResult: (record: AnalysisRecord) => void;
}

const SmartMatchingHistory: React.FC<Props> = ({ history, onNewAnalysis, onViewResult }) => {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">智能匹配</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* New Analysis Card */}
        <div 
          onClick={onNewAnalysis}
          className="bg-white rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors min-h-[250px]"
        >
          <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-4 shadow-sm">
            <Plus size={28} />
          </div>
          <h3 className="font-semibold text-gray-900 text-lg">创建新的AI匹配分析</h3>
          <p className="text-sm text-gray-500 mt-2 text-center max-w-[200px]">关联商品与达人池，生成深度分析报告</p>
        </div>

        {/* History Cards */}
        {history.map((item) => (
          <div 
            key={item.id} 
            onClick={() => onViewResult(item)}
            className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col min-h-[250px]"
          >
            {/* Header */}
            <div className="p-5 flex gap-4 border-b border-gray-100 bg-gray-50/50">
              <img 
                src={item.product.image} 
                alt={item.product.title} 
                className="w-16 h-16 rounded-lg object-cover bg-white border border-gray-200" 
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-bold text-gray-900 truncate mb-1">{item.product.title}</h3>
                <p className="text-sm text-blue-600 font-bold">
                  {item.product.currency} {item.product.price.toFixed(2)}
                </p>
                <div className="flex items-center text-xs text-gray-400 mt-2 gap-2">
                  <Clock size={12} />
                  <span>{item.createdAt}</span>
                </div>
              </div>
              <button className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity self-start">
                <Trash2 size={16} />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="p-5 grid grid-cols-2 gap-4 flex-1">
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                 <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                   <Users size={12} /> 已分析
                 </div>
                 <div className="font-bold text-gray-900 text-lg">{item.creatorCount}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                 <div className="text-xs text-blue-600 mb-1 flex items-center justify-center gap-1">
                   <CheckCircle size={12} /> 推荐建联
                 </div>
                 <div className="font-bold text-blue-700 text-lg">{item.recommendedCount}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-2 text-center">
                 <div className="text-xs text-gray-500 mb-1 flex items-center justify-center gap-1">
                   <MessageCircle size={12} /> 已触达
                 </div>
                 <div className="font-bold text-gray-900 text-lg">{item.contactedCount}</div>
              </div>
              <div className="bg-green-50 rounded-lg p-2 text-center">
                 <div className="text-xs text-green-600 mb-1 flex items-center justify-center gap-1">
                   <ShoppingBag size={12} /> 已合作
                 </div>
                 <div className="font-bold text-green-700 text-lg">{item.collaboratedCount}</div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex justify-between items-center text-xs">
              <div className="flex items-center gap-2 text-gray-500">
                <User size={12} />
                <span>{item.createdBy}</span>
              </div>
              <span className="text-blue-600 font-medium group-hover:translate-x-1 transition-transform inline-flex items-center">
                查看详情 &gt;
              </span>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-4 bg-gray-50 rounded text-xs text-gray-500 border border-gray-200">
        <p className="font-semibold mb-1">💡 功能说明：</p>
        <p>此页面展示历史AI匹配记录。卡片数据展示了从“分析”到“合作”的漏斗转化情况。点击卡片可进入详情页查看“策略总结报告”并进行基于历史数据的深度二次分析。</p>
      </div>
    </div>
  );
};

export default SmartMatchingHistory;